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
        component: resolve => require(['../views/item/organization.vue'], resolve)
        },
        {
          path: '/users',
          component: resolve => require(['../views/user/users.vue'], resolve)
        },
        {
          path: '/admin',
            component: resolve => require(['../views/user/admin.vue'], resolve)
        },
        {
        path: '/enroll',
          component: resolve => require(['../views/data/enroll.vue'], resolve)
        },
        {
          path: '/activity',
            component: resolve => require(['../views/data/activity.vue'], resolve)
        },
      {
        path: '/trade',
           component: resolve => require(['../views/bill/trade.vue'], resolve)
        },
        {
          path: '/fetch',
            component: resolve => require(['../views/bill/fetch.vue'], resolve)
        }

      ]
    }
  ]
})
