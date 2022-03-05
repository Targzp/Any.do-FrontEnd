/*
 * @Author: 胡晨明
 * @Date: 2022-02-17 14:40:23
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-17 14:40:24
 * @Description: 用户专注相关接口
 */
import request from '@/utils/request'

// 获取用户专注数据接口调用定义
export const getUserFocus = () => {
  return request({
    method: 'get',
    url: '/focus/getfocuses',
    data: {},
    mock: false
  })
}

// 获取用户专注统计数据接口调用定义
export const getUserFocusStatistics = (params) => {
  return request({
    method: 'post',
    url: '/focus/getfocusstatistics',
    data: params,
    mock: false
  })
}

// 提交用户添加专注数据接口调用定义
export const postUserFocus = (params) => {
  return request({
    method: 'post',
    url: '/focus/addfocus',
    data: params,
    mock: false
  })
}
