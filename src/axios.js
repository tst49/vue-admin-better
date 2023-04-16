import axios from 'axios'
import { getAccessToken } from '@/utils/accessToken'

// 配置全局axios拦截
axios.defaults.baseURL = 'http://localhost:8084'

//前置拦截
//拦截器 拦截request请求
axios.interceptors.request.use((config) => {
  //如果有token，统一带上
  const token = getAccessToken()
  if (token) {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = `${token}`
  }

  return config
})
