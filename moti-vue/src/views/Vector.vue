<template>
    <div>
        <h1>Вектор</h1>
        <b-modal v-model="showAddForm"
             id="addForm"
             ref="modalAdd"
             title="Добавить новый вектор"
             @ok="handleAddSubmit"
             >
             <template v-for="item in criterionAdd">
              <div class = "block" v-if="item" :key="item[0].IdCrit"> 
                {{(item)?item[0].CName:''}}
               <b-dropdown variant="primary" :id="item[0].CName" :text="(selectedCrit[item[0].IdCrit])?selectedCrit[item[0].IdCrit].MName:'Выберите оценку'"  class="m-md-2" >
                  <b-dropdown-item @click="handleDropSelectMark(it.IdMark,it.MName, it.IdCrit,it)" v-for="(it, index) in item" :key="index">{{it.MName}}</b-dropdown-item>
               </b-dropdown>
              </div>
               
             </template>
             </b-modal>
             <b-modal v-model="showEditForm"
             id="editForm"
             ref="modalEdit"
             title="Редактировать вектор"
             @ok="handleEditSubmit"
             >
             <h3>{{text}}</h3>
              <b-dropdown variant="primary" :text="currentEditMName" id="editCrit" class="m-md-2" >
                  <b-dropdown-item @click="handleDropEditSelectMark(it)" v-for="(it, index) in criterionEditArr" :key="index">{{it.MName}}</b-dropdown-item>
               </b-dropdown>
            </b-modal>
             <!-- <b-modal v-model="showEditForm"
             id="editForm"
             ref="modalEdit"
             title="Редактировать вектор"
             @ok="handleEditSubmit"
             >
             <template v-for="item in criterionEdit">
              <div class = "block" v-if="item" :key="item[0].IdCrit"> 
                {{(item)?item[0].CName:''}}
               <b-dropdown variant="primary" :id="item[0].CName" :text="(selectedCrit[item[0].IdCrit])?selectedCrit[item[0].IdCrit].MName:'Выберите оценку'"  class="m-md-2" >
                  <b-dropdown-item @click="handleDropSelectMark(it.IdMark,it.MName, it.IdCrit)" v-for="(it, index) in item" :key="index">{{it.MName}}</b-dropdown-item>
               </b-dropdown>
              </div>
               
             </template>
             </b-modal> -->
        <b-dropdown variant="primary" id="alternative" :text="altText" class="m-md-2">
        <b-dropdown-item @click="handleDropClick(item.IdAlt)" v-for="item in alternative" :key="item.IdAlt">{{item.AName}}</b-dropdown-item>
    </b-dropdown>
    <b-button variant="success" class="m-md-2" @click="handleAdd">Добавить вектор</b-button>
    <!-- <b-button variant="warning" class="m-md-2" @click="handleEdit">Редактировать вектор</b-button> -->
    <b-table ref="table" :items="myProvider" :fields = "fields" :busy="isBusy">
        <template slot="Actions" slot-scope="row">
            <b-button-group>
            <b-button variant="danger" @click="handleDelete(row.item)">Удалить</b-button>
            <b-button variant="warning" @click="handleEditClick(row.item)">Редактировать</b-button>
            </b-button-group>
        </template>
    </b-table>
    </div>
</template>
<script>
import api from "../api/api.js";
export default {
  name: "vector",
  data() {
    return {
      flag:false,
      currentVectEdit: -1,
      currentEditMName: "Выберите оценку",
      currentEditIdMark: -1,
      currentEditCrit: -1,
      showEditForm: false,
      showAddForm: false,
      fields: ["CName", "MName", "EdIzmer", "Actions"],
      isBusy: false,
      alternative: [],
      criterionAdd: [],
      criterionEdit: [],
      criterion: [],
      selectedCrit: [],
      tableItems: [],
      currentAlternativeId: -1
    };
  },
  computed: {
    text(){
      return (this.currentEditCrit != -1)?this.criterion[this.currentEditCrit][0].CName:'123456';
    },
    criterionEditArr() {
      return this.criterion[this.currentEditCrit];
    },
    criterionEditText() {
      return this.currentEditCrit != -1
        ? this.criterion[this.currentEditCrit].MName
        : "Выберите оценку";
    },
    altText() {
      const element = this.alternative.find(val => {
        return val.IdAlt == this.currentAlternativeId;
      });
      return this.currentAlternativeId != -1
        ? element.AName
        : "Выберите Альтернативу";
    }
  },
  methods: {
    handleDelete(item) {
      api()
        .delete("vector", {
          data: {
            IdVect: item.IdVect
          }
        })
        .then(res => {
          this.isBusy = true;
          this.$refs.table.refresh();
          this.isBusy = false;
          console.log(res);
        });
    },
    critText(id) {
      return this.selectedCrit[id] ? this.selectedCrit[id] : "Выберите оценку";
    },
    handleDropEditSelectMark(it) {
      this.currentEditIdMark = it.IdMark;
      this.currentEditMName = it.MName;
      console.log(this.currentEditIdMark);
    },
    handleDropSelectMark(IdMark, MName, IdCrit, it) {
      console.log(it);

      this.$set(this.selectedCrit, IdCrit, { MName: MName, IdMark: IdMark });
      //  console.log(MName, IdCrit);
    },
    handleAdd(evt) {
      if (this.currentAlternativeId != -1) {
        this.showAddForm = true;
      } else alert("Пожалуйста выберите альтернативу");
    },
    handleEditClick(item) {
      if (this.currentAlternativeId != -1) {
        this.currentVectEdit = item.IdVect;
        this.currentEditCrit = item.IdCrit;
        this.currentEditMName = item.MName;
        this.showEditForm = true;
      } else alert("Пожалуйста выберите альтернативу");
    },
    handleEditSubmit(evt) {
       console.log({
            IdVect: this.currentVectEdit,
            IdAlt: this.currentAlternativeId,
            IdMark: this.currentEditIdMark
          });
      evt.preventDefault();
      if (this.currentEditIdMark != -1) {
        api()
          .put("/vector", {
            IdVect: this.currentVectEdit,
            IdAlt: this.currentAlternativeId,
            IdMark: this.currentEditIdMark
          })
          .then(res => {
            this.isBusy = true;
            this.currentVectEdit = -1;
            this.currentEditIdMark = -1;
            this.currentEditMName = "Выберите оценку";
            this.$refs.table.refresh();
            this.$refs.modalEdit.hide();
            this.isBusy = false;
          });
      }
      // console.log(this.selectedCrit);
    },
    handleAddSubmit(evt) {
      evt.preventDefault();
      let promises = [];
      this.selectedCrit.forEach((val, index) => {
        if (val != undefined) {
          let promise = api().post("vector", {
            IdAlt: this.currentAlternativeId,
            IdMark: val.IdMark
          });
          promises.push(promise);
        }
      });
      Promise.all(promises)
        .then(results => {
          this.isBusy = true;
          // console.log(results);
          this.selectedCrit = [];
          this.showAddForm = false;
          this.$refs.table.refresh();
          this.isBusy = false;
        })
        .catch(err => console.log);
      // console.log(this.selectedCrit);
    },
    handleDropClick(id) {
      this.currentAlternativeId = id;
      this.flag = false;
      this.$refs.table.refresh();
    },
    myProvider(ctx) {
      api()
        .get("alternative")
        .then(res => {
          this.alternative = res.data;
        });

      let critPromise = api().get("criterion/critmark");
      let critResult = [];
      critPromise.then(res => {
        const items = res.data;
        items.forEach(val => {
          if (critResult[val.IdCrit] == undefined) critResult[val.IdCrit] = [];
          critResult[val.IdCrit].push(val);
        });
        //      console.log(critResult);
        this.criterion = critResult;
      if(!this.flag) {
        this.criterionAdd = this.criterion;
        this.flag = true;
        }
      });
      //   console.log(ctx);
      let promise =
        this.currentAlternativeId == -1
          ? new Promise((resolve, reject) => {
              res = {};
              res.data = [];
              resolve(res);
            })
          : api().get(`vector/general/${this.currentAlternativeId}`);

      return promise
        .then(data => {
          const items = data.data;
          this.tableItems = items;
        let filtered =  this.criterion.filter(val => {
            let bool = this.tableItems.every(val1 => {
              return val1.CName != val[0].CName;
            });
            return bool;
          });
          let filtered2 = this.criterion.filter(val => {
            let bool = this.tableItems.some(val1 => {
              return val1.CName == val[0].CName;
            });
            return bool;
          });
          console.log("filtered2: ", filtered2);

          console.log("filtered1: ", filtered);
          this.criterionAdd = filtered;
          this.criterionEdit = filtered2;
          //  console.log(" criterion: ",this.criterion, " table records: ", this.tableItems);

          //  console.log("items: ", items);
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false;
          return items;
        })
        .catch(error => {
          return [];
        });
    }
  }
};
</script>
<style scoped>
.block {
  margin: 10px;
}
</style>
