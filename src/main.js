import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'

// // 全局引入相关包
// import * as echarts from 'echarts'
// // 开启echarts
// Vue.prototype.$echarts = echarts

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'github-markdown-css'
Vue.use(mavonEditor)

import VueAliplayerV2 from 'vue-aliplayer-v2'
Vue.use(VueAliplayerV2)

// /**
//  * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
//  */

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('@/utils/static')
//   mockXHR()
// }

import VueDirectiveImagePreviewer from 'vue-directive-image-previewer'
import 'vue-directive-image-previewer/dist/assets/style.css'
Vue.use(VueDirectiveImagePreviewer)

Vue.config.productionTip = false

import axios from 'axios'
import './axios'
Vue.prototype.$axios = axios

new Vue({
  el: '#vue-admin-beautiful',
  router,
  store,
  render: (h) => h(App),
})
