/*
 * @Author: your name
 * @Date: 2021-09-18 14:26:38
 * @LastEditTime: 2022-01-15 17:49:13
 * @LastEditors: 胡晨明
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\utils\request.js
 */
import axios from 'axios'
import config from '../config/index'
import {
  ElMessage
} from 'element-plus'
import router from '../router/index'
import storage from './storage'
const TOKEN_INVALID = '登录时效已过'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 创建 axios 实例,添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  const headers = req.headers
  let token = ''
  token = storage.getItem('userInfo') && storage.getItem('userInfo').token
  if (!headers.authorization) {
    headers.authorization = 'Bearer ' + token
  }
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  const {
    code,
    data,
    msg
  } = res.data
  if (code === 200) {
    return data
  } else if (code === 50001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      storage.clearAll()
      router.push('/login')
    }, 1000)
    return Promise.reject(TOKEN_INVALID)
  } else {
    console.log(res.headers['content-disposition'])
    if (res.headers['content-disposition']) {
      return
    }
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * @description: 请求的核心函数
 * @param {*} options 请求配置
 */
function request(options) {
  options.method = options.method || 'get'

  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = options.mock ? config.mockApi : config.baseApi
  }

  return service(options)
}

export default request