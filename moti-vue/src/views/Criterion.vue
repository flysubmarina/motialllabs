<template>
    <div>
        <h1>Критерии</h1>
        <hr>
<b-modal v-model="showAddForm"
             id="addForm"
             ref="modal"
             title="Добавить новый критерий"
             @ok="handleAdd"
             @shown="clearAddFields">
      <form @submit.stop.prevent="handleSubmitAddForm">
        <b-form-input type="text"
                      placeholder="Название критерия"
                      v-model="name">
        </b-form-input>
        Тип критерия:<b-dropdown  id="criterion_ctype" :text="ddtextCType" class="m-md-2">
            <b-dropdown-item @click="handleDropCTypeClick(index)" v-for="(item, index) in CTypes" :key="item.type">{{item.type}}</b-dropdown-item>
        </b-dropdown><br>
        Тип оптимизации:<b-dropdown  id="criterion_optim" :text="ddtextOptimType" class="m-md-2">
            <b-dropdown-item @click="handleDropOptimTypeClick(index)" v-for="(item, index) in OptimTypes" :key="item.type">{{item.type}}</b-dropdown-item>
        </b-dropdown><br>
        Eдиница измерения:<b-dropdown  id="criterion_edizmer" :text="ddtextEdIzmer" class="m-md-2">
            <b-dropdown-item @click="handleDropEdIzmerClick(index)" v-for="(item, index) in EdIzmer" :key="item.type">{{item.type}}</b-dropdown-item>
        </b-dropdown><br>
        Тип шкалы:<b-dropdown  id="criterion_scaletype" :text="ddtextScaleType" class="m-md-2">
            <b-dropdown-item @click="handleDropScaleTypeClick(index)" v-for="(item, index) in ScaleType" :key="item.type">{{item.type}}</b-dropdown-item>
        </b-dropdown>
      </form>
    </b-modal>


<b-modal v-model="showEditForm"
             id="editForm"
             ref="modalEdit"
             title="Редактировать новый критерий"
             @ok="handleEdit">
      <form @submit.stop.prevent="handleSubmitEditForm">
        <b-form-input type="text"
                      placeholder="Название критерия"
                      v-model="nameEdit">
        </b-form-input>
        Тип критерия:<b-dropdown  id="criterion_ctype" :text="ddtextCType" class="m-md-2">
            <b-dropdown-item @click="handleDropCTypeClick(index)" v-for="(item, index) in CTypes" :key="item.type">{{item.type}}</b-dropdown-item>
        </b-dropdown><br>
        Тип оптимизации:<b-dropdown  id="criterion_optim" :text="ddtextOptimType" class="m-md-2">
            <b-dropdown-item @click="handleDropOptimTypeClick(index)" v-for="(item, index) in OptimTypes" :key="item.type">{{item.type}}</b-dropdown-item>
        </b-dropdown><br>
        Eдиница измерения:<b-dropdown  id="criterion_edizmer" :text="ddtextEdIzmer" class="m-md-2">
            <b-dropdown-item @click="handleDropEdIzmerClick(index)" v-for="(item, index) in EdIzmer" :key="item.type">{{item.type}}</b-dropdown-item>
        </b-dropdown><br>
        Тип шкалы:<b-dropdown  id="criterion_scaletype" :text="ddtextScaleType" class="m-md-2">
            <b-dropdown-item @click="handleDropScaleTypeClick(index)" v-for="(item, index) in ScaleType" :key="item.id">{{item.type}}</b-dropdown-item>
        </b-dropdown>
      </form>
    </b-modal>



        <b-button variant="success" @click="showAddForm = true">Добавить критерий</b-button>
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
  name: "criterion",
  data() {
    return {
      currentEditId: -1,
      showEditForm: false,
      showAddForm: false,
      name: "",
      nameEdit: "",
      CTypeId: 0,
      EdIzmerId: 0,
      OptimTypeId: 0,
      ScaleTypeId: 0,
      ScaleType: [
        { id: 0, type: "Абсолютная шкала" },
        { id: 1, type: "Шкала отношений" },
        { id: 2, type: "Номинальная шкала" },
        { id: 3,type: "Шкала порядка" },
        { id: 4, type: "Шкала" }
      ],
      CTypes: [{ type: "Количественный" }, { type: "Качественный" }],
      OptimTypes: [{ type: "Маx" }, { type: "Min" }],
      EdIzmer: [
        { type: "MGz" },
        { type: "грн" },
        { type: "Gb" },
        { type: "bit" },
        { type: "-" }
      ],
      isBusy: false,
      fields: [
        "IdCrit",
        "CName",
        "CType",
        "OptimType",
        "EdIzmer",
        "ScaleType",
        "Actions"
      ]
    };
  },
  computed: {
    ddtextScaleType() {
      return this.ScaleType[this.ScaleTypeId].type;
    },
    ddtextCType() {
      return this.CTypes[this.CTypeId].type;
    },
    ddtextOptimType() {
      return this.OptimTypes[this.OptimTypeId].type;
    },
    ddtextEdIzmer() {
      return this.EdIzmer[this.EdIzmerId].type;
    }
  },
  methods: {
    handleDropScaleTypeClick(id) {
      this.ScaleTypeId = id;
    },
    handleDropCTypeClick(id) {
      this.CTypeId = id;
    },
    handleDropOptimTypeClick(id) {
      this.OptimTypeId = id;
    },
    handleDropEdIzmerClick(id) {
      this.EdIzmerId = id;
    },
    myProvider(ctx) {
      let promise = api().get("criterion");

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
        .delete("criterion", {
          data: {
            IdCrit: item.IdCrit
          }
        })
        .then(res => {
          this.$refs.table.refresh();
          console.log(res);
        });
    },
    handleEditClick(item) {
      let { IdCrit, CName, CType, EdIzmer, OptimType, ScaleType } = item;
      this.currentEditId = IdCrit;
      this.nameEdit = CName;
      this.CTypes.forEach((val, index, arr) => {
        if (val.type == CType) this.CTypeId = index;
      });
      this.EdIzmer.forEach((val, index, arr) => {
        if (val.type == EdIzmer) this.EdIzmerId = index;
      });
      this.OptimTypes.forEach((val, index, arr) => {
        if (val.type == OptimType) this.OptimTypeId = index;
      });
      this.ScaleType.forEach((val, index, arr) => {
        if (val.type == ScaleType) this.ScaleTypeId = index;
      });
      this.showEditForm = true;
    },
    handleAdd(evt) {
      evt.preventDefault();
      if (!this.name) {
        alert("Пожалуйста введите название критерия");
      } else {
        this.handleSubmitAddForm();
      }
    },
    handleEdit(evt) {
      evt.preventDefault();
      if (!this.nameEdit) {
        alert("Пожалуйста введите название критерия");
      } else {
        this.handleSubmitEditForm();
      }
    },
    handleSubmitEditForm() {
      if (this.currentEditId != -1) {
        api()
          .put("/criterion", {
            IdCrit: this.currentEditId,
            CName: this.nameEdit,
            CType: this.ddtextCType,
            OptimType: this.ddtextOptimType,
            EdIzmer: this.ddtextEdIzmer,
            ScaleType: this.ddtextScaleType
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
      this.CTypeId = this.ScaleTypeId = this.EdIzmerId = this.OptimTypeId = 0;
    },
    clearEditFields() {},
    handleSubmitAddForm() {
      api()
        .post("/criterion", {
          CName: this.name,
          CType: this.ddtextCType,
          OptimType: this.ddtextOptimType,
          EdIzmer: this.ddtextEdIzmer,
          ScaleType: this.ddtextScaleType
        })
        .then(res => {
          this.isBusy = true;
          this.$refs.table.refresh();
          this.clearAddFields();
          this.$refs.modal.hide();
          this.isBusy = false;
        });
    }
  }
};
</script>
<style scoped>
</style>
