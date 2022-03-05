import storage from '../../utils/storage'

// initial state
const state = () => ({
  userInfo: storage.getItem('userInfo') || {}, // 获取用户信息
  userSetting: storage.getItem('userSetting') || {} // 获取用户设置数据
})

// mutations
const mutations = {
  /**
   * @description: 存储本地用户数据
   * @param {*} state
   * @param {*} user
   */
  saveUserInfo(state, user) {
    state.userInfo = user
    storage.setItem('userInfo', user)
  },
  /**
   * @description: 存储用户通知设定数据
   * @param {*} state
   * @param {*} user
   */
  saveUserNotify(state, userNotify) {
    state.userNotify = userNotify
    storage.setItem('userNotify', userNotify)
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

export default {
    state,
    mutations
}