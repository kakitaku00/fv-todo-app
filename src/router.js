import Vue from 'vue'
import Router from 'vue-router'

import Todo from './views/Todo.vue' // 追加
import Login from './views/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'todo', // 編集
      component: Todo // 編集
    },
    {
      path: '/login',
      name: 'login', // 編集
      component: Login // 編集
    },
  ]
})
