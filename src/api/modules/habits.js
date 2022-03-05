/*
 * @Author: 胡晨明
 * @Date: 2022-02-24 15:08:58
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-24 15:09:08
 * @Description: 用户习惯打卡数据相关接口
 */
import request from '@/utils/request'

// 用户获取习惯打卡数据列表接口调用定义
export const getUserHabitsData = () => {
  return request({
    method: 'get',
    url: '/habit/gethabits',
    data: {},
    mock: false
  })
}

// 用户获取已归档习惯打卡数据列表接口调用定义
export const getUserDoneHabitsData = () => {
  return request({
    method: 'get',
    url: '/habit/getdonehabits',
    data: {},
    mock: false
  })
}

// 用户新增习惯打卡数据接口调用定义
export const addUserHabitData = (params) => {
  return request({
    method: 'post',
    url: '/habit/addhabit',
    data: params,
    mock: false
  })
}

// 用户删除习惯打卡数据接口调用定义
export const deleteUserHabitData = (params) => {
  return request({
    method: 'post',
    url: '/habit/deletehabit',
    data: params,
    mock: false
  })
}

// 用户修改习惯打卡数据接口调用定义
export const editUserHabitData = (params) => {
  return request({
    method: 'post',
    url: '/habit/edithabit',
    data: params,
    mock: false
  })
}

// 用户进行习惯打卡/取消打卡操作接口调用定义
export const clockUserHabit = (params) => {
  return request({
    method: 'post',
    url: '/habit/habitclock',
    data: params,
    mock: false
  })
}

// 用户获取习惯打卡统计数据接口调用定义
export const getUserHabitStatistics = (params) => {
  return request({
    method: 'post',
    url: '/habit/gethabitsstatistics',
    data: params,
    mock: false
  })
}