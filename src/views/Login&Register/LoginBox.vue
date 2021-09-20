<!--
 * @Author: 胡晨明
 * @Date: 2021-09-17 17:34:59
 * @LastEditTime: 2021-09-20 23:18:22
 * @LastEditors: Please set LastEditors
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
                <el-form-item class="loginBox__Input__register" @click="$emit('toChange')">
                    免费注册
                </el-form-item>
            </el-form>
        </div>
        <Vcode :show="isShow" @success="handleSendCode" @close="onClose" />
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import request from '../../api/index'
import Vcode from 'vue3-puzzle-vcode'

const router = useRouter() 
const store = useStore()

/**
 * @description: 登录模块相关逻辑
 */
const useLoginEffect = () => {
    // 用户登录数据
    const user = reactive({})

    const loginModel = ref(true)

    const loginForm = ref(null)

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

        // 获取验证码倒计时
    const computeTime = ref(0)

    // 拼图验证模态框的显示
    const isShow = ref(false)

    // 关闭拼图验证模态框
    const onClose = () => {
      isShow.value = false
    }

    // 判断手机号是否已填
    const handleIsMailEmpty = () => {
        if (computeTime > 0) {
            return 
        }
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
        }, 1000);
        
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

    // 控制密码/短信登录模式切换
    const handleChangeModel = (tip) => {
        if (tip === 'password') {
            loginModel.value = true
        } else {
            loginModel.value = false
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
                        store.commit('saveUserInfo', res)
                        router.push({name: 'Home'})
                    }
                } catch (error) {
                    console.error(error)
                }
            }
        })
    }

    return {
        loginModel,
        user,
        rules,
        loginForm,
        computeTime,
        isShow,
        onClose,
        handleIsMailEmpty,
        handleSendCode,
        handleChangeModel,
        handleLoginSubmit
    }
}

// 父子数据通信
const props = defineProps({
  model: Boolean
})

// 逻辑调度
const {
    loginModel,
    user,
    rules,
    loginForm,
    computeTime,
    isShow,
    onClose,
    handleIsMailEmpty,
    handleSendCode,
    handleChangeModel,
    handleLoginSubmit
} = useLoginEffect()
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.loginHeader {
    font-size: .16rem;
    font-weight: bold;
    height: .6rem;
    background: $base-bgColor;
    border-radius: .1rem;
    box-shadow: 0 0 .08rem .02rem #eee;
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
.loginBox{
    width: 4rem;
    padding: .4rem .2rem 0 .2rem;
    box-sizing: border-box;
    background: $base-bgColor;
    box-shadow: 0 0 .08rem .02rem #eee;
    border-radius: .1rem;
    transition: all 0.5s ease;
    &__modelText{
        font-size: .18rem;
        font-weight: bold;
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
</style>