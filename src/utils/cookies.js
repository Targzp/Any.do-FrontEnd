/*
 * @Author: 胡晨明
 * @Date: 2022-01-27 21:01:17
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-01-27 21:01:17
 * @Description: Cookies 操作封装
 */
import Cookies from 'js-cookie'

export default {
  //* 获取 cookie 值
  getCookie (key) {
    return Cookies.get(key)
  },
  //* 删除单个 cookie 值
  removeCookie (key) {
    Cookies.remove(key)
  },
  //* 批量删除 cookie 值
  removeCookies (keys) {
    keys.forEach(key => {
      Cookies.remove(key)
    })
  }
}