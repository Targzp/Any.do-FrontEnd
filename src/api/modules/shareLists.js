/*
 * @Author: 胡晨明
 * @Date: 2022-02-01 12:35:31
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-01 12:35:32
 * @Description: 用户共享清单相关接口
 */
import request from '@/utils/request'

// 用户获取共享清单下清单数据接口调用定义
export const getShareLists = () => {
  return request({
    method: 'get',
    url: '/sharelist/listdata',
    data: {},
    mock: false
  })
}

// 用户获取共享清单下任务列表接口调用定义
export const getShareTasks = (params) => {
  return request({
    method: 'post',
    url: '/sharelist/sharetasks',
    data: params,
    mock: false
  })
}

// 用户获取共享清单人员列表接口调用定义
export const getShareUsers = (params) => {
  return request({
    method: 'post',
    url: '/sharelist/shareusers',
    data: params,
    mock: false
  })
}

// 用户获取共享清单任务动态列表接口调用定义
export const getShareTaskDevelopment = (params) => {
  return request({
    method: 'post',
    url: '/sharelist/sharetaskdevelopment',
    data: params,
    mock: false
  })
}

// 用户指派共享清单任务至目标成员接口调用定义
export const assignMemberTask = (params) => {
  return request({
    method: 'post',
    url: '/sharelist/assignmember',
    data: params,
    mock: false
  })
}

// 用户获取共享清单任务指派成员 id 接口调用定义
export const getAssignMemberId = (params) => {
  return request({
    method: 'post',
    url: '/sharelist/getassignid',
    data: params,
    mock: false
  })
}

// 用户移除共享清单任务指派成员接口调用定义
export const deleteAssignMember = (params) => {
  return request({
    method: 'post',
    url: '/sharelist/removeassignmember',
    data: params,
    mock: false
  })
}

// 用户移除共享清单人员接口调用定义
export const deleteShareUser = (params) => {
  return request({
    method: 'post',
    url: '/sharelist/removemember',
    data: params,
    mock: false
  })
}