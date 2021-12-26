/*
 * @Author: 胡晨明
 * @Date: 2021-09-18 14:25:16
 * @LastEditTime: 2021-12-13 09:41:32
 * @LastEditors: Please set LastEditors
 * @Description: 接口汇总
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\api\index.js
 */
import { register, login, sendcode, verifyCode } from './modules/logReg'
import { getProfile, checkUserName, sendimg, postProfile, postUpdatePassword, postUpdateBindMail, deleteAccount } from './modules/userInfo'
import { postUserAdvice } from './modules/feedback'
import { getCustomSettings, getUserFunctions, getUserTaskDefault, postCustomSettings } from './modules/userSettings'
import { getUserLists, postUserAddList, postUserDeleteList, postUserEditList } from './modules/lists'
import { getUserAllTasks, postUserAddTask, postUserUpdateTask } from './modules/tasks'
export default {
  // 注册接口
  register,
  // 登录接口
  login,
  // 发送验证码接口
  sendcode,
  // 验证码检测接口
  verifyCode,
  // 获取用户个人信息接口
  getProfile,
  // 检查用户名接口
  checkUserName,
  // 上传图片接口
  sendimg,
  // 提交用户个人信息接口
  postProfile,
  // 提交密码更改数据接口
  postUpdatePassword,
  // 绑定邮箱更新接口
  postUpdateBindMail,
  // 注销账户接口
  deleteAccount,
  // 上传用户反馈接口
  postUserAdvice,
  // 获取用户自定义设置数据接口
  getCustomSettings,
  // 获取用户功能开启列表接口
  getUserFunctions,
  // 用户任务设定默认值获取接口
  getUserTaskDefault,
  // 提交用户自定义设置数据接口
  postCustomSettings,
  // 获取用户清单列表数据接口
  getUserLists,
  // 提交用户添加清单数据接口
  postUserAddList,
  // 用户删除清单接口
  postUserDeleteList,
  // 用户清单名称修改接口
  postUserEditList,
  // 获取用户全部任务列表接口
  getUserAllTasks,
  // 提交用户添加任务数据接口
  postUserAddTask,
  // 提交用户任务设定值修改数据接口
  postUserUpdateTask
}