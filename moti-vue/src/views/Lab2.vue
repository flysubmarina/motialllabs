<template>
  <div>
    <h1>Лабораторная работа 2</h1>
    <b-container fluid>
      <template v-for="(crit,idx) in grouped">
        <h2 :key="idx">{{crit[0]}}</h2>
        <b-row class="my-1" v-for="mark in crit[1]" :key="mark.IdMark">
          <b-col sm="3">{{mark.MName}}</b-col>
          <b-col sm="9">
            <b-form-input type="text" v-model="nums[mark.IdMark]"></b-form-input>
          </b-col>
        </b-row>
      </template>

      <b-button @click="handleUpdate">Начать</b-button>
    </b-container>
    <p v-for="a in alphas" :key="a.CName">Критерий: {{a.CName}} альфа = {{a.alpha}}</p>
    <hr>
    <h2>Результаты:</h2>
    <p v-for="res in results" :key="res.AName">
      Название альтернативы: {{res.AName}} Балл:
      <span style="font-weight: bold">{{res.sum}}</span>
    </p>
  </div>
</template>

<script>
import api from "../api/api.js";
export default {
  data() {
    return {
      results: [],
      alphas: [],
      alternatives: [],
      primaryMarks: [],
      nums: [],
      marks: [],
      grouped: new Map()
    };
  },
  beforeMount() {
    this.getMarks();
  },
  computed: {
    bestAlternative() {}
  },
  methods: {
    handleUpdate() {
      let flag = true;
      this.nums.forEach(val => {
        if (val == "") {
          flag = false;
        }
      });
      if (flag) {
        this.handleSubmit();
      } else alert("Сначала заполните значения всех качественных критериев");
    },
    normalize(fmin, fmax, f) {
      if (fmin >= fmax) return 0;
      return (f - fmin) / (fmax - fmin);
    },
    handleSubmit() {
      let NumMarks = [];
      //  console.log(this.primaryMarks);

      this.primaryMarks.forEach(value => {
        if (!this.nums[value.IdMark]) {
          NumMarks.push({
            CName: value.CName,
            IdMark: value.IdMark,
            value: parseInt(value.MName, 10)
          });
        } else
          NumMarks.push({
            CName: value.CName,
            IdMark: value.IdMark,
            value: parseInt(this.nums[value.IdMark], 10)
          });
      });
      console.log(NumMarks);
      const grouped = this.groupBy(NumMarks, mark => mark.CName);
      console.log(grouped);
      let promiseData = [];
      grouped.forEach((value, key) => {
        const values = value.map(value => value.value);
        let max = Math.max(...values);
        let min = Math.min(...values);
        value.forEach(val => {
          console.log(val.value);
          promiseData.push({
            IdMark: val.IdMark,
            normalized:
              Math.round(this.normalize(min, max, val.value) * 100) / 100
          });
        });
      });
      console.log(promiseData);
      this.process(promiseData);
      //   this.nums.forEach((value, index) => {
      //     let promise = api().put("mark/nummark", {
      //       IdMark: index,
      //       NumMark: parseInt(value)
      //     });
      //     promises.push(promise);
      //   });
      //   Promise.all(promises).then(results => {

      //     console.log(results);
      //   });
    },
    process(normalizedMarks) {
      api()
        .get("vector/lab2")
        .then(res => {
          console.log("alternatives: ", res.data);
          this.alternatives = res.data;
          this.alternatives.forEach(value => {
            const found = normalizedMarks.find(
              norm => norm.IdMark == value.IdMark
            );
            let normalized = found.normalized;
            value.MName = normalized;
          });
          const grouped = this.groupBy(this.alternatives, alt => alt.CName);
          let sum = 0;
          grouped.forEach((value, key) => {
            sum = 0;
            value.forEach(val => {
              console.log("curr mname", val.MName);

              sum += parseInt(val.MName, 10);
            });

            this.alphas.push({
              alpha: sum > 0 ? 1 / sum : 0,
              CName: value[0].CName
            });
          });
          console.log("Alter group: ", grouped);
          console.log("Alphas: ", this.alphas);

          const groupByAlternative = this.groupBy(
            this.alternatives,
            a => a.AName
          );

          console.log("g by a:", groupByAlternative);

          let additiveSum = 0;

          groupByAlternative.forEach((value, currAName) => {
            additiveSum = 0;
            value.forEach(val => {
              const found = this.alphas.find(a => a.CName == value[0].CName);
              let alpha = found.alpha;
              additiveSum += alpha * val.MName;
            });
            this.results.push({ sum: additiveSum, AName: currAName });
            console.log({ sum: additiveSum, AName: currAName });
          });
        });
    },
    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach(item => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    },
    getMarks() {
      api()
        .get("criterion/critmark")
        .then(data => {
          const items = data.data;
          let resItems = [];
          console.log("Itesm: ", items);
          const bycrit = this.groupBy(items, item => item.CName);
          bycrit.forEach((value, index) => {
            if (value[0].OptimType == "Min") {
              const values = value.map(val => parseInt(val.MName));
              let max = Math.max(...values);
              value.forEach(val => {
                val.MName = max - parseInt(val.MName);
              });
            }
            resItems = resItems.concat(value);
          });
          console.log("Res: ", resItems);

          this.primaryMarks = resItems;
          console.log("Primary marks: ", this.primaryMarks);

          this.marks = resItems.filter(val => val.CType == "Качественный");

          this.grouped = Array.from(
            this.groupBy(this.marks, mark => mark.CName)
          );
          this.grouped.forEach(value => {
            let criterion = value[1];

            criterion.forEach(mark => {
              if (!this.nums[mark.IdMark]) this.nums[mark.IdMark] = "";
            });
          });
          // console.log(this.grouped);
        })
        .catch(error => {
          return [];
        });
    }
  }
};
</script>

<style scoped>
</style>