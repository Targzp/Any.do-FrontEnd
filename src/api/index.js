/*
 * @Author: 胡晨明
 * @Date: 2021-09-18 14:25:16
 * @LastEditTime: 2021-11-02 18:08:07
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
    },
    // 上传用户反馈接口
    postUserAdvice(params) {
        return request({
            method: 'post',
            url: '/feedback',
            data: params,
            mock: false
        })
    },
    // 获取用户自定义设置数据接口
    getCustomSettings() {
        return request({
            method: 'get',
            url: '/customsettings/usercustomsettings',
            data: {},
            mock: false
        })
    },
    // 提交用户自定义设置数据接口
    postCustomSettings(params) {
        return request({
            method: 'post',
            url: '/customsettings/postcustomsettings',
            data: params,
            mock: false
        })
    },
    // 获取用户功能开启列表接口
    getUserFunctions() {
        return request({
            method: 'get',
            url: '/customsettings/userfunctions',
            data: {},
            mock: false
        })
    },
    // 用户任务设定默认值获取接口
    getUserTaskDefault() {
      return request({
        method: 'get',
        url: '/customsettings/usertaskdefault',
        data: {},
        mock: false
      })
    },
    // 获取用户清单列表数据接口
    getUserLists() {
        return request({
            method: 'get',
            url: '/lists/userlists',
            data: {},
            mock: false
        })
    },
    // 提交用户添加清单数据接口
    postUserAddList(params) {
        return request({
            method: 'post',
            url: '/lists/addlist',
            data: params,
            mock: false
        })
    },
    // 用户删除清单接口
    postUserDeleteList(params) {
      return request({
        method: 'post',
        url: '/lists/deletelist',
        data: params,
        mock: false
      })
    },
    // 用户清单名称修改接口
    postUserEditList(params) {
      return request({
        method: 'post',
        url: '/lists/editlist',
        data: params,
        mock: false
      })
    }
}