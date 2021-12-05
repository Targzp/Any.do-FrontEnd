/*
 * @Author: 胡晨明
 * @Date: 2021-12-01 23:09:10
 * @LastEditTime: 2021-12-04 16:53:18
 * @LastEditors: Please set LastEditors
 * @Description: 用户任务状态管理
 * @FilePath: \Anydo-app\src\store\modules\tasks.js
 */
import db from '../db/index'
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
  }
}

const actions = {
  /**
   * @description: 异步存储用户所有清单任务集合并且定义指定 listId 任务集合
   */
  async saveUserTasksDB ({ dispatch }, { listId, allTasks }) {
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
          const res = await db.tasks.where({ listId: params.listId, taskId: params.taskId }).first()
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
  async saveUserTaskDB ({ commit }, { listId, task }) {
    const params = { listId, taskId: task.taskId, task }
    try {
      const id = await db.tasks.add(params)  // 返回的是一个 id 值
      const localTask = await db.tasks.where({ id }).first()  // 获取已添加至本地的添加任务数据
      commit('addUserTask', localTask)
    } catch (error) {
      console.log(`${error}`)
    }
  },
  /**
   * @description: 异步获取指定 listId 任务集合
   */
  async getUserTasks ({ commit }, listId) {
    if (listId === 'all') {
      //TODO  缓存所有清单任务集合
    } else if (listId === 'today') {
      //TODO  缓存当天清单任务集合
    } else {
      // 缓存指定 listId 清单任务集合
      const tasks = await db.tasks.where({ listId }).toArray()
      commit('saveUserTasks', tasks)
    }
  }
}

export default {
  state,
  mutations,
  actions
}