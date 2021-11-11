/*
 * @Author: your name
 * @Date: 2021-10-22 15:31:39
 * @LastEditTime: 2021-10-22 15:33:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\store\modules\customSettings.js
 */
// initial state
const state = () => ({
    tabDom: ''     // 需滚动的标题元素
})

const mutations = {
   /**
   * @description: 更改当前的自定义标题元素 
   * @param {*} state
   * @param {*} tabDom
   */  
  setTabDom(state, tabDom) {
    state.tabDom = tabDom
  }
}

export default {
    state,
    mutations
}