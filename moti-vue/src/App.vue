<template>
  <div id="app">
        <b-navbar type="dark" variant="primary">
        <b-navbar-brand href="#">MotiLab1</b-navbar-brand>
          <b-navbar-nav>
            <b-nav-item to="/alternatives">Альтернативы</b-nav-item>
            <b-nav-item to="/criterion">Критерии</b-nav-item>
            <b-nav-item to="/mark">Оценки</b-nav-item>
            <b-nav-item to="/vector">Вектор</b-nav-item>
            <b-nav-item to="/lpr">ЛПР</b-nav-item>
            <b-nav-item to="/lab2">Лабораторная работа 2</b-nav-item>
            <b-nav-item to="/lab3">Лабораторная работа 3</b-nav-item>
            <b-nav-item to="/lab41">Лабораторная работа 4. Часть первая</b-nav-item>
            <b-nav-item to="/lab4">Лабораторная работа 4. Часть вторая</b-nav-item>
            <b-nav-item to="/lab5">Лабораторная работа 5. Игра "Доверие"</b-nav-item>
          </b-navbar-nav>
        </b-navbar>
    <router-view/>
  </div>
</template>

<script>

export default {
    data(){
      return{
        show: true
      }
    }
}
</script>


<style>
body{
  margin: 0;
  padding: 0;
}
</style>
