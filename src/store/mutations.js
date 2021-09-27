/*
 * @Author: your name
 * @Date: 2021-09-20 23:47:00
 * @LastEditTime: 2021-09-24 23:43:14
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\store\mutations.js
 */
import storage from '../utils/storage'
import config from '../config/index'

export default {
  saveUserInfo(state, user) {
    state.userInfo = user
    storage.setItem('userInfo', user)
  },
  setUserProfile(state, user) {
    Object.assign(state.userInfo, user)
    state.userInfo.userAvatar = `http://localhost:${config.port}/${user.userAvatar}`
    storage.setItem('userInfo', state.userInfo)
  },
  setUserAvatar(state, avatar) {
    state.userInfo.userAvatar = `http://localhost:${config.port}/${avatar}`
    storage.setItem('userInfo', state.userInfo)
  }
}