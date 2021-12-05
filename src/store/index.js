/*
 * @Author: your name
 * @Date: 2021-09-20 23:12:50
 * @LastEditTime: 2021-10-26 20:37:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\store\index.js
 */
import {
  createStore
} from 'vuex'
import users from './modules/users'
import customSetting from './modules/customSetting'
import lists from './modules/lists'
import tasks from './modules/tasks'

export default createStore({
  modules: {
    users,
    customSetting,
    lists,
    tasks
  }
})