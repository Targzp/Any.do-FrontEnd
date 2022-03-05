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

// 查询用户任务接口调用定义
export const searchUserTask = (params) => {
  return request({
    method: 'post',
    url: '/tasks/searchTask',
    data: params,
    mock: false
  })
}

// 获取指定任务接口调用定义
export const getUserTask = (params) => {
  return request({
    method: 'post',
    url: '/tasks/gettask',
    data: params,
    mock: false
  })
}

// 获取用户任务动态列表数据接口
export const getTaskDevelopments = (params) => {
  return request({
    method: 'post',
    url: '/tasks/gettaskdevelopment',
    data: params,
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

// 任务邮件通知
export const userTaskMailNotify = (params) => {
  return request({
    method: 'post',
    url: `/tasks/taskmailnotify`,
    data: params,
    mock: false
  })
}