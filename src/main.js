// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk//index.css'
import AxiosPlugin from './utils/axiosPlugin'
import store from './store/'

Vue.use(AxiosPlugin)
Vue.use(ElementUI);
Vue.config.productionTip = false;

//判断是否有token,没有则登陆
router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    var token = sessionStorage.getItem('token');
    if (token == null) {
       next({path:'/login'});
    } else {
      //根据后台返回的路由进行判断是否合法
      next();
    }
  } else {
    next();
  }
})


/* eslint-disable no-new */
new Vue({
  store,
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
