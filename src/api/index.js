/*
 * @Author: 胡晨明
 * @Date: 2021-09-18 14:25:16
 * @LastEditTime: 2021-09-20 23:19:36
 * @LastEditors: Please set LastEditors
 * @Description: 接口汇总
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\api\index.js
 */
import request from '../utils/request'
export default {
    register(params) {
        return request({
            method: 'post',
            url: '/users/register',
            data: params,
            mock: false
        })
    },
    login(params) {
        return request({
            method: 'post',
            url: '/users/login',
            data: params,
            mock: false
        })
    },
    sendcode(params) {
        return request({
            method: 'post',
            url: '/users/sendcode',
            data: params,
            mock: false
        })
    }
}