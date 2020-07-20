import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})



// day07 src main.js 原来全部的注释；
// 今天day08


// 5.插件如何进行导入？
import request_95 from "./utils/request_95";
Vue.use(request_95);











app.$mount()