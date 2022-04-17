/*
 * @Author: 胡晨明
 * @Date: 2022-01-29 14:59:32
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-14 20:17:44
 * @Description: 用户消息通知状态管理
 */
import storage from '../../utils/storage'
import _ from 'lodash'

// initial state
const state = () => ({
  notifications: storage.getItem('userNotifications') || [] // 获取用户消息通知列表
})

// mutations
const mutations = {
  /**
   * @description: 存储本地用户消息通知列表数据
   * @param {*} state
   * @param {*} notifications
   */  
  saveUserNotifications(state, notifications) {
    const orderNotifications = _.orderBy(notifications, ['inviteTime'], ['desc'])

    state.notifications.splice(0, state.notifications.length)
    state.notifications.push(...orderNotifications)

    storage.setItem('userNotifications', state.notifications)
  },
  /**
   * @description: 存储用户新增通知数据
   * @param {*} state
   * @param {*} notification
   */ 
  addUserNotification(state, notification) {
    for (let item of state.notifications) {
      if (_.isEqual(item, notification)) {
        return
      }
    }
    state.notifications.unshift(notification)
    storage.setItem('userNotifications', state.notifications)
  },
  /**
   * @description: 删除用户通知数据
   * @param {*} state
   * @return {*} delValue
   */
  delUserNotification(state, delValue) {
    const index = state.notifications.findIndex(item => {
      return item.noticeFlag === delValue.noticeFlag && item.noticeTime === item.noticeTime
    })
    state.notifications.splice(index, 1)
    storage.setItem('userNotifications', state.notifications)
  }
}

export default {
  state,
  mutations
}