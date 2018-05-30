import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: resolve => require(['../views/login.vue'], resolve)
    },
    {
      path: '/home',
      component: resolve => require(['../views/home.vue'], resolve),
      children:[
        {
          path: '/',
          component: resolve => require(['../views/index.vue'], resolve)
        },
        {
        path: '/orgnization',
        component: resolve => require(['../views/user/organization.vue'], resolve)
        },
        {
          path: '/users',
          component: resolve => require(['../views/user/users.vue'], resolve)
        }
      ]
    }
  ]
})
