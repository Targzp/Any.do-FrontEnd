/*
 * @Author: your name
 * @Date: 2021-10-28 15:15:44
 * @LastEditTime: 2021-11-16 21:40:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\store\modules\userLists.js
 */
import storage from '../../utils/storage'
import _ from 'lodash'

// initial state
const state = () => ({
    userLists: storage.getItem('userLists') || [], // 获取用户清单列表
})

// mutations
const mutations = {
  /**
   * @description: 存储本地用户清单列表数据
   * @param {*} state
   * @param {*} lists
   */  
  saveUserLists(state, lists) {
    // 如果清单列表缓存为空，直接 push
    // 如果不为空（则为同步清单）。把原有清单缓存使用 splice 进行替换
    if (state.userLists.length === 0) {
      state.userLists.push(...lists)
    } else {
      state.userLists.splice(0, state.userLists.length, ...lists)
    }
    storage.setItem('userLists', state.userLists)
  },
  /**
   * @description: 存储用户新增清单
   * @param {*} state
   * @param {*} list
   */ 
  addUserList(state, list) {
    state.userLists.push(list)
    storage.setItem('userLists', state.userLists)
  },
  /**
   * @description: 删除用户清单
   * @param {*} state
   * @param {*} index
   */
  deleteUserList(state, index) {
    state.userLists.splice(index, 1)
    storage.setItem('userLists', state.userLists)
  },
  /**
   * @description: 更改用户清单
   * @param {*} state
   * @param {*} index
   */
  editUserList(state, editListData) {
    const { index, listName } = editListData
    state.userLists[index].listName = listName
    storage.setItem('userLists', state.userLists)
  },
  /**
   * @description: 清空用户清单
   * @param {*} state
   */
  clearUserList(state) {
    state.userLists = []
    storage.setItem('userLists', state.userLists)
  }
}

export default {
    state,
    mutations
}