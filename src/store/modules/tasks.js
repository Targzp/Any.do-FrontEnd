/*
 * @Author: 胡晨明
 * @Date: 2021-12-01 23:09:10
 * @LastEditTime: 2022-03-02 16:35:35
 * @LastEditors: 胡晨明
 * @Description: 用户任务状态管理
 * @FilePath: \Anydo-app\src\store\modules\tasks.js
 */
import db from '../db/index'
import dayjs from 'dayjs'
import request from '@/api/'
import _ from 'lodash'
import setTaskDevelopment from '../utils/setTaskDevelopment'
import tasksNotify from '@/utils/tasksNotify'

// initial state
const state = () => ({
  userTasks: [], // 用户清单任务集合
})

const mutations = {
  /**
   * @description: 存储用户所有选定清单任务集合
   * @param {*} state
   * @param {*} listTasks
   */
  saveUserTasks (state, listTasks) {
    if (state.userTasks.length === 0) {
      state.userTasks.push(...listTasks)
    } else {
      state.userTasks.splice(0, state.userTasks.length, ...listTasks)
    }
  },
  /**
   * @description: 存储用户添加的任务数据
   * @param {*} state
   * @param {*} task
   */
  addUserTask (state, task) {
    state.userTasks.push(task)
  },
  /**
   * @description: 更新用户任务数据
   * @param {*} state
   * @return {*} task
   */
  updateUserTask (state, task) {
    state.userTasks.forEach((item, index) => {
      if (item.taskId === task.taskId) {
        state.userTasks[index] = task
        console.log('state.userTasks[index]: ', state.userTasks[index]);
      }
    })
  },
  /**
   * @description: 已完成或删除的任务数据从当前缓存中去除
   * @param {*} state
   * @param {*} settingValues
   */
  removeUserTask (state, { id, flag, value, extValue }) {
    console.log('extValue: ', extValue);
    console.log('id: ', id);
    if ((flag === 'done' && value === 1) || (flag === 'softDel' && !extValue)) {
      const taskIndex = state.userTasks.findIndex(task => task.id === id)
      state.userTasks.splice(taskIndex, 1)
    } else if ((flag === 'done' && value === 0) || (flag === 'softDel' && extValue)) {
      const doneTasks = state.userTasks.find(task => task.doneTime === extValue)
      const doneTasksIndex = state.userTasks.findIndex(task => task.doneTime === extValue)
      const taskIndex = doneTasks.tasks.findIndex(task => task.id === id)
      doneTasks.tasks.splice(taskIndex, 1)
      if (doneTasks.tasks.length === 0) {
        state.userTasks.splice(doneTasksIndex, 1)
      }
    }
  },
  /**
   * @description: 共享清单任务删除
   * @param {*} state
   * @return {*}  deleteValues
   */
  deleteShareUserTask (state, params) {
    const index = state.userTasks.findIndex(task => task.listId === params.listId && task.taskId === params.taskId)
    console.log('index: ', index);
    if (index > -1) {
      state.userTasks.splice(index, 1)
    }
  },
  /**
   * @description: 已软删除任务数据进行永久删除后从当前缓存中去除
   * @param {*} state
   * @param {*} deleteValues
   */
  deleteUserTask (state, { id }) {
    const index = state.userTasks.findIndex(task => task.id === id)
    state.userTasks.splice(index, 1)
  },
  /**
   * @description: 永久删除所有已软删除的任务数据
   * @param {*} state
   */
  batchDeleteUserTask (state) {
    state.userTasks.splice(0, state.userTasks.length)
  },
  /**
   * @description: 设置用户缓存任务相关值
   * @param {*} state
   */
  setUserTask (state, { id, flag, value, extValue, taskOptRecords }) {
    const flagDics = {
      setTaskInfo: 'taskInfo',
      setTaskDesc: 'taskDesc',
      setTaskPriority: 'taskPriority',
      setTaskFile: 'taskFile'
    }
    switch (flag) {
    case 'setList': {
      state.userTasks.forEach(item => {
        if (item.id === id) {
          item.listId = value
          if (taskOptRecords) {
            item.task.taskOptRecords = taskOptRecords
          }
        }
      })
      break
    }
    case 'resetId': {
      state.userTasks.forEach(item => {
        if (item.id === id) {
          item.taskId = value
          item.task.taskId = value
        }
      })
      break
    }
    case 'setTaskInfo':
    case 'setTaskDesc':
    case 'setTaskFile':
    case 'setTaskPriority': {
      if (extValue) {
        state.userTasks.forEach(item => {
          if (item.doneTime === extValue) {
            item.tasks.forEach(doneTask => {
              if (doneTask.id === id) {
                doneTask.task[flagDics[flag]] = value
                if (taskOptRecords) {
                  doneTask.task.taskOptRecords = taskOptRecords
                }
              }
            })
          }
        })
      } else {
        state.userTasks.forEach(item => {
          if (item.id === id) {
            item.task[flagDics[flag]] = value
            if (taskOptRecords) {
              item.task.taskOptRecords = taskOptRecords
            }
          }
        })
      }
      break
    }
    case 'setTaskGeneral': {
      if (extValue) {
        state.userTasks.forEach(item => {
          if (item.doneTime === extValue) {
            item.tasks.forEach(doneTask => {
              if (doneTask.id === id) {
                Object.assign(doneTask.task, value)

                if (taskOptRecords) {
                  doneTask.task.taskOptRecords = taskOptRecords
                }
              }

              if (value.subFlag === 'quantum') {
                doneTask.task.taskDate = ''
                doneTask.task.taskTime = ''
              } else if (value.subFlag === 'date') {
                doneTask.task.startTaskDate = ''
                doneTask.task.startTaskTime = ''
                doneTask.task.endTaskDate = ''
                doneTask.task.endTaskTime = ''
              }
            })
          }
        })
      } else {
        state.userTasks.forEach(item => {
          if (item.id === id) {
            Object.assign(item.task, value)

            if (taskOptRecords) {
              item.task.taskOptRecords = taskOptRecords
            }
          }

          if (value.subFlag === 'quantum') {
            item.task.taskDate = ''
            item.task.taskTime = ''
          } else if (value.subFlag === 'date') {
            item.task.startTaskDate = ''
            item.task.startTaskTime = ''
            item.task.endTaskDate = ''
            item.task.endTaskTime = ''
          }
        })
      }
      break
    }
    default:
      break;
    }
  }
}

const actions = {
  /**
   * @description: 异步存储用户所有清单任务集合并且定义指定 listId 任务集合
   */
  async saveUserTasksDB ({ dispatch }) {
    let allTasks

    const tasksTotal = await db.tasks.count()
    // 只有本地没有任务数据时再向后端请求数据
    if (!tasksTotal) {
      let res = await request.getUserAllTasks()
      if (!_.isEmpty(res)) {
        allTasks = res.allTasks
      }
    }

    if (allTasks) {
      // indexedDB 数据库存储任务数据集合定义
      const dbParams = []
      // 获取每个清单集合
      allTasks.forEach((listItem) => {
        // 获取每个清单任务集合
        listItem.listTasks.forEach((taskItem) => {
          // 单条任务数据定义
          let params = {}
          params.listId = listItem.listId // 任务所属清单 id
          params.taskId = taskItem.taskId // 任务 id
          params.task = taskItem          // 任务相关信息对象

          dbParams.push(params)
        })
      })

      for (let params of dbParams) {
        try {
          //? 如果之前已存过对应任务数据则不存储
          // const res = await db.tasks.where({ listId: params.listId, taskId: params.taskId })
          await db.tasks.add(params)
        } catch (error) {
          console.log(`${error}`)
        }
      }

      tasksNotify() //* 获取所有任务后，进行任务通知设定
    }
  },
  /**
   * @description: 异步存储用户添加任务
   */
  async saveUserTaskDB ({ commit }, postParams) {
    try {
      const { listId } = postParams
      const res = await request.postUserAddTask(postParams)

      const dbParams = { listId: postParams.listId, taskId: res.taskId, task: res }
      let id = 0

      if (listId < 300000) {
        id = await db.tasks.add(dbParams)  // 返回的是一个 id 值
      } else {
        id = new Date().valueOf() + listId
      }

      commit('addUserTask', dbParams)
      return { id, taskId: res.taskId }
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 异步存储用户同步新增任务
   */
  async saveUserSyncTask ({ commit }, params) {
    try {
      await db.tasks.add(params.dbParams)
      if (params.flag) {
        commit('addUserTask', params.dbParams)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 异步更新用户同步更新任务
   */
  async saveUserSyncUpdateTask ({ commit }, params) {
    try {
      const allTasks = await db.tasks.toArray()

      allTasks.forEach(async (item) => {
        if (item.listId === params.dbParams.listId && item.taskId === params.dbParams.taskId) {
          await db.tasks.delete(item.id)
        }
      })

      await db.tasks.add(params.dbParams)
      if (params.flag) {
        commit('updateUserTask', params.dbParams)
      }
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 异步获取指定 listId 任务集合
   */
  async getUserTasks ({ commit }, listId) {
    let tasks

    if (listId === 0) {
      // 缓存所有清单任务集合
      tasks = await db.tasks.filter((value) => (!value.task.doneFlag && !value.task.softDelFlag)).toArray()
    } else if (listId === 1) {
      // 缓存当天清单任务集合
      const allTasks = await db.tasks.filter((value) => (!value.task.doneFlag && !value.task.softDelFlag)).toArray()
      const filterTasks = []
      // 获取今天的开始和结束时间戳
      const todayStart = dayjs().startOf('day').valueOf() + ''
      const todayEnd = dayjs().endOf('day').valueOf() + ''

      allTasks.forEach((item) => {
        if (item.task.taskDate && item.task.taskDate + '' === todayStart) {
          filterTasks.push(item)
          return
        }

        const startDate = item.task.startTaskDate
        const endDate = item.task.endTaskDate
        if ( 
          (startDate>= todayStart && startDate <= todayEnd) ||
          (endDate >= todayStart && endDate <= todayEnd) ||
          (startDate <= todayStart && endDate >= todayEnd)
        ) {
          filterTasks.push(item)
        }
      })

      tasks = filterTasks 
    } else if (listId === 2) {
      // 缓存已完成清单任务集合
      let doneTimes = []  // 已完成任务时间集合
      const allDoneTasksOrg = []
      const allDoneTasks = await db.tasks.filter(value => {
        //* 接下来的逻辑都是对已完成且没有被软删除数据进行提取（已完成时间和任务）
        if (value.task.doneTime && !value.task.softDelFlag) {
          doneTimes.push(value.task.doneTime)
        }
        return !!value.task.doneFlag && !value.task.softDelFlag
      }).toArray()  // 所有已完成任务集合
      doneTimes = [...new Set(doneTimes)] // 去重相同的任务时间
      doneTimes.forEach((doneTime) => {
        const param = { doneTime, tasks: [], show: true }
        allDoneTasks.forEach((doneTask) => {
          if (doneTask.task.doneTime === doneTime) {
            param.tasks.push(doneTask)
          }
        })

        allDoneTasksOrg.push(param)
      })
      tasks = allDoneTasksOrg
    } else if (listId === 3) {
      // 缓存软删除任务集合
      tasks = await db.tasks.filter((value) => !!value.task.softDelFlag).toArray()
    } else {
      // 缓存指定 listId 清单任务集合
      if (listId > 300000) {
        tasks = await request.getShareTasks({ listId })
      } else {
        tasks = await db.tasks.filter((value) => {
          return value.listId === listId && !value.task.doneFlag && !value.task.softDelFlag
        }).toArray()
      }
    }

    commit('saveUserTasks', tasks)
  },
  /**
   * @description: 异步设置任务相关值
   */
  async setUserTask({ commit }, settingValues) {
    try {
      let res
      let taskOptRecords = null
      let { id, listId, taskId, flag, value, extValue } = settingValues
      switch (flag) {
      // 已完成/已完成还原
      case 'done': {
        let doneTime

        if (listId < 300000) {
          //* 如果 value 为 0，意味着要使已完成任务还原。此时要获取 doneTime，将已完成任务列表里对应日期下的某个任务还原
          if (!value) {
            doneTime = extValue
            extValue = ''
            settingValues.extValue = ''
          } else {
            await setTaskDevelopment(id, 'DONE')
          }
          res = await db.tasks.update(id, { 'task.doneFlag': value, 'task.doneTime': extValue })
          if (res) {
            commit('removeUserTask', { id, taskId, flag, value, extValue: doneTime })
          }
        } else {
          commit('removeUserTask', { id, taskId, flag, value, extValue: doneTime })
        }
        
        break
      }
      // 已删除/已删除还原
      case 'softDel': {
        res = await db.tasks.update(id, { 'task.softDelFlag': value })
        if (res) {
          commit('removeUserTask', { id, listId, taskId, flag, value, extValue })
        }
        break
      }
      // 更改任务所属清单
      case 'setList': {
        res = await db.tasks.update(id, { listId: value })
        taskOptRecords = await setTaskDevelopment(id, 'LIST')
        if (res) {
          commit('setUserTask', { id, flag, value, taskOptRecords })
        }
        break
      }
      // 更改任务标题信息
      case 'setTaskInfo': {
        if (listId < 300000) {
          res = await db.tasks.update(id, { 'task.taskInfo': value })
          taskOptRecords = await setTaskDevelopment(id, 'TITLE')
          if (res) {
            commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
          }
        } else {
          commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
        }
        
        break
      }
      // 更改任务描述信息
      case 'setTaskDesc': {
        if (listId < 300000) {
          res = await db.tasks.update(id, { 'task.taskDesc': value })
          taskOptRecords = await setTaskDevelopment(id, 'DESC')
          if (res) {
            commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
          }
        } else {
          commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
        }
        
        break
      }
      // 更改任务优先级
      case 'setTaskPriority': {
        if (listId < 300000) {
          res = await db.tasks.update(id, { 'task.taskPriority': value })
          taskOptRecords = await setTaskDevelopment(id, 'PRIO')
          if (res) {
            commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
          }
        } else {
          commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
        }
        
        break
      }
      // 更改任务通用设定（日期、时间段模式、通知提醒）
      case 'setTaskGeneral': {
        if (listId < 300000) {
          if (value.subFlag === 'quantum') {
            res = await db.tasks.update(id, {
              'task.taskDate': '',
              'task.taskTime': '',
              'task.startTaskDate': value.startTaskDate,
              'task.startTaskTime': value.startTaskTime,
              'task.endTaskDate': value.endTaskDate,
              'task.endTaskTime': value.endTaskTime,
              'task.notify': value.notify
            })
          } else if (value.subFlag === 'date') {
            res = await db.tasks.update(id, {
              'task.taskDate': value.taskDate,
              'task.taskTime': value.taskTime,
              'task.startTaskDate': '',
              'task.startTaskTime': '',
              'task.endTaskDate': '',
              'task.endTaskTime': '',
              'task.notify': value.notify
            })
          } else {
            res = await db.tasks.update(id, {
              'task.startTaskDate': value.startTaskDate,
              'task.startTaskTime': value.startTaskTime,
              'task.endTaskDate': value.endTaskDate,
              'task.endTaskTime': value.endTaskTime,
              'task.taskDate': value.taskDate,
              'task.taskTime': value.taskTime,
              'task.notify': value.notify
            })
          }
  
          taskOptRecords = await setTaskDevelopment(id, 'DT')
  
          if (res) {
            commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
          }
        } else {
          commit('setUserTask', { id, flag, value, extValue, taskOptRecords })
        }
        break
      }
      default:
        break
      }

      res = await request.postUserUpdateTask(settingValues)
      console.log('res: ', res)
      // 更换任务所属清单后，任务的 id 值可能会发生变化，需重置
      if (typeof res === 'number') {
        await db.tasks.update(id, { taskId: res, 'task.taskId': res })
        commit('setUserTask', { id, flag: 'resetId', value: res })
      }
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 异步删除（已软删除）任务数据
   */
  async deleteUserTask({ commit }, deleteValues) {
    try {
      const { id } = deleteValues
      await db.tasks.delete(id)
      commit('deleteUserTask', deleteValues)
      
      await request.postUserDeleteTask(deleteValues)
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 异步删除（已软删除）全部任务数据
   */
  async batchDeleteUserTask({ commit }, deleteValues) {
    try {
      const { ids } = deleteValues
      await db.tasks.bulkDelete(ids)
      commit('batchDeleteUserTask')

      await request.postUserBatchDeleteTask(deleteValues)
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 清空本地全部任务数据（注意这里是用户退出登录需要进行的清空操作）
   */
  async clearUserTask ({ commit }) {
    try {
      await db.tasks.clear()
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 异步上传任务附件数据
   */
  async uploadUserTaskFile({ commit }, { id, listId, taskId, formData, beforeFileFlag, extValue }) {
    try {
      let taskOptRecords
      const res = await request.postUserTaskFile({ formData, beforeFileFlag, listId, taskId })

      if (listId < 300000) {
        taskOptRecords = await setTaskDevelopment(id, 'AFILE')
        await db.tasks.update(id, { 'task.taskFile': res })
      }

      commit('setUserTask', { id, value: res, flag: 'setTaskFile', extValue, taskOptRecords })

    } catch (error) {
      throw error
    }
  },
  /**
   * @description: 异步删除任务附件数据
   */
  async deleteUserTaskFile({ commit }, { id, listId, taskId, value, extValue }) {
    try {
      let taskOptRecords

      await request.deleteUserTaskFile({ listId, taskId, value })

      if (listId < 300000) {
        await db.tasks.update(id, { 'task.taskFile': {} })
        taskOptRecords = await setTaskDevelopment(id, 'DFILE')
      }

      commit('setUserTask', { id, value: {}, flag: 'setTaskFile', extValue, taskOptRecords })
    } catch (error) {
      throw error
    }
  }
}

export default {
  state,
  mutations,
  actions
}