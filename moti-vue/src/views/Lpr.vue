<template>
    <div>
        <h1>Лица принимающие решение</h1>
        <hr>
        <b-modal v-model="showAddForm"
             id="addForm"
             ref="modal"
             title="Добавить новое ЛПР"
             @ok="handleAdd"
             @shown="clearAddFields">
      <form @submit.stop.prevent="handleSubmitAddForm">
        <b-form-input type="text"
                      placeholder="Имя ЛПР"
                      v-model="name"></b-form-input>
      </form>
    </b-modal>
    <b-modal v-model="showEditForm"
             id="addForm"
             ref="modalEdit"
             title="Редактировать ЛПР"
             @ok="handleEdit"
             @shown="clearEditFields">
      <form @submit.stop.prevent="handleSubmitEditForm">
        <b-form-input type="text"
                      placeholder="Имя ЛПР"
                      v-model="nameEdit"></b-form-input>
      </form>
    </b-modal>
    <hr>



        <b-button variant="success" @click="showAddForm = true">Добавить ЛПР</b-button>
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
  name: "lpr",
  data() {
    return {
      currentEditId:-1,
      name: "",
      nameEdit:"",
      isBusy: false,
      fields: ["IdLPR", "LName", "Actions"],
      showAddForm: false,
      showEditForm: false
    };
  },
  methods: {
    myProvider(ctx) {
      let promise = api().get("lpr");
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
      api()
        .delete("lpr", {
          data: {
            IdLPR: item.IdLPR
          }
        })
        .then(res => {
          this.$refs.table.refresh();
          console.log(res);
        });
    },
    handleEditClick(item) {
      this.nameEdit = item.LName;
      this.currentEditId = item.IdLPR;
      this.showEditForm = true;
    },
    handleAdd(evt) {
      evt.preventDefault();
      if (!this.name) {
        alert("Пожалуйста введите имя ЛПР");
      } else {
        this.handleSubmitAddForm();
      }
    },
    handleSubmitAddForm() {
      api()
        .post("/lpr", {
          LName: this.name
        })
        .then(res => {
          this.isBusy = true;
          this.$refs.table.refresh();
          this.clearAddFields();
          this.$refs.modal.hide();

          this.isBusy = false;
        });
    },
    handleEdit(evt) {
      // Prevent modal from closing
      evt.preventDefault();
      if (!this.nameEdit) {
        alert("Пожалуйста введите имя нового ЛПР");
      } else {
        this.handleSubmitEditForm();
      }
    },
    handleSubmitEditForm() {
      if (this.currentEditId != -1) {
        api()
          .put("/lpr", {
            IdLPR: this.currentEditId,
            LName: this.nameEdit
          })
          .then(res => {
            this.isBusy = true;
            this.currentEditId = -1;
            this.$refs.table.refresh();
            this.clearEditFields();
            this.$refs.modalEdit.hide();

            this.isBusy = false;
          });
      }
    },
    clearAddFields() {
      this.name = "";
    },
    clearEditFields() {},

  }
};
</script>
<style scoped>
</style>