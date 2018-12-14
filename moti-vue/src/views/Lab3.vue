<template>
  <div>
    <b-container class="bv-example-row">
      <b-row>
        <h2>Альтернативы</h2>
        <b-col cols="8">
          <b-list-group>
            <b-list-group-item v-for="alter in alternatives" :key="alter.IdAlt">
              {{alter.AName}}
              <transition name="fade">
                <b-badge :key="alter.IdAlt"
                  v-show="bestAlternative == alter.AName"
                  variant="success"
                >Лучшая альтернатива</b-badge>
              </transition>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>

    <b-modal v-model="showResult" id="results" ref="modal" title="Результаты">
      <b-container class="bv-example-row">
      <b-row>
        <h2>Альтернативы</h2>
        <b-col cols="12">
          <b-list-group>
            <b-list-group-item v-for="alter in alternatives" :key="alter.IdAlt">
              {{alter.AName}}
              <transition name="fade">
                <b-badge :key="alter.IdAlt"
                  v-show="bestAlternative == alter.AName"
                  variant="success"
                >Лучшая альтернатива</b-badge>
              </transition>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
    </b-modal>
    <b-button @click="init" v-if="startShow" class="text-center my-3">Начать</b-button>
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
    <div v-if="showButtons" class="buttons text-center my-3">
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
      startShow: true,
      bestAlternative: "",
      finished: false,
      readyAlternative: false,
      showResult: false,
      calculated: false,
      result: [],
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
      if (this.readyAlternative) {
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
          this.bestAlternative = this.currentAlternativeDescription[0].AName;
        });
        this.getAlternative(1).then(res => {
          this.comparisonAlternativeDescription = res.sort(comparison);
        });
        this.showButtons = true;
        this.startShow = false;
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
      if (
        this.comparisonAlternativeDescription[0].AName == this.bestAlternative
      ) {
        this.bestAlternative = this.currentAlternativeDescription[0].AName;
      }
      this.nextStep();
    },
    comparisonBetter() {
      if (this.currentAlternativeDescription[0].AName == this.bestAlternative) {
        this.bestAlternative = this.comparisonAlternativeDescription[0].AName;
      }
      this.nextStep();
    },
    equals() {
      this.nextStep();
    },
    finish() {
      if (!this.finished) {
         this.showResult = true; 
        this.finished = true;
      }
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
.flip-list-move {
  transition: transform 1s;
}
</style>