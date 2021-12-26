/*
 * @Author: 胡晨明
 * @Date: 2021-12-13 09:25:22
 * @LastEditTime: 2021-12-13 09:31:37
 * @LastEditors: Please set LastEditors
 * @Description: 用户自定义设置相关接口
 * @FilePath: \Anydo-app\src\api\modules\userSettings.js
 */
import request from '@/utils/request'

// 获取用户自定义设置数据接口调用定义
export const getCustomSettings = () => {
  return request({
    method: 'get',
    url: '/customsettings/usercustomsettings',
    data: {},
    mock: false
  })
}

// 获取用户功能开启列表接口调用定义
export const getUserFunctions = () => {
  return request({
    method: 'get',
    url: '/customsettings/userfunctions',
    data: {},
    mock: false
  })
}

// 用户任务设定默认值获取接口调用定义
export const getUserTaskDefault = () => {
  return request({
    method: 'get',
    url: '/customsettings/usertaskdefault',
    data: {},
    mock: false
  })
}

// 提交用户自定义设置数据接口调用定义
export const postCustomSettings = (params) => {
  return request({
    method: 'post',
    url: '/customsettings/postcustomsettings',
    data: params,
    mock: false
  })
}