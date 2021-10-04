<!--
 * @Author: 胡晨明
 * @Date: 2021-09-17 19:50:03
 * @LastEditTime: 2021-10-03 23:43:09
 * @LastEditors: Please set LastEditors
 * @Description: 注册模块页面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Login&Register\RegisterBox.vue
-->
<template>
<div class="registerBox">
        <div class="registerBox__modelText">
            <span>用户注册</span>
        </div>
        <el-form
            class="registerBox__Input"
            ref="registerForm"
            :model="user"
            :rules="rules">
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
            <el-form-item prop="userMail">
                <el-input
                    class="registerBox__Input__MailNumber"
                    type="text"
                    prefix-icon="el-icon-message"
                    v-model="user.userMail"
                    placeholder="请输入邮箱"
                />
            </el-form-item>
            <el-form-item prop="userCode">
                <el-input
                    class="registerBox__Input__code"
                    type="text"
                    v-model="user.userCode"
                    placeholder="请输入验证码"
                >
                    <template #suffix>
                        <div
                            class="registerBox__Input__requireButton"
                            @click="handleIsMailEmpty">
                            {{computeTime>0?`${computeTime}s`:'获取验证码'}}
                        </div>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="registerBox__Input__registerButton" type="primary" @click="handleRegisterSubmit">注册</el-button>
            </el-form-item>
            <el-form-item class="registerBox__Input__login" @click="$emit('update:mode', true)">
                去登陆 >>
            </el-form-item>
        </el-form>
        <Vcode :show="isShow" @success="handleSendCode" @close="onClose" />
    </div>
</template>

<script>
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
</script>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Vcode from "vue3-puzzle-vcode";
import request from '../../api/index'

const router = useRouter() 

// 用户注册数据
const user = reactive({})

// 注册表单元素对象
const registerForm = ref(null)

// 注册表单校验规则
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
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '字母开头，长度6~18，包含字母、数字和下划线',
            trigger: 'change'
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

// 用户注册数据提交
const handleRegisterSubmit =  () => {
    registerForm.value.validate(async (valid) => {
        if (valid) {
            try {
                const params =  { ...user }
                const res = await request.register(params)
                if (res) {
                    ElMessage.success('注册成功')
                    emit('update:mode', true)
                }
            } catch (error) {
                console.error(error)
            }
        }
    })
}

// 父子数据通信
const props = defineProps({
  model: Boolean
})

const emit = defineEmits(['update:mode'])

const { 
    computeTime,
    isShow,
    onClose,
    handleIsMailEmpty,
    handleSendCode
} = useSendCodeEffect(user)
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.registerBox{
    width: 4rem;
    padding: .4rem .2rem .03rem .2rem;
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
        &__registerButton{
            width: 100%;
        }
        &__login{
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