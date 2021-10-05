/*
 * @Author: 胡晨明
 * @Date: 2021-09-18 14:25:16
 * @LastEditTime: 2021-10-02 23:26:11
 * @LastEditors: Please set LastEditors
 * @Description: 接口汇总
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\api\index.js
 */
import request from '../utils/request'
export default {
    // 注册接口
    register(params) {
        return request({
            method: 'post',
            url: '/users/register',
            data: params,
            mock: false
        })
    },
    // 登录接口
    login(params) {
        return request({
            method: 'post',
            url: '/users/login',
            data: params,
            mock: false
        })
    },
    // 发送验证码接口
    sendcode(params) {
        return request({
            method: 'post',
            url: '/users/sendcode',
            data: params,
            mock: false
        })
    },
    // 上传图片接口
    sendimg(params) {
        return request({
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            url: '/users/sendimg',
            data: params,
            mock: false
        })
    },
    // 检查用户名接口
    checkUserName(params) {
        return request({
            method: 'post',
            url: '/users/checkusername',
            data: params,
            mock: false
        })
    },
    // 验证码检测接口
    verifyCode(params) {
        return request({
            method: 'post',
            url: '/users/verifycode',
            data: params,
            mock: false
        })
    },
    // 获取用户个人信息接口
    getProfile() {
        return request({
            method: 'get',
            url: '/users/profile',
            data: {},
            mock: false
        })
    },
    // 提交用户个人信息接口
    postProfile(params) {
        return request({
            method: 'post',
            url: '/users/userprofile',
            data: params,
            mock: false
        })
    },
    // 提交密码更改数据接口
    postUpdatePassword(params) {
        return request({
            method: 'post',
            url: '/users/updatepassword',
            data: params,
            mock: false
        })
    },
    // 绑定邮箱更新接口
    postUpdateBindMail(params) {
        return request({
            method: 'post',
            url: '/users/updatebindmail',
            data: params,
            mock: false
        })
    },
    // 注销账户接口
    deleteAccount(params) {
        return request({
            method: 'post',
            url: '/users/deleteaccount',
            data: params,
            mock: false
        })
    }
}