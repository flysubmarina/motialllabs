<template>
<div>
    <h1>Альтернативы</h1>
    <hr>
    <b-form-group label="Тип оптимизации" v-show="currentCritId != -1">
      <b-form-radio-group  id="radios2" v-model="currentOptimType" name="radioSubComponent">
        <b-form-radio value="Max">Максимум</b-form-radio>
        <b-form-radio value="Min">Минимум</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <hr>
    {{(currentCritId != -1)?criterion.find((el=>{return el.IdCrit == currentCritId})).CName:'Выберите критерий'}}
    <hr>
    <b-button variant="warning" @click="resetTable">Сбросить</b-button>
    
    <b-dropdown  id="criterion_dd" :text="ddtext" class="m-md-2">
        <b-dropdown-item @click="handleDropClick(item.IdCrit)" v-for="item in criterion" :key="item.IdCrit">{{item.CName}}</b-dropdown-item>
    </b-dropdown>
    <b-modal v-model="showAddForm"
             id="addForm"
             ref="modal"
             title="Добавить новую альтернативу"
             @ok="handleAdd"
             @shown="clearAddFields">
      <form @submit.stop.prevent="handleSubmitAddForm">
        <b-form-input type="text"
                      placeholder="Название альтернативы"
                      v-model="name"></b-form-input>
      </form>
    </b-modal>

<b-modal v-model="showEditForm"
             id="addForm"
             ref="modalEdit"
             title="Редактировать альтернативу"
             @ok="handleEdit"
             @shown="clearEditFields">
      <form @submit.stop.prevent="handleSubmitEditForm">
        <b-form-input type="text"
                      placeholder="Название альтернативы"
                      v-model="nameEdit"></b-form-input>
      </form>
    </b-modal>


    <b-button variant="success" @click="showAddForm = true">Добавить альтернативу</b-button>
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
  name: "alternatives",
  data() {
    return {
      currentOptimType: "Max",
      currentEditId: -1,
      criterion: [],
      currentCritId: -1,
      nameEdit: "",
      name: "",
      showAddForm: false,
      showEditForm: false,
      isBusy: false,
      fields: ["IdAlt", "AName", "Actions"],
      alternatives: []
    };
  },
  computed: {
    ddtext() {
      //return '123'
      return this.currentCritId != -1
        ? this.criterion.find(el => {
            return el.IdCrit == this.currentCritId;
          }).CName
        : "Выберите критерий";
    }
  },
  watch: {
    currentOptimType: function(val) {
      this.$refs.table.refresh();
    }
  },
  methods: {
    resetTable() {
      this.currentCritId = -1;
      this.$refs.table.refresh();
    },
    handleDropClick(id) {
      console.log(id);
      this.currentCritId = id;
      this.$refs.table.refresh();
    },
    myProvider(ctx) {
      api()
        .get("criterion")
        .then(res => {
          this.criterion = res.data;
        });
      let promise =
        this.currentCritId == -1
          ? api().get("alternative")
          : api().get(
              `alternative/bycriterion/${this.currentCritId}/${
                this.currentOptimType
              }`
            );

      return promise
        .then(data => {
          const items = data.data;
          console.log(items);

          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false;
          return items;
        })
        .catch(error => {
          return [];
        });
    },
    handleDelete(item) {
      console.log(item.IdAlt);

      api()
        .delete("alternative", {
          data: {
            IdAlt: item.IdAlt
          }
        })
        .then(res => {
          this.$refs.table.refresh();
          console.log(res);
        });
    },
    handleEditClick(item) {
      this.nameEdit = item.AName;
      this.currentEditId = item.IdAlt;
      this.showEditForm = true;
    },
    clearAddFields() {
      this.name = "";
    },
    clearEditFields() {},
    handleAdd(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      if (!this.name) {
        alert("Пожалуйста введите название альтернативы");
      } else {
        this.handleSubmitAddForm();
      }
    },
    handleEdit(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      if (!this.nameEdit) {
        alert("Пожалуйста введите название альтернативы");
      } else {
        this.handleSubmitEditForm();
      }
    },
    handleSubmitAddForm() {

      api()
        .post("/alternative", {
          AName: this.name
        })
        .then(res => {
          this.isBusy = true;
          this.currentCritId = -1;
          this.$refs.table.refresh();
          this.clearAddFields();
          this.$refs.modal.hide();

          this.isBusy = false;
        });
    },
    handleSubmitEditForm() {
      if (this.currentEditId != -1) {
        api()
          .put("/alternative", {
            IdAlt: this.currentEditId,
            newAName: this.nameEdit
          })
          .then(res => {
            this.isBusy = true;
            this.currentCritId = -1;
            this.currentEditId = -1;
            this.$refs.table.refresh();
            this.clearEditFields();
            this.$refs.modalEdit.hide();

            this.isBusy = false;
          });
      }
    }
  }
};

/*<table class="table">
    <tr>
        <th>ID Альтернативы</th>
        <th>Название</th>
        <th>Действия</th>
    </tr>
    <tr v-for="alt in alternatives" :key="alt.IdAlt">
        <td>{{alt.IdAlt}}</td>
        <td>{{alt.AName}}</td>
        <td>
            <b-button @click="">Редактировать</b-button>
            <b-button>Удалить</b-button>
            <b-button>Редактировать</b-button>
        </td>
    </tr>
    </table>*/
</script>
<style scoped>
</style>
