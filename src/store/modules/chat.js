/*
 * @Author: 胡晨明
 * @Date: 2022-02-13 14:53:26
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-13 14:53:27
 * @Description: 聊天通用状态管理
 */
// initial state
const state = () => ({
  chatDatas: [],
})

// mutations
const mutations = {
  /**
   * @description: 增加聊天数据
   */
  addChatData (state, chatData) {
    state.chatDatas.push(chatData)
  }
}

export default {
  state,
  mutations
}