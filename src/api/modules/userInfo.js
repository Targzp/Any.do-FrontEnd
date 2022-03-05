/*
 * @Author: 胡晨明
 * @Date: 2021-12-13 09:10:18
 * @LastEditTime: 2021-12-13 09:10:19
 * @LastEditors: Please set LastEditors
 * @Description: 用户个人信息相关接口
 * @FilePath: \Anydo-app\src\api\modules\userInfo.js
 */
import request from '@/utils/request'

// 获取用户个人信息接口调用定义
export const getProfile = () => {
  return request({
    method: 'get',
    url: '/users/profile',
    data: {},
    mock: false
  })
}

// 检查用户名接口调用定义
export const checkUserName = (params) => {
  return request({
    method: 'post',
    url: '/users/checkusername',
    data: params,
    mock: false
  })
}

// 上传图片接口调用定义
export const sendimg = (params) => {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/users/sendimg',
    data: params,
    mock: false
  })
}

// 提交用户个人信息接口调用定义
export const postProfile = (params) => {
  return request({
    method: 'post',
    url: '/users/userprofile',
    data: params,
    mock: false
  })
}

// 提交密码更改数据接口调用定义
export const postUpdatePassword = (params) => {
  return request({
    method: 'post',
    url: '/users/updatepassword',
    data: params,
    mock: false
  })
}

// 绑定邮箱更新接口调用定义
export const postUpdateBindMail = (params) => {
  return request({
    method: 'post',
    url: '/users/updatebindmail',
    data: params,
    mock: false
  })
}

// 注销账户接口
export const deleteAccount = (params) => {
  return request({
    method: 'post',
    url: '/users/deleteaccount',
    data: params,
    mock: false
  })
}

// 用户搜索接口
export const searchUser = (params) => {
  return request({
    method: 'post',
    url: '/users/search',
    data: params,
    mock: false
  })
}

// 用户计算使用天数和上次登录时间接口
export const countUserUseDays = () => {
  return request({
    method: 'post',
    url: '/users/countusedays',
    data: {},
    mock: false
  })
}

// 获取用户使用天数接口
export const getUserUseDays = () => {
  return request({
    method: 'get',
    url: '/users/getusedays',
    data: {},
    mock: false
  })
}