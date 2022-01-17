/*
 * @Author: 胡晨明
 * @Date: 2022-01-17 16:16:21
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-01-17 21:18:00
 * @Description: 设置任务操作动态工具函数
 */
import db from '../db/index'
import storage from '../../utils/storage'

const setTaskDevelopment = async (id, optFlag) => {
  const userName = (storage.getItem('userInfo')).userName

  const optRecord = {
    optFlag,
    optTime: new Date().valueOf() + '',
    optName: userName
  }

  const getTask = await db.tasks.get({ id })
  let taskOptRecords = getTask.task.taskOptRecords

  if (!taskOptRecords || taskOptRecords.length === 0) {
    taskOptRecords = [ optRecord ]
  } else {
    taskOptRecords.push(optRecord)
  }

  await db.tasks.update(id, { 'task.taskOptRecords': taskOptRecords })

  return taskOptRecords
}

export default setTaskDevelopment