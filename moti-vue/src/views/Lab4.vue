<template>
  <div>
    <b-modal v-model="showResult" id="results" ref="modal" title="Результаты">
        <div v-for="(res,idx) in result" :key="idx">
            <p>{{res.AName}}: {{res.sum}} очков</p>
        </div>
        <div v-for="(el,idx) in compareArr" :key="idx">
            <p>{{el}}</p>
        </div>
    </b-modal>

    <b-button @click="init">Начать</b-button>
    <h1 class="center">{{(lpr[currentLPR])? lpr[currentLPR].LName: ''}} ставит оценки</h1>
    <div class="container">
      <div class="block">
        <h2>{{currentAlternativeName}}</h2>
        <span v-for="crit in currentAlternativeDescription" :key="crit.IdVect">
          <h5>{{crit.CName}}: {{crit.MName}} {{(crit.EdIzmer != '-')? crit.EdIzmer: ''}}</h5>
        </span>
      </div>
      <div class="block">
        <h2>{{comparisonAlternativeName}}</h2>
        <span v-for="crit in comparisonAlternativeDescription" :key="crit.IdVect">
          <h5>{{crit.CName}}: {{crit.MName}} {{(crit.EdIzmer != '-')? crit.EdIzmer: ''}}</h5>
        </span>
      </div>
      <!-- <div v-for="(el,idx) in Array.from(compareMap)" :key="idx">{{el}}</div> -->
    </div>
    <div v-if="showButtons" class="buttons">
      <b-button @click="currentBetter">{{currentAlternativeName}} лучше</b-button>
      <b-button @click="comparisonBetter">{{comparisonAlternativeName}} лучше</b-button>
      <b-button @click="equals">Альтернативы равны между собой</b-button>
    </div>
  </div>
</template>

<script>
import api from "../api/api.js";
export default {
  data() {
    return {
      finished: false,
      readyLPR: false,
      readyAlternative: false,
      showResult: false,
      calculated: false,
      result: [],
      lpr: [],
      currentLPR: 0,
      showButtons: false,
      comparisonAlternativeId: 1,
      currentAlternativeId: 0,
      alternatives: [],
      currentAlternativeDescription: [],
      comparisonAlternativeDescription: [],
      compareMap: new Map(),
      compareArr: []
    };
  },
  created() {
    api()
      .get("lpr")
      .then(res => {
        this.lpr = res.data;
        this.readyLPR = true;
      });
    api()
      .get("alternative")
      .then(res => {
        this.alternatives = res.data;
        this.readyAlternative = true;
      });
  },

  computed: {
    currentAlternativeName() {
      return this.currentAlternativeDescription[0]
        ? this.currentAlternativeDescription[0].AName
        : "";
    },
    comparisonAlternativeName() {
      return this.comparisonAlternativeDescription[0]
        ? this.comparisonAlternativeDescription[0].AName
        : "";
    }
  },
  methods: {
    async getAlternative(id) {
      let result = [];
      let IdAlt = this.alternatives[id].IdAlt;

      await api()
        .get(`vector/general/${IdAlt}`)
        .then(res => {
          result = res.data;
        });
      return result || [];
    },
    init() {
      if (this.readyLPR && this.readyAlternative) {
        const comparison = (a, b) => {
          if (a.CName > b.CName) {
            return 1;
          }
          if (a.CName < b.CName) {
            return -1;
          }
          // a должно быть равным b
          return 0;
        };
        this.getAlternative(0).then(res => {
          this.currentAlternativeDescription = res.sort(comparison);
        });
        this.getAlternative(1).then(res => {
          this.comparisonAlternativeDescription = res.sort(comparison);
        });
        this.showButtons = true;
      }
    },
    nextStep() {
      if (this.comparisonAlternativeId == this.alternatives.length - 1) {
        if (this.currentAlternativeId == this.alternatives.length - 1) {
          this.finish();
        } else {
          this.currentAlternativeId++;
          if (this.currentAlternativeId + 1 < this.alternatives.length)
            this.comparisonAlternativeId = this.currentAlternativeId + 1;
          else this.finish();
        }
      } else this.comparisonAlternativeId++;
    },
    currentBetter() {
      const key = `${this.currentAlternativeName};${
        this.comparisonAlternativeName
      }`;
      let val = this.compareMap.get(key);
      if (val) {
        this.compareMap.set(key, { a: val.a + 1, b: val.b });
      } else {
        this.compareMap.set(key, { a: 1, b: 0 });
      }
      this.nextStep();
    },
    comparisonBetter() {
      const key = `${this.currentAlternativeName};${
        this.comparisonAlternativeName
      }`;
      let val = this.compareMap.get(key);
      if (val) {
        this.compareMap.set(key, { a: val.a, b: val.b + 1 });
      } else {
        this.compareMap.set(key, { a: 0, b: 1 });
      }
      this.nextStep();
    },
    equals() {
      this.nextStep();
    },
    finish() {
      if (!this.finished) {
        if (this.currentLPR >= this.lpr.length - 1) {
          this.showButtons = false;  
          this.finished = true;  
          this.getResult();
        } else {
          this.currentLPR++;
          this.currentAlternativeId = 0;
          this.comparisonAlternativeId = 1;
        }
      }
    },
    calculate() {
      if (!this.calculated) {
        this.alternatives.forEach(value => {
          let { AName } = value;
          let sum = 0;
          this.compareMap.forEach((val, key) => {
            let str = key.split(";");
            let first = str[0];
            let last = str[str.length - 1];
            console.log(first, last);
            if (first == AName || last == AName) {
              if (first == AName) {
                if (val.a > val.b) {
                  sum += 1;
                } else if (val.a < val.b) {
                  sum -= 1;
                }
              }
              if (last == AName) {
                if (val.a > val.b) {
                  sum -= 1;
                } else if (val.a < val.b) {
                  sum += 1;
                }
              }
            }
          });
          this.result.push({ AName, sum });
          sum = 0;
        });
      }
      this.calculated = true;
    },
    getResult() {
      this.calculate();
      this.compareMap.forEach((val,key)=>{
          let str = key.split(';');
          let first = str[0];
          let last = str[str.length - 1];
          let digit = '>';
          if(val.a < val.b) {
              digit = '<'
          } else if(val.a == val.b) digit = '=';
          this.compareArr.push(`${first}${digit}${last} ${val.a}:${val.b}`)
      })
      this.showResult = true;

    }
  },
  watch: {
    comparisonAlternativeId(newVal, oldVal) {
      const comparison = (a, b) => {
        if (a.CName > b.CName) {
          return 1;
        }
        if (a.CName < b.CName) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      };
      this.getAlternative(newVal).then(res => {
        this.comparisonAlternativeDescription = res.sort(comparison);
      });
    },
    currentAlternativeId(newVal, oldVal) {
      const comparison = (a, b) => {
        if (a.CName > b.CName) {
          return 1;
        }
        if (a.CName < b.CName) {
          return -1;
        }
        // a должно быть равным b
        return 0;
      };
      this.getAlternative(newVal).then(res => {
        this.currentAlternativeDescription = res.sort(comparison);
      });
    }
  }
};
</script>

<style scoped>
.container {
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.buttons {
  margin: 0;
  padding: 12px 14px;
}
.buttons > * {
  margin-left: 10px;
}

.center {
  text-align: center;
}
</style>