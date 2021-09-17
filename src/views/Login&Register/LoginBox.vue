<!--
 * @Author: 胡晨明
 * @Date: 2021-09-17 17:34:59
 * @LastEditTime: 2021-09-17 20:52:32
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
                    :class="{loginBox__modelText__phone:true, loginBox__modelText__tips: !loginModel}"
                    @click="handleChangeModel('message')"
                >短信登录</span>
            </div>
            <el-form
                class="loginBox__Input"
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
                    <el-form-item prop="userPhone">
                        <el-input
                            class="loginBox__Input__phoneNumber"
                            type="text"
                            prefix-icon="el-icon-mobile-phone"
                            v-model="user.userPhone"
                            placeholder="请输入手机号"
                        />
                    </el-form-item>
                    <el-form-item prop="userCode">
                        <el-row justify="space-between">
                            <el-col :span="8">
                                <el-input
                                    class="loginBox__Input__code"
                                    type="text"
                                    v-model="user.userCode"
                                    placeholder="请输入验证码"
                                />
                            </el-col>
                            <el-col :span="6.5">
                                <el-button class="loginBox__Input__requireButton">获取验证码</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button class="loginBox__Input__loginButton" type="primary">登录</el-button>
                </el-form-item>
                <el-form-item class="loginBox__Input__register" @click="$emit('toChange')">
                    免费注册
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue'
/**
 * @description: 登录模块相关逻辑
 */
const useLoginEffect = () => {
    // 用户登录数据
    const user = reactive({})

    const loginModel = ref(true)

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
        userPhone: [
            {
                required: true,
                message: '请输入手机号',
                trigger: 'blur'
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
        } else {
            loginModel.value = false
        }
    }

    return {
        loginModel,
        user,
        rules,
        handleChangeModel
    }
}

// 父子数据通信
const props = defineProps({
  model: Boolean
})

// 逻辑调度
const { loginModel, user, rules, handleChangeModel } = useLoginEffect()
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
    &__modelText{
        font-size: .18rem;
        font-weight: bold;
        margin-bottom: .25rem;
        &__pwd {
            margin-right: .12rem;
            cursor: pointer;
        }
        &__phone{
            cursor: pointer;
        }
        &__tips{
            border-bottom: 2px solid black;
        }
    }
    &__Input{
        &__code{
            width: 2.3rem;
        }
        &__loginButton{
            width: 100%;
        }
        &__register{
            text-align: right;
            font-size: .14rem;
            color: $tips-fontColor;
            margin-bottom: .08rem;
            cursor: pointer;
        }
    }
}
</style>