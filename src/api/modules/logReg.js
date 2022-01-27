/*
 * @Author: 胡晨明
 * @Date: 2021-12-11 20:35:48
 * @LastEditTime: 2021-12-11 20:40:47
 * @LastEditors: Please set LastEditors
 * @Description: 登录注册相关接口
 * @FilePath: \Anydo-app\src\api\modules\logReg.js
 */
import request from '@/utils/request'

// 注册接口调用定义
export const register = (params) => {
  return request({
    method: 'post',
    url: '/users/register',
    data: params,
    mock: false
  })
}

// 登录接口调用定义
export const login = (params) => {
  return request({
    method: 'post',
    url: '/users/login',
    data: params,
    mock: false
  })
}

// 退出登录接口调用定义
export const logout = () => {
  return request({
    method: 'post',
    url: '/users/logout',
    data: {},
    mock: false
  })
}

// 发送验证码接口调用定义
export const sendcode = (params) => {
  return request({
    method: 'post',
    url: '/users/sendcode',
    data: params,
    mock: false
  })
}

// 验证码检测接口调用定义
export const verifyCode = (params) => {
  return request({
    method: 'post',
    url: '/users/verifycode',
    data: params,
    mock: false
  })
}