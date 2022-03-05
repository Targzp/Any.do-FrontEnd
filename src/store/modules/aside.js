/*
 * @Author: 胡晨明
 * @Date: 2022-02-07 21:18:05
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-16 16:59:07
 * @Description: 侧边隐藏状态管理
 */
// initial state
const state = () => ({
  isLessThan1100: false,
  isHide: false,
  isHide2: false
})

// mutations
const mutations = {
  /**
   * @description: 当前屏幕是否小于1100px标记
   */
  changeIsLess (state, value) {
    state.isLessThan1100 = value
  },
  /**
   * @description: 隐藏或显示用户侧边栏
   */
  changeIsHide (state, value=!state.isHide) {
    state.isHide = value
  },
  /**
   * @description: 隐藏或显示用户侧边栏
   */
  changeIsHide2 (state, value=!state.isHide2) {
    state.isHide2 = value
  }
}

export default {
  state,
  mutations
}

