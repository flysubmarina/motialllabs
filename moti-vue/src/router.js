import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Alternatives from './views/Alternatives.vue'
import Criterion from './views/Criterion.vue'
import Mark from './views/Mark.vue'
import Lpr from './views/Lpr.vue'
import Vector from './views/Vector.vue'
import Lab2 from './views/Lab2.vue'
import Lab3 from './views/Lab3.vue'
import Lab4 from './views/Lab4.vue'
import Lab41 from './views/Lab41.vue'
import Lab5 from './views/Lab5.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path:'/lab2',
      name: 'lab2',
      component: Lab2
    },
    {
      path:'/lab3',
      name: 'lab3',
      component: Lab3
    },
    {
      path:'/lab4',
      name: 'lab4',
      component: Lab4
    },
    {
      path:'/lab41',
      name: 'lab41',
      component: Lab41
    },
    {
      path:'/lab5',
      name: 'lab5',
      component: Lab5
    },
    {
      path: '/alternatives',
      name: 'Alternatives',
      component: Alternatives
    },
    {
      path: '/criterion',
      name: 'Criterion',
      component: Criterion
    },
    {
      path: '/mark',
      name: 'Mark',
      component: Mark
    },
    {
      path: '/lpr',
      name: 'Lpr',
      component: Lpr
    },
    {
      path: '/vector',
      name: 'Vector',
      component: Vector
    }
  ]
})
