/*
 * @Author: 胡晨明
 * @Date: 2021-12-13 09:38:05
 * @LastEditTime: 2021-12-13 09:38:05
 * @LastEditors: Please set LastEditors
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

