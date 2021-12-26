/*
 * @Author: 胡晨明
 * @Date: 2021-12-13 09:20:42
 * @LastEditTime: 2021-12-13 09:25:27
 * @LastEditors: Please set LastEditors
 * @Description: 用户反馈相关接口
 * @FilePath: \Anydo-app\src\api\modules\feedback.js
 */
import request from '@/utils/request'

// 上传用户反馈接口调用定义
export const postUserAdvice = (params) => {
  return request({
    method: 'post',
    url: '/feedback',
    data: params,
    mock: false
  })
}
