/*
 * @Author: 胡晨明
 * @Date: 2022-01-29 00:06:38
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-01-30 21:10:31
 * @Description: 用户发送通知相关接口
 */
import request from '@/utils/request'

// 用户发起共享清单邀请通知接口调用定义
export const sendInviteNotice = (params) => {
  return request({
    method: 'post',
    url: '/notice/invitenotice',
    data: params,
    mock: false
  })
}

// 用户拒绝共享清单邀请通知接口调用定义
export const sendRejectInviteNotice = (params) => {
  return request({
    method: 'post',
    url: '/notice/rejectinvitenotice',
    data: params,
    mock: false
  })
}

// 用户接受共享清单邀请通知接口调用定义
export const sendAgreeInviteNotice = (params) => {
  return request({
    method: 'post',
    url: '/notice/agreeinvitenotice',
    data: params,
    mock: false
  })
}

// 用户删除共享清单成员通知接口调用定义
export const sendRemoveUserNotice = (params) => {
  return request({
    method: 'post',
    url: '/notice/removenotice',
    data: params,
    mock: false
  })
}

// 用户修改共享清单任务通知接口调用定义
export const sendTaskNotice = (params) => {
  return request({
    method: 'post',
    url: '/notice/tasknotice',
    data: params,
    mock: false
  })
}

// 用户获取通知数据接口调用定义
export const getNotifications = () => {
  return request({
    method: 'get',
    url: '/notice/notifications',
    data: {},
    mock: false
  })
}

// 用户删除通知数据接口调用定义
export const deleteNotification = (params) => {
  return request({
    method: 'post',
    url: '/notice/deletenotification',
    data: params,
    mock: false
  })
}
