/*
 * @Author: 胡晨明
 * @Date: 2021-09-26 21:27:12
 * @LastEditTime: 2021-09-28 20:16:52
 * @LastEditors: Please set LastEditors
 * @Description: 防抖工具函数
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\utils\throttle.js
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