/*
 * @Author: 胡晨明
 * @Date: 2021-12-01 23:09:10
 * @LastEditTime: 2021-12-14 14:13:59
 * @LastEditors: Please set LastEditors
 * @Description: 用户任务状态管理
 * @FilePath: \Anydo-app\src\store\modules\tasks.js
 */
import db from '../db/index'
import dayjs from 'dayjs'
import request from '@/api/'
import _ from 'lodash'

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
   * @description: 已完成或删除的任务数据从当前缓存中去除
   * @param {*} state
   * @param {*} task
   */
  removeUserTask (state, { taskId, flag, value, extValue }) {
    // value 值为 1 表示已完成或者已软删除
    if (value === 1) {
      const taskIndex = state.userTasks.findIndex(task => task.taskId === taskId)
      state.userTasks.splice(taskIndex, 1)
    // value 值为 0 表示已完成任务还原或者软删除任务还原
    } else {
      // 如果是已完成任务还原
      if (flag === 'done') {
        const doneTasks = state.userTasks.find(task => task.doneTime === extValue)
        const doneTasksIndex = state.userTasks.findIndex(task => task.doneTime === extValue)
        const taskIndex = doneTasks.tasks.findIndex(task => task.taskId === taskId)
        doneTasks.tasks.splice(taskIndex, 1)
        if (doneTasks.tasks.length === 0) {
          state.userTasks.splice(doneTasksIndex, 1)
        }
      // 如果是软删除任务还原
      }
    }
  }
}

const actions = {
  /**
   * @description: 异步存储用户所有清单任务集合并且定义指定 listId 任务集合
   */
  async saveUserTasksDB ({ dispatch }, listId) {
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
          // 如果之前已存过对应任务数据则不存储
          const res = await db.tasks.where({ listId: params.listId, taskId: params.taskId })
          if (!res) {
            await db.tasks.add(params)
          }
        } catch (error) {
          console.log(`${error}`)
        }
      }
    }

    await dispatch('getUserTasks', listId)
  },
  /**
   * @description: 异步存储用户添加任务
   */
  async saveUserTaskDB ({ commit }, postParams) {
    try {
      const res = await request.postUserAddTask(postParams)
      const dbParams = { listId: postParams.listId, taskId: res.taskId, task: res }
      await db.tasks.add(dbParams)  // 返回的是一个 id 值
      commit('addUserTask', dbParams)
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
      tasks = await db.tasks.filter((value) => !value.task.doneFlag).toArray()
    } else if (listId === 1) {
      // 缓存当天清单任务集合
      const allTasks = await db.tasks.filter((value) => !value.task.doneFlag).toArray()
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
        if (value.task.doneTime) {
          doneTimes.push(value.task.doneTime)
        }
        return !!value.task.doneFlag
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
    } else {
      // 缓存指定 listId 清单任务集合
      tasks = await db.tasks.filter((value) => {
        return value.listId === listId && !value.task.doneFlag
      }).toArray()
    }

    commit('saveUserTasks', tasks)
  },
  /**
   * @description: 异步设置任务相关值
   */
  async setUserTask({ commit }, settingValues) {
    try {
      let res
      let { id, taskId, flag, value } = settingValues
      switch (flag) {
      // 已完成/已完成还原
      case 'done': {
        let doneTime
        //* 如果 value 为 0，意味着要使已完成任务还原。此时要获取 doneTime，将已完成任务列表里对应日期下的某个任务还原
        if (!value) {
          doneTime = settingValues.extValue
          settingValues.extValue = ''
        }
        res = await db.tasks.update(id, { 'task.doneFlag': value, 'task.doneTime': settingValues.extValue })
        if (res) {
          commit('removeUserTask', { taskId, flag, value, extValue: doneTime })
        }
        break
      }
      // 已删除/已删除还原
      case 'softDel': {
        res = await db.tasks.update(id, { 'task.softDelFlag': value })
        if (res) {
          commit('removeUserTask', { taskId, flag, value })
        }
        break
      }
      default:
        break
      }

      await request.postUserUpdateTask(settingValues)
    } catch (error) {
      console.log(`${error}`)
    }
  }
}

export default {
  state,
  mutations,
  actions
}