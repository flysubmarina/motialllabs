<template>
    <div>
        <h1>Оценки</h1>
        <hr>
        {{(currentCritId != -1)?criterion.find((el=>{return el.IdCrit == currentCritId})).CName:'Выберите критерий'}}
    <hr>
    <b-button variant="warning" @click="resetTable">Сбросить</b-button>
    <b-dropdown  id="criterion_dd" :text="ddtext" class="m-md-2">
        <b-dropdown-item @click="handleDropClick(item.IdCrit)" v-for="item in criterion" :key="item.IdCrit">{{item.CName}}</b-dropdown-item>
    </b-dropdown>
     <b-input-group>
    <b-form-input class="m-md-2" type="text"
                      placeholder="Введите оценку"
                      v-model="name">
    </b-form-input>
  </b-input-group>
        <b-button class="m-md-2" variant="success" @click="handleAdd">Добавить оценку</b-button>
<b-modal v-model="showEditForm"
             id="editForm"
             ref="modalEdit"
             title="Редактировать оценку"
             @ok="handleEdit">
      <form @submit.stop.prevent="handleSubmitEditForm">
        <b-form-input type="text" class="m-md-2"
                      placeholder="Оценка"
                      v-model="nameEdit">
        </b-form-input>
        <b-dropdown  id="criterion_ddedit" :text="ddtextEdit" class="m-md-2">
        <b-dropdown-item @click="handleDropCritClick(item.IdCrit)" v-for="item in criterion" :key="item.IdCrit">{{item.CName}}</b-dropdown-item>
    </b-dropdown>
      </form>
    </b-modal>


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
  name: "MyMark",
  data() {
    return {
      name: "",
      nameEdit: "",
      criterion: [],
      currentCritId: -1,
      currentCritEditId: -1,
      isBusy: false,
      showAddFrom: false,
      showEditForm: false
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
    },
    ddtextEdit() {
      //return '123'
      return this.currentCritEditId != -1
        ? this.criterion.find(el => {
            return el.IdCrit == this.currentCritEditId;
          }).CName
        : "Выберите критерий";
    },
    fields() {
      return ["IdMark", "CName", "MName", "Actions"];
    }
  },
  methods: {
    handleEditClick(item) {
      this.nameEdit = item.MName;
      this.currentEditId = item.IdMark;
      this.currentCritEditId = item.IdCrit;
      this.showEditForm = true;
    },
    handleEdit(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      if (!this.nameEdit) {
        alert("Пожалуйста введите новую оценку");
      } else {
        if (this.currentCritEditId != -1) {
          this.handleSubmitEditForm();
        } else alert("Пожалуйста выберите критерий");
      }
    },
    handleSubmitEditForm() {
      if (this.currentEditId != -1) {
        console.log(
          "Все поля оедактирования",
          this.currentCritEditId,
          this.nameEdit,
          this.currentCritEditId
        );

        api()
          .put("/mark", {
            IdMark: this.currentEditId,
            MName: this.nameEdit,
            IdCrit: this.currentCritEditId
          })
          .then(res => {
            console.log("res", res);

            this.isBusy = true;
            this.currentCritId = -1;
            this.currentEditId = -1;
            this.$refs.table.refresh();
            this.$refs.modalEdit.hide();

            this.isBusy = false;
          });
      } else {
        console.log("wrong edit id");
      }
    },
    handleAdd(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      if (!this.name) {
        alert("Пожалуйста введите оценку");
      } else {
        if (this.currentCritId != -1) {
          this.handleSubmitAddForm();
        } else {
          alert("Пожалуйста выберите критерий");
        }
      }
    },
    handleSubmitAddForm() {
      api()
        .post("/mark", {
          MName: this.name,
          IdCrit: this.currentCritId
        })
        .then(res => {
          this.isBusy = true;
          this.currentCritId = -1;
          this.$refs.table.refresh();
          this.clearAddFields();
          this.isBusy = false;
        });
    },
    clearAddFields() {
      this.name = "";
    },
    resetTable() {
      this.currentCritId = -1;
      this.$refs.table.refresh();
    },
    myProvider(ctx) {
      this.isBusy = true;
      api()
        .get("criterion")
        .then(res => {
          this.criterion = res.data;
          console.log(this.criterion);
        });
      let promise;
      if (this.currentCritId == -1) {
        promise = api().get("mark");
      } else {
        promise = api().get(`mark/getmarkbycrit/${this.currentCritId}`);
      }

      return promise
        .then(data => {
          const items = data.data;
          let innerArr = [];
          console.log(items);
          items.forEach((val, index) => {
            if (this.criterion.length > 0) {
              let CName = this.criterion.find((el, index) => {
                return el.IdCrit == val.IdCrit;
              }).CName;

              innerArr.push({
                IdMark: val.IdMark,
                IdCrit: val.IdCrit,
                CName: CName,
                MName: val.MName
              });
            }
          });
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false;
          // console.log(innerArr);
          return innerArr;
        })
        .catch(error => {
          console.error(error);
          return [];
        });
    },
    handleDropClick(id) {
      this.currentCritId = id;
      this.$refs.table.refresh();
    },
    handleDropCritClick(id) {
      this.currentCritEditId = id;
    },
    handleDelete(item) {
      api()
        .delete("mark", {
          data: {
            IdMark: item.IdMark
          }
        })
        .then(res => {
          this.$refs.table.refresh();
          console.log(res);
        });
    }
  }
};
</script>
<style scoped>
.inputmark{
  margin: 20px;
}
</style>
