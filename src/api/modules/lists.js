/*
 * @Author: 胡晨明
 * @Date: 2021-12-13 09:33:14
 * @LastEditTime: 2021-12-13 09:37:59
 * @LastEditors: Please set LastEditors
 * @Description: 用户清单相关接口
 * @FilePath: \Anydo-app\src\api\modules\lists.js
 */
import request from '@/utils/request'

// 获取用户清单列表数据接口调用定义
export const getUserLists = () => {
  return request({
    method: 'get',
    url: '/lists/userlists',
    data: {},
    mock: false
  })
}

// 用户查询清单列表数据接口调用定义
export const searchUserLists = (params) => {
  return request({
    method: 'post',
    url: '/lists/searchlist',
    data: params,
    mock: false
  })
}

// 提交用户添加清单数据接口调用定义
export const postUserAddList = (params) => {
  return request({
    method: 'post',
    url: '/lists/addlist',
    data: params,
    mock: false
  })
}

// 用户删除清单接口调用定义
export const postUserDeleteList = (params) => {
  return request({
    method: 'post',
    url: '/lists/deletelist',
    data: params,
    mock: false
  })
}

// 用户清单名称修改接口调用定义
export const postUserEditList = (params) => {
  return request({
    method: 'post',
    url: '/lists/editlist',
    data: params,
    mock: false
  })
}