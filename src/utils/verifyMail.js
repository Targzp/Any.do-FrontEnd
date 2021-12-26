/*
 * @Author: 胡晨明
 * @Date: 2021-10-04 17:50:20
 * @LastEditTime: 2021-10-05 11:39:47
 * @LastEditors: Please set LastEditors
 * @Description: 获取验证码相关逻辑（滑动拼图，发送验证码）
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\utils\verifyMail.js
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../api/index'

/**
 * @description: 滑动拼图验证和验证码发送相关逻辑复用
 */
export const useSendCodeEffect = (user) => {
  // 获取验证码倒计时
  const computeTime = ref(0)

  // 拼图验证模态框的显示
  const isShow = ref(false)

  // 关闭拼图验证模态框
  const onClose = () => {
    isShow.value = false
  }

  // 判断邮箱是否已填
  const handleIsMailEmpty = () => {

    if (!user.userMail) {
      ElMessage.warning('请输入邮箱')
      return
    }
    if (!computeTime.value) {
      isShow.value = true
    }
  }

  // 验证成功，需要手动关闭模态框并获取验证码
  const handleSendCode = async () => {
    onClose()
    computeTime.value = 60
    let intervalId = setInterval(() => {
      computeTime.value--
      if (computeTime.value === 0) {
        clearInterval(intervalId)
      }
    }, 1000)
        
    const params = { userMail: user.userMail }
    try {
      const res = await request.sendcode(params)
      if (res) {
        ElMessage.success('发送成功')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return {
    computeTime,
    isShow,
    onClose,
    handleIsMailEmpty,
    handleSendCode
  }
}