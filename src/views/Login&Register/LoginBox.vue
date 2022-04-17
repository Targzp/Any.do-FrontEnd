<!--
 * @Author: 胡晨明
 * @Date: 2021-09-17 17:34:59
 * @LastEditTime: 2022-03-19 12:06:01
 * @LastEditors: 胡晨明
 * @Description: 登录模块页面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Login&Register\LoginBox.vue
-->
<template>
    <div>
        <div class="loginHeader">
            <img src="../../assets/images/完成.png" alt="产品标志">
            <span>个人事务贴身管家</span>
        </div>
        <div class="loginBox">
            <div class="loginBox__modelText">
                <span 
                    :class="{loginBox__modelText__pwd:true, loginBox__modelText__tips: loginModel}"
                    @click="handleChangeModel('password')"
                >密码登录</span>
                <span
                    :class="{loginBox__modelText__Mail:true, loginBox__modelText__tips: !loginModel}"
                    @click="handleChangeModel('message')"
                >邮箱登录</span>
            </div>
            <el-form
                class="loginBox__Input"
                ref="loginForm"
                :model="user"
                :rules="rules">
                <div v-if="loginModel">
                    <el-form-item prop="userName">
                        <el-input
                            type="text"
                            prefix-icon="el-icon-s-custom"
                            v-model="user.userName"
                            placeholder="请输入用户名"
                        />
                    </el-form-item>
                    <el-form-item prop="userPwd">
                        <el-input
                            type="password"
                            prefix-icon="el-icon-lock"
                            v-model="user.userPwd"
                            placeholder="请输入密码"
                            @keyup.enter="handleLoginSubmit"
                        />
                    </el-form-item>
                </div>
                <div v-else>
                    <el-form-item prop="userMail">
                        <el-input
                            class="loginBox__Input__MailNumber"
                            type="text"
                            prefix-icon="el-icon-message"
                            v-model="user.userMail"
                            placeholder="请输入邮箱"
                        />
                    </el-form-item>
                    <el-form-item prop="userCode">
                        <el-input
                            class="loginBox__Input__code"
                            type="text"
                            v-model="user.userCode"
                            placeholder="请输入验证码"
                        >
                            <template #suffix>
                                <div
                                    class="loginBox__Input__requireButton"
                                    @click="handleIsMailEmpty">
                                    {{computeTime>0?`${computeTime}s`:'获取验证码'}}
                                </div>
                            </template>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button
                        class="loginBox__Input__loginButton"
                        type="primary"
                        @click="handleLoginSubmit">登录</el-button>
                </el-form-item>
                <el-form-item class="loginBox__Input__register" @click="$emit('update:mode', false)">
                    免费注册
                </el-form-item>
            </el-form>
        </div>
        <Vcode :show="isShow" @success="handleSendCode" @close="onClose" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { useSendCodeEffect } from '../../utils/verifyMail.js'
import request from '../../api/index'
import Vcode from 'vue3-puzzle-vcode'
import Socket from '../../utils/websocket'

const router = useRouter() 
const store = useStore()

// 用户登录数据
const user = reactive({})

// 登录模式
const loginModel = ref(true)

// 登录表单对象
const loginForm = ref(null)

// 输入密码计数器
let pwdFrequency = 0

const rules = {
  userName: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  userPwd: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  userMail: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: '请输入正确格式的邮箱',
      trigger: 'change'
    }
  ],
  userCode:[
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ]
}

// 控制密码/短信登录模式切换
const handleChangeModel = (tip) => {
  if (tip === 'password') {
    loginModel.value = true
    user.userMail = ''
    user.userCode = ''
  } else {
    loginModel.value = false
    user.userName = ''
    user.userPwd = ''
  }

  // 切换登录模式时删除之前模式的值
  for (key in user) {
    user.hasOwnProperty(key) && delete user[key]
  }
}

// 用户登录数据提交
const handleLoginSubmit = () => {
  loginForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const params = { ...user }
        const res = await request.login(params)
        if (res) {
          ElMessage.success('登录成功')
          store.commit('saveUserInfo', res)  //* 保存登录用户信息
          Socket.useWebSocket()  //* 登录成功后进行 webSocket 连接
          store.dispatch('saveUserTasksDB') //* 获取后端全部用户任务数据
          router.push({ name: 'Home' })
        }
      } catch (error) {
        // 当账户或密码输错超过三次则需进行人机验证
        pwdFrequency++
        if (pwdFrequency > 3) {
          isShow.value = true
        }
      }
    }
  })
}

// 发送邮箱验证码逻辑
const { 
  computeTime,
  isShow,
  onClose,
  handleIsMailEmpty,
  handleSendCode
} = useSendCodeEffect(user)

// 父子数据通信
defineProps({
  mode: Boolean
})

defineEmits(['update:mode'])
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.loginHeader {
    font-size: .16rem;
    font-weight: bold;
    color: $base-fontColor;
    height: .6rem;
    background: rgba(255, 255, 255, .15);
    border-radius: .1rem;
    margin-bottom: .15rem;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
        width: .3rem;
        height: .3rem;
        margin-right: .08rem;
    }
}
.loginHeader::before {
    @include filter_blur;
}
.loginBox{
    width: 4rem;
    padding: .4rem .2rem 0 .2rem;
    box-sizing: border-box;
    background: rgba(255, 255, 255, .2);
    position: relative;
    border-radius: .1rem;
    transition: all 0.5s ease;
    &__modelText{
        font-size: .18rem;
        font-weight: bold;
        color: $base-fontColor;
        margin-bottom: .25rem;
        &__pwd {
            margin-right: .12rem;
            cursor: pointer;
        }
        &__Mail{
            cursor: pointer;
        }
        &__tips{
            border-bottom: 2px solid black;
        }
    }
    &__Input{
        &__requireButton{
            color: #FFF;
            cursor: pointer;
        }
        &__loginButton{
            width: 100%;
        }
        &__register{
            width: .8rem;
            margin-left: auto;
            margin-right: 0;
            text-align: right;
            font-size: .14rem;
            color: $tips-fontColor;
            margin-bottom: .08rem;
            cursor: pointer;
        }
    }
}
.loginBox::before {
    @include filter_blur;
}
</style>