<!--
 * @Author: 胡晨明
 * @Date: 2021-09-17 19:50:03
 * @LastEditTime: 2021-09-17 20:55:54
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
            <el-form-item prop="userPhone">
                <el-input
                    class="registerBox__Input__phoneNumber"
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
                            class="registerBox__Input__code"
                            type="text"
                            v-model="user.userCode"
                            placeholder="请输入验证码"
                        />
                    </el-col>
                    <el-col :span="6.5">
                        <el-button class="registerBox__Input__requireButton">获取验证码</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button class="registerBox__Input__registerButton" type="primary">注册</el-button>
            </el-form-item>
            <el-form-item class="registerBox__Input__login" @click="$emit('toChange')">
                去登陆 >>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
/**
 * @description: 登录模块相关逻辑
 */
const useRegisterEffect = () => {
    // 用户登录数据
    const user = reactive({})

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

    return {
        user,
        rules
    }
}

// 父子数据通信
const props = defineProps({
  model: Boolean
})

// 逻辑调度
const { user, rules } = useRegisterEffect()
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
        &__registerButton{
            width: 100%;
        }
        &__login{
            text-align: right;
            font-size: .14rem;
            color: $tips-fontColor;
            margin-bottom: .08rem;
            cursor: pointer;
        }
    }
}
</style>