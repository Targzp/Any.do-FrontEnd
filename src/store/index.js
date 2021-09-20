/*
 * @Author: your name
 * @Date: 2021-09-20 23:12:50
 * @LastEditTime: 2021-09-20 23:12:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\store\index.js
 */
import {
    createStore
} from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const state = {
    userInfo: storage.getItem('userInfo') || {}, // 获取用户信息
}
export default createStore({
    state,
    mutations
})