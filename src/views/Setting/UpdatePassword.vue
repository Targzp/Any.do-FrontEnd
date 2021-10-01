<!--
 * @Author: your name
 * @Date: 2021-09-22 20:53:20
 * @LastEditTime: 2021-10-02 00:09:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\UpdatePassword.vue
-->
<template>
    <div class="updatePwd">
        <el-form
            class="updatePwd__pwdForm"
            :model="userPwd"
            ref="pwdForm"
            :rules="pwdRules"
            label-width="90px">
            <el-form-item label="旧密码:" prop="oldPwd" class="updatePwd__pwdForm__oldPwd">
                <el-input v-model="userPwd.oldPwd" show-password>
                    <template #append>
                        <span @click="trigger = true">忘记密码</span>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="newPwd">
                <el-tooltip
                    effect="dark"
                    content="字母开头，长度6~18，包含字母、数字和下划线"
                    placement="top"
                    :manual="true"
                    v-model="showPwdTip"
                >
                    <el-input
                        v-model="userPwd.newPwd" 
                        show-password 
                        @focus="showPwdTip = true"
                        @blur="showPwdTip = false"

                    ></el-input>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="确认密码:" prop="confirmPwd">
                <el-input v-model="userPwd.confirmPwd" show-password></el-input>
            </el-form-item>
            <div>
                <el-form-item label-width="0px" class="updatePwd__pwdForm__submit">
                    <el-button plain @click="">取消</el-button>
                    <el-button type="primary">确定</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-dialog
            title="邮箱验证"
            :width="400"
            top="10%"
            center
            v-model="trigger"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
        >
            <el-form
                :model="mailCode"
                ref="mailForm"
                :rules="mailRules"
                label-width="100px"
            >
                <el-form-item label="发送邮箱:">
                    <span>{{mailCode.userMail}}</span>
                </el-form-item>
                <el-form-item label="验证码:" prop="code">
                    <el-input v-model="mailCode.code">
                        <template #suffix>
                            <div class="updatePwd__requireButton" @click="handleIsMailEmpty">
                                {{computeTime>0?`${computeTime}s`:'获取验证码'}}
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <div>
                    <el-form-item class="updatePwd__codeConfirm">
                        <el-button plain @click="trigger = false">取消</el-button>
                        <el-button type="primary">确定</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <Vcode :show="isShow" @success="handleSendCode" @close="onClose"/>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useSendCodeEffect } from '../Login&Register/RegisterBox.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import request from '../../api/index'
import debounce from '../../utils/debounce'
import Vcode from "vue3-puzzle-vcode";

// 状态管理仓库
const store = useStore()

// 路由
const router = useRouter()

// 用户密码数据
const userPwd = reactive({})

// 密码输入提示
const showPwdTip = ref(false)

// 密码表单对象
const pwdForm = ref(null)

// 密码表单校验规则
const pwdRules = {
    oldPwd: [
        {
            required: true,
            message: '请填写旧密码',
            trigger: 'blur'
        },
        {
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '密码强度不符合要求',
            trigger: 'change'
        }
    ],
    newPwd: [
        {
            required: true,
            message: '请填写新密码',
            trigger: 'blur'
        },
        {
            pattern: /^[a-zA-Z]\w{5,17}$/,
            message: '密码强度不符合要求',
            trigger: 'change'
        }
    ],
    confirmPwd: [
        {
            required: true,
            message: '请确认密码',
            trigger: 'blur'
        },
        {
            validator: (rule, value, callback) => {
                if (value !== userPwd.newPwd) {
                    callback(new Error('密码不一致'))
                }
            }
        }
    ]
}

// 对话框状态变量
const trigger = ref(false)

// 用户邮箱数据
const mailCode = reactive({
    userMail: store.state.userInfo.userMail
})

// 邮箱验证表单对象
const mailForm = ref(null)

// 发送邮箱验证码逻辑
const { 
    computeTime,
    isShow,
    onClose,
    handleIsMailEmpty,
    handleSendCode
} = useSendCodeEffect(mailCode)
</script>

<style lang="scss">
.updatePwd {
    margin-top: .3rem;
    padding-right: .2rem;  /* 视觉居中 */

    &__pwdForm {
        &__oldPwd{
            position: relative;
        }

        &__submit {
            margin: .3rem 0 0 .2rem;
        }
        .el-form-item {
            justify-content: center;
        }

        .el-form-item__content {
            flex: 0 1 auto;
        }

        .el-input-group__append {
            cursor: pointer;
            padding: 0 .05rem;
            font-size: .11rem;
        }
    }

    &__requireButton {
        cursor: pointer;
    }

    &__codeConfirm {
        margin-left: .15rem;
    }

    /* element-plus 样式修改  */
    .el-input {
        width: 2rem;
    }

    .el-dialog__header {
        text-align: left;
        font-size: .12rem;
    }

    .el-dialog__body {
        padding-top: .08rem;
        padding-bottom: .05rem;
    }

    .el-overlay {
        z-index: 998 !important;
    }
}
</style>