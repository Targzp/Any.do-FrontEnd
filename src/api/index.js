/*
 * @Author: your name
 * @Date: 2021-09-18 14:25:16
 * @LastEditTime: 2021-09-18 15:19:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\api\index.js
 */
import request from '../utils/request'
export default {
    register(params) {
        return request({
            method: 'post',
            url: '/users/register',
            data: params,
            mock: true
        })
    },
    login(params) {
        return request({
            method: 'post',
            url: '/users/login',
            data: params,
            mock: true
        })
    },
    sendCode(params) {
        return request({
            method: 'post',
            url: '/users/sendCode',
            data: params,
            mock: true
        })
    }
}