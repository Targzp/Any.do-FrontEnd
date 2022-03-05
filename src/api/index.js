/*
 * @Author: 胡晨明
 * @Date: 2021-09-18 14:25:16
 * @LastEditTime: 2022-02-24 22:42:29
 * @LastEditors: 胡晨明
 * @Description: 接口汇总
 */
import { register, login, logout, sendcode, verifyCode } from './modules/logReg'
import { getProfile, checkUserName, sendimg, postProfile, postUpdatePassword, postUpdateBindMail, deleteAccount, searchUser, countUserUseDays, getUserUseDays } from './modules/userInfo'
import { postUserAdvice } from './modules/feedback'
import { getCustomSettings, getUserFunctions, getUserTaskDefault, postCustomSettings } from './modules/userSettings'
import { getUserLists, searchUserLists, postUserAddList, postUserDeleteList, postUserEditList } from './modules/lists'
import { getUserAllTasks, searchUserTask, getUserTask, getTaskDevelopments, postUserAddTask, postUserUpdateTask, postUserDeleteTask, postUserBatchDeleteTask, postUserTaskFile, deleteUserTaskFile, userTaskMailNotify } from './modules/tasks'
import { sendInviteNotice, sendRejectInviteNotice, sendAgreeInviteNotice, sendRemoveUserNotice, sendTaskNotice, getNotifications, deleteNotification } from './modules/notice'
import { getShareLists, getShareTasks, getShareUsers, getShareTaskDevelopment, assignMemberTask, getAssignMemberId, deleteAssignMember, deleteShareUser } from './modules/shareLists'
import { sendChatData } from './modules/chat'
import { getUserFocus, getUserFocusStatistics, postUserFocus } from './modules/focuses'
import { getUserHabitsData, getUserDoneHabitsData, addUserHabitData, deleteUserHabitData, editUserHabitData, clockUserHabit, getUserHabitStatistics} from './modules/habits'
import { getUserAchievements, getUserTDLtotal } from './modules/achievements'
export default {
  // 注册接口
  register,
  // 登录接口
  login,
  // 退出登录接口
  logout,
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
  // 用户查询接口
  searchUser,
  // 用户计算使用天数和上次登录时间接口
  countUserUseDays,
  // 用户获取使用天数接口
  getUserUseDays,
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
  // 用户搜索清单列表数据接口
  searchUserLists,
  // 提交用户添加清单数据接口
  postUserAddList,
  // 用户删除清单接口
  postUserDeleteList,
  // 用户清单名称修改接口
  postUserEditList,
  // 获取用户全部任务列表接口
  getUserAllTasks,
  // 用户查询任务接口
  searchUserTask,
  // 获取用户指定任务接口
  getUserTask,
  // 获取任务动态列表接口
  getTaskDevelopments,
  // 提交用户添加任务数据接口
  postUserAddTask,
  // 提交用户任务设定值修改数据接口
  postUserUpdateTask,
  // 提交删除用户任务数据接口
  postUserDeleteTask,
  // 提交批量删除任务数据接口
  postUserBatchDeleteTask,
  // 提交用户任务附件接口
  postUserTaskFile,
  // 删除用户任务附件接口
  deleteUserTaskFile,
  // 任务邮件通知
  userTaskMailNotify,
  // 用户发起共享清单邀请通知接口
  sendInviteNotice,
  // 用户拒绝共享清单邀请通知接口
  sendRejectInviteNotice,
  // 用户接受共享清单邀请通知接口
  sendAgreeInviteNotice,
  // 用户移除共享清单成员通知接口
  sendRemoveUserNotice,
  // 用户修改共享清单任务通知接口
  sendTaskNotice,
  // 用户获取通知数据接口
  getNotifications,
  // 用户删除通知数据接口
  deleteNotification,
  // 用户获取共享清单下清单数据接口
  getShareLists,
  // 用户获取共享清单下任务列表接口
  getShareTasks,
  // 用户获取共享清单下人员列表接口
  getShareUsers,
  // 用户获取共享清单下任务动态列表接口
  getShareTaskDevelopment,
  // 用户指派共享清单任务至目标成员接口
  assignMemberTask,
  // 用户获取共享清单任务指派成员 id 接口
  getAssignMemberId,
  // 用户移除共享清单任务指派成员接口
  deleteAssignMember,
  // 用户移除共享清单下人员接口
  deleteShareUser,
  // 用户发送聊天数据接口
  sendChatData,
  // 用户获取专注数据接口
  getUserFocus,
  // 用户获取专注统计数据接口
  getUserFocusStatistics,
  // 用户提交专注数据接口
  postUserFocus,
  // 用户获取习惯打卡数据列表
  getUserHabitsData,
  // 用户获取已归档习惯打卡数据列表
  getUserDoneHabitsData,
  // 用户新增习惯打卡数据
  addUserHabitData,
  // 用户删除习惯打卡数据
  deleteUserHabitData,
  // 用户修改习惯打卡数据
  editUserHabitData,
  // 用户进行习惯打卡/取消打卡
  clockUserHabit,
  // 用户获取习惯打卡统计数据
  getUserHabitStatistics,
  // 用户获取成就值数据
  getUserAchievements,
  // 用户获取任务和已完成任务以及清单数量
  getUserTDLtotal
}