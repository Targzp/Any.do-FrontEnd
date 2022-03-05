/*
 * @Author: 胡晨明
 * @Date: 2022-03-03 21:26:03
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-03 21:26:04
 * @Description: 用户成就数据相关接口
 */
import request from '@/utils/request'

// 获取用户成就值数据接口调用定义
export const getUserAchievements = () => {
  return request({
    method: 'get',
    url: '/achievements/getachievementscores',
    data: {},
    mock: false
  })
}

// 获取用户任务和已完成任务以及清单数量接口调用定义
export const getUserTDLtotal = () => {
  return request({
    method: 'get',
    url: '/achievements/gettdltotal',
    data: {},
    mock: false
  })
}