/*
 * @Author: 胡晨明
 * @Date: 2022-02-13 15:38:34
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-13 15:38:35
 * @Description: 用户发送聊天数据相关接口
 */
import request from '@/utils/request'

// 用户发送聊天数据接口调用定义
export const sendChatData = (params) => {
  return request({
    method: 'post',
    url: '/chat/send',
    data: params,
    mock: false
  })
}
