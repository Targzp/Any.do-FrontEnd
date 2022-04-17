/*
 * @Author: 胡晨明
 * @Date: 2022-01-23 14:40:11
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-08 00:09:18
 * @Description: webSocket 消息处理函数
 */
import store from '@/store'

export default function handleWebSokcetMessage (res) {
  const resD = JSON.parse(res.data)

  switch (resD.flag) {
    case 'CONNECT':
      console.log(resD.msg)
      break
    case 'SHARELIST':
    case 'AGREESHARELIST':
    case 'REJECTSHARELIST':
    case 'ADDTASK':
    case 'EDITTASK':
    case 'DONETASK':
    case 'ADDFILE':
    case 'DELETEFILE':
    case 'ASSIGNTASK':
      store.commit('addUserNotification', resD.data)
      break
    case 'DELETETASK':
    case 'REMOVEASSIGNTASK':
      store.commit('addUserNotification', resD.data)
      store.commit('deleteShareUserTask', resD.data)
      break
    case 'REMOVEMEMBER':
      store.commit('addUserNotification', resD.data)
      store.commit('deleteShareUserList', resD.data.listId)
      break
    case 'CHATDATA':
      store.commit('addChatData', resD.data)
      break
    default:
      break
  }
}
