<template>
  <div>
    <h1 class="center">{{(lpr[currentLPR])? lpr[currentLPR].LName: 'Кто-то'}} ставит оценки</h1>
    <b-form-group label="Выберите лучшую альтернативу">
      <b-form-radio-group id="radios1" v-model="selected" :options="options" name="radioOpenions"></b-form-radio-group>
    </b-form-group>
    <b-button @click="Select">Выбрать</b-button>

    <template v-for="alt in alternativeDescription">
      <h2 :key="alt[0].IdAlt">{{alt[0].AName}}</h2>
      <span v-for="crit in alt" :key="crit.IdVect">
        <p>{{crit.CName}}: {{crit.MName}} {{(crit.EdIzmer != '-')? crit.EdIzmer: ''}}</p>
      </span>
    </template>
  </div>
</template>

<script>
import api from "../api/api.js";
export default {
  name: "lab41",
  data() {
    return {
      currentLPR: 0,
      readyLPR: false,
      alternativeReady: false,
      lpr: [],
      alternatives: [],
      selected: "", // Must be an array reference!
      options: [
        // { text: "Orange", value: "orange" },
        // { text: "Apple", value: "apple" },
        // { text: "Pineapple", value: "pineapple" },
        // { text: "Grape", value: "grape" }
      ],
      alternativeDescription: [],
      selectMap: new Map()
    };
  },
  created() {
    api()
      .get("lpr")
      .then(res => {
        this.lpr = res.data;
        this.readyLPR = true;
      });
    let promises = [];
    api()
      .get("alternative")
      .then(res => {
        this.alternatives = res.data;
        this.selected = res.data[0].AName;
        this.alternatives.forEach((element, index) => {
          this.options.push({ text: element.AName, value: element.AName });
        });
        for (let i = 0; i < this.alternatives.length; i++) {
          let promise = this.getAlternative(i);
          promises.push(promise);
        }
        Promise.all(promises).then(res => {
          this.alternativeDescription = res;
        });
        this.alternativeReady = true;
      });
  },
  methods: {
    Select() {
      if (!(this.currentLPR == this.lpr.length - 1)) {
        const val = this.selectMap.get(this.selected);
        if (val) {
          this.selectMap.set(this.selected, val + 1);
        } else this.selectMap.set(this.selected, 1);
        this.currentLPR++;
      } else {
        this.finish();
      }
    },
    finish() {
        let maxValue = -Infinity;
        let maxAName = "";
        this.selectMap.forEach((val, key)=>{
            if(val > maxValue) {
                maxValue = val;
                maxAName = key;
            }
        })
        alert(maxAName)
    },
    async getAlternative(id) {
      let result = [];
      let IdAlt = this.alternatives[id].IdAlt;

      await api()
        .get(`vector/general/${IdAlt}`)
        .then(res => {
          result = res.data;
        });
      return result || [];
    }
  }
};
</script>

<style scoped>
.center {
  text-align: center;
}
</style>