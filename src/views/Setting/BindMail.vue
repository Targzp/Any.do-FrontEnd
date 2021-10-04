<!--
 * @Author: your name
 * @Date: 2021-09-22 20:53:10
 * @LastEditTime: 2021-10-03 17:55:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\BindMail.vue
-->
<template>
    <div class="bindMail">
        <el-form
            class="bindMail__mailForm"
            :model="mail"
            ref="mailForm"
            :rules="rules"
            label-width="90px">
            <el-form-item label="新邮箱:" prop="userMail">
                <el-input v-model="mail.userMail"/>
            </el-form-item>
            <el-form-item label="验证码:" prop="userCode">
                    <el-input v-model="mail.userCode">
                        <template #suffix>
                            <div class="bindMail__mailForm__requireButton" @click="handleIsMailEmpty">
                                {{computeTime>0?`${computeTime}s`:'获取验证码'}}
                            </div>
                        </template>
                    </el-input>
            </el-form-item>
            <div>
                <el-form-item label-width="0px" class="bindMail__mailForm__confirm">
                    <el-button plain @click="router.push('/setting/profile')">取消</el-button>
                    <el-button type="primary" @click="hanldeBindMail">确定</el-button>
                </el-form-item>
            </div>
        </el-form>
        <Vcode :show="isShow" @success="handleSendCode" @close="onClose"/>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useSendCodeEffect } from '../Login&Register/RegisterBox.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import request from '../../api/index'
import Vcode from "vue3-puzzle-vcode";

// 路由
const router = useRouter()

// 邮箱数据
const mail = reactive({})

// 邮箱表单对象
const mailForm = ref(null)

// 邮箱表单校验规则对象
const rules = {
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
    userCode: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
        }
    ]
}

// 绑定邮箱数据提交
const hanldeBindMail = () => {
    mailForm.value.validate((valid) => {
        if (valid) {
            ElMessageBox.confirm('请确认是否绑定', '确认框', {
                cancelButtonText: '取消',
                confirmButtonText: '确认',
                type: 'warning',
            })
            .then(async () => {
                let params = { ...mail }
                let res = await request.postUpdateBindMail(params)
                if (res) {
                    ElMessage.success('绑定成功')
                    router.push('/setting/profile')
                }
            })
            .catch(() => {
                return
            })
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
} = useSendCodeEffect(mail)
</script>

<style lang="scss">
.bindMail {
    margin-top: .3rem;
    padding-right: .2rem;  /* 视觉居中 */

    &__mailForm {
        
        &__requireButton {
            cursor: pointer;
        }

        &__confirm {
            margin: .3rem 0 0 .2rem;
        }

        .el-form-item {
            justify-content: center;
        }

        .el-form-item__content {
            flex: 0 1 auto;
        }
    }

    /* element-plus 样式修改  */
    .el-input {
        width: 2rem;
    }
}
</style>