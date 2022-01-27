/*
 * @Author: 胡晨明
 * @Date: 2021-09-26 21:27:12
 * @LastEditTime: 2022-01-26 21:29:46
 * @LastEditors: 胡晨明
 * @Description: 防抖工具函数
 */
export default function debounce (fn, delay=500) {
  let timer = null
  return function () {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}