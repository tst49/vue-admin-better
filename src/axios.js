import axios from 'axios'

// 配置全局axios拦截
axios.defaults.baseURL = 'http://localhost:8084'

// //前置拦截
// //拦截器 拦截request请求
// axios.interceptors.request.use(config =>{

//     //如果有token，统一带上
//     const token = window.localStorage.getItem('token')
//     if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
//         config.headers.Authorization = `${token}`;
//     }

//     return config
// })

// //后置拦截
// axios.interceptors.response.use(response =>{
//     let res = response.data

//     console.log("=====================")
//     console.log(res)
//     console.log("=====================")

//     if(res.code === 200){
//         return response
//     } else {
//         // 弹窗异常信息
//         Element.Message({
//             message: "-->"+response.data.msg,
//             type: 'error',
//             duration: 3 * 1000
//         })
//         // 直接拒绝往下面返回结果信息
//         return Promise.reject(response.data.msg)
//     }

// },
//     //分节点 error进入 因为error不会进上一层
//     error => {
//         console.log(error)
//         if(error.response.data){
//             error.message = error.response.data.msg
//         }
//         // 根据请求状态觉得是否登录或者提示其他
//         if (error.response.status === 401||error.response.status === 500) {
//             store.commit('REMOVE_INFO');
//             router.push({
//                 path: '/login'
//             });
//             error.message = '请重新登录';
//         }
//         if (error.response.status === 403) {
//             error.message = '权限不足，无法访问';
//         }
//         Element.Message({
//             message: error.message,
//             type: 'error',
//             duration: 3 * 1000
//         })
//         return Promise.reject(error)
//     }
// )
