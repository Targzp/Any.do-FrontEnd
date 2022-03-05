/*
 * @Author: 胡晨明
 * @Date: 2021-10-28 15:15:44
 * @LastEditTime: 2022-03-05 23:40:08
 * @LastEditors: 胡晨明
 * @Description: 用户清单状态管理
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\store\modules\userLists.js
 */
import storage from '../../utils/storage'

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
   * @description: 存储本地用户共享清单列表数据
   * @param {*} state
   * @param {*} lists
   */
  saveUserShareLists(state, lists) {
    console.log('lists: ', lists)
    lists.forEach(item => {
      const index = state.userLists.findIndex(item2 => item2.listId === item.listId)
      console.log('index: ', index)

      if (index === -1) {
        state.userLists.push(item)
      }
    })
  },
  /**
   * @description: 存储用户新增清单
   * @param {*} state
   * @param {*} list
   */ 
  addUserList(state, list) {
    state.userLists.push(list)
    //* 如果是共享清单则不进行持久化存储
    if (!list.listShareIds) {
      storage.setItem('userLists', state.userLists)
    }
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
   * @description: 删除用户共享清单
   * @param {*} state
   * @return {*} listId
   */
  deleteShareUserList(state, listId) {
    const index = state.userLists.findIndex(item => item.listId === listId)
    state.userLists.splice(index, 1)
  },
  /**
   * @description: 更改用户清单名称
   * @param {*} state
   * @param {*} index
   */
  editUserList(state, editListData) {
    const { index, listName } = editListData
    state.userLists[index].listName = listName
    storage.setItem('userLists', state.userLists)
  },
  /**
   * @description: 更改用户清单共享状态
   * @param {*} state
   * @param {*} index
   */
  editUserListShare(state, editListData) {
    const { listId, listShare } = editListData
    state.userLists.forEach((item, index) => {
      if (item.listId === listId) {
        state.userLists[index].listShare = listShare
      }
    })
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