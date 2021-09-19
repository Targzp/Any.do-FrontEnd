/*
 * @Author: your name
 * @Date: 2021-09-18 14:32:46
 * @LastEditTime: 2021-09-18 14:32:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\utils\storage.js
 */
import config from '../config/index'
export default {
  setItem (key, val) {
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace,JSON.stringify(storage))
  },
  getStorage () {
    return JSON.parse(window.localStorage.getItem(config.namespace) || "{}")
  },
  getItem (key) {
    return this.getStorage()[key]
  },
  clearItem (key) {
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace,JSON.stringify(storage))
  },
  clearAll () {
    window.localStorage.clear()
  }
}