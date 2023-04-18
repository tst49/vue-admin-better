import axios from 'axios'
import { getAccessToken } from '@/utils/accessToken'
import Element from 'element-ui'

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

//后置拦截
axios.interceptors.response.use(
  (response) => {
    let res = response.data

    if (res.code === 200 || res.code == '200') {
      return response
    } else {
      // 弹窗异常信息
      Element.Message({
        message: response.data.message,
        type: 'error',
        duration: 3 * 1000,
      })
      // 直接拒绝往下面返回结果信息
      return Promise.reject(response.data.message)
    }
  },
  //分节点 error进入 因为error不会进上一层
  (error) => {
    if (error.response.data) {
      error.message = error.response.data.message
    } else {
      error.message = '服务器错误，请稍后重试'
    }
    Element.Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000,
    })
    return Promise.reject(error)
  }
)
