/*
 * @Author: your name
 * @Date: 2021-09-20 23:47:00
 * @LastEditTime: 2021-10-04 16:38:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\store\mutations.js
 */
import storage from '../utils/storage'
import config from '../config/index'

export default {
  /**
   * @description: 登录成功本地存储用户数据
   * @param {*} state
   * @param {*} user
   */  
  saveUserInfo(state, user) {
    state.userInfo = user
    storage.setItem('userInfo', user)
  },
  /**
   * @description: 更新或追加本地用户数据
   * @param {*} state
   * @param {*} user
   */  
  setUserProfile(state, user) {
    Object.assign(state.userInfo, user)
    storage.setItem('userInfo', state.userInfo)
  },
  /**
   * @description: 更新本地用户头像数据
   * @param {*} state
   * @param {*} avatar
   */  
  setUserAvatar(state, avatar) {
    state.userInfo.userAvatar = avatar
    storage.setItem('userInfo', state.userInfo)
  }
}