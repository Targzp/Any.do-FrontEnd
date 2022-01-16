/*
 * @Author: 胡晨明
 * @Date: 2021-12-13 09:38:05
 * @LastEditTime: 2022-01-15 22:25:11
 * @LastEditors: 胡晨明
 * @Description: 用户任务相关接口
 * @FilePath: \Anydo-app\src\api\modules\tasks.js
 */
import request from '@/utils/request'

// 获取用户全部任务列表接口调用定义
export const getUserAllTasks = () => {
  return request({
    method: 'get',
    url: '/tasks/alltasks',
    data: {},
    mock: false
  })
}

// 提交用户添加任务数据接口调用定义
export const postUserAddTask = (params) => {
  return request({
    method: 'post',
    url: '/tasks/addtask',
    data: params,
    mock: false
  })
}

// 提交用户任务设定值修改数据接口
export const postUserUpdateTask = (params) => {
  return request({
    method: 'post',
    url: '/tasks/updatetask',
    data: params,
    mock: false
  })
}

// 提交删除用户任务数据接口
export const postUserDeleteTask = (params) => {
  return request({
    method: 'post',
    url: '/tasks/deletetask',
    data: params,
    mock: false
  })
}

// 提交批量删除任务数据接口
export const postUserBatchDeleteTask = (params) => {
  return request({
    method: 'post',
    url: '/tasks/batchdeletetask',
    data: params,
    mock: false
  })
}

// 提交用户任务附件接口
export const postUserTaskFile = (params) => {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `/tasks/sendfile/${params.listId}/${params.taskId}/${params.beforeFileFlag}`,
    data: params.formData,
    mock: false
  })
}

// 删除用户任务附件接口
export const deleteUserTaskFile = (params) => {
  return request({
    method: 'post',
    url: `/tasks/deletefile/${params.value}`,
    data: params,
    mock: false
  })
}