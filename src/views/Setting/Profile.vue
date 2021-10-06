<!--
 * @Author: 胡晨明
 * @Date: 2021-09-22 20:53:41
 * @LastEditTime: 2021-10-07 00:01:08
 * @LastEditors: Please set LastEditors
 * @Description: 设置基本账户信息界面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\Profile.vue
-->
<template>
    <div class="profile">
        <!-- 用户个人信息表单 -->
        <el-form
            :model="user"
            ref="userForm"
            :rules="rules"
            label-width="100px">
            <div class="profile__avatar">
                <el-form-item label="头像：">
                    <el-upload
                        class="profile__avatar__upload"
                        action=""
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        name="Avatar"
                    >
                        <el-avatar v-if="avatar!=' '" shape="square" :size="70" fit="fill" :src="avatar"></el-avatar>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <el-form-item label="用户名：" prop="userName">
                <el-input v-model="user.userName"></el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="userSex">
                <el-radio-group v-model="user.userSex">
                    <el-radio label="female">女</el-radio>
                    <el-radio label="male">男</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="生日：" prop="userBirthday">
                <el-date-picker
                    v-model="user.userBirthday"
                    type="date"
                    :editable="false"
                    placeholder="请输入您的生日"
                    ></el-date-picker>
            </el-form-item>
            <el-form-item label="密码：">
                已设置
                <el-link type="primary" :underline="false" @click="router.push('/setting/updatepassword')">更改密码</el-link>
            </el-form-item>
            <el-form-item label="电子邮箱：">
                {{user.userMail}}
                <span>
                    <el-link type="primary" :underline="false" @click="router.push('/setting/bindMail')">更改绑定邮箱</el-link>
                </span>
            </el-form-item>
            <el-form-item label="账号管理：">
                <el-link type="danger" :underline="false" @click="handleDelAccount">注销账号</el-link>
            </el-form-item>
            <div>
                <el-form-item label-width="0px" class="profile__submit">
                    <el-button type="primary" @click="handlePostUserProfile">保存</el-button>
                </el-form-item>
            </div>
        </el-form>
        <!-- 邮箱验证 -->
        <el-dialog
            title="邮箱验证"
            :width="350"
            top="10%"
            center
            v-model="mailTrigger"
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
                    <span>{{user.userMail}}</span>
                </el-form-item>
                <el-form-item label="验证码:" prop="userCode">
                    <el-input v-model="mailCode.userCode">
                        <template #suffix>
                            <div class="profile__requireButton" @click="handleIsMailEmpty">
                                {{computeTime>0?`${computeTime}s`:'获取验证码'}}
                            </div>
                        </template>
                    </el-input>
                </el-form-item>
                <div>
                    <el-form-item class="profile__codeConfirm">
                        <el-button plain @click="mailTrigger = false">取消</el-button>
                        <el-button type="primary" @click="handleVerifyCode">确定</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <Vcode :show="isShow" @success="handleSendCode" @close="onClose"/>
        </el-dialog>
        <!-- 裁剪框 -->
        <teleport to='body'>
            <el-dialog
                :width="500"
                top="10vh"
                center
                v-model="trigger"
                >
                <VuePictureCropper
                    :boxStyle="{
                        width: '80%',
                        height: '80%',
                        backgroundColor: '#f8f8f8',
                        margin: 'auto',
                    }"
                    :img="pic"
                    :options="{
                        viewMode: 1,
                        aspectRatio: 4 / 4,
                        dragMode: 'crop',
                    }"
                />
                <div class="imgCropper__button">
                    <el-button @click="trigger = false">取消</el-button>
                    <el-button @click="clear">清除</el-button>
                    <el-button @click="reset">重置</el-button>
                    <el-button type="primary" @click="postImage">裁切</el-button>
                </div>
            </el-dialog>
        </teleport>
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import config from '../../config/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import VuePictureCropper, { cropper } from 'vue-picture-cropper/dist/esm'
import request from '../../api/index'
import debounce from '../../utils/debounce'
import Vcode from "vue3-puzzle-vcode"
import { useSendCodeEffect } from '../../utils/verifyMail.js'

// 状态管理仓库
const store = useStore()

// 路由
const router = useRouter()

// 用户相关数据
const user = reactive({})

// 图片路径
const avatar = computed(() => {
    const { userAvatar } = toRefs(store.state.userInfo)
    if (userAvatar && userAvatar.value !== ' ') {
        return `http://192.168.105.5:${config.port}/${userAvatar.value}`
    } else {
        return ' '
    }
})

// 个人信息表单对象
const userForm = ref(null)

// 个人信息表单校验
const rules = {
    userName: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
        },
        {
            /* 异步校验用户名是否重名，并使用防抖函数防止请求过多消耗性能 */
            validator: debounce(async (rule, value, callback) => {
                try {
                    let res = await request.checkUserName({ userName: value })
                    if (res) {
                        callback(new Error('用户名已存在'))
                    } else {
                        callback()
                    }
                } catch (error) {
                    console.log(`${error}`)
                }
            }, 500)
        }
    ]
}

// 裁剪图片
const pic = ref('')

// 裁剪框状态
const trigger = ref(false)

// 上传之前钩子函数
const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
        ElMessage.error('请上传JPG格式的图片！')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('图片大小不超过2M！')
        return false
    }

    pic.value = URL.createObjectURL(file)
    trigger.value = true
    return false    // 停止上传
}

// 清除裁切框
const clear = () => {
    cropper.clear()
}

// 重置裁剪框
const reset = () => {
    cropper.reset()
}

// 剪切成功上传图片
const postImage = async () => {
    const blob = await cropper.getBlob()    // 获取裁剪图片的 blob 对象
    const formData = new FormData()
    formData.append('Avatar', blob)
    try {
        const res = await request.sendimg(formData)
        if (res) {
            ElMessage.success('上传成功')
            trigger.value = false
            store.commit('setUserAvatar', res.url)
        }
    } catch (error) {
        console.log(`${error}`)
    }
}

// 上传用户个人信息
const handlePostUserProfile = () => {
    userForm.value.validate((valid) => {
        if (valid) {
            ElMessageBox.confirm('请确认是否提交', '确认框', {
                cancelButtonText: '取消',
                confirmButtonText: '确认',
                type: 'warning',
            })
            .then(async () => {
                const { userName, userSex, userBirthday } = user
                const params = { userName, userSex, userBirthday }
                let res = await request.postProfile(params)
                if (res) {
                    ElMessage.success('修改成功')
                    store.commit('setUserProfile', res)
                }
            })
            .catch(() => {
                return
            })
        }
    })
}

// 裁剪框状态
const mailTrigger = ref(false)

// 用户邮箱验证数据
const mailCode = reactive({})

// 邮箱验证表单校验规则
const mailRules = {
    userCode: [
        {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
        }
    ]
}

// 邮箱验证表单对象
const mailForm = ref(null)

// 注销账户初始确认
const handleDelAccount = () => {
    ElMessageBox.confirm('请确认是否注销账户', '确认框', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        type: 'warning',
    })
    .then(() => {
        mailTrigger.value = true
    })
    .catch(() => {
        return
    })
}

// 验证码校验并注销账户
const handleVerifyCode = () => {
    mailForm.value.validate (async (valid) => {
        if (valid) {
            try {
                const params = { userMail: user.userMail, ...mailCode }
                let res = await request.deleteAccount(params)
                if (res) {
                    ElMessage.success('注销成功')
                    router.push('/login')
                    store.commit('saveUserInfo', {})
                }
            } catch (error) {
                console.log(`${error}`)
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

// 获取用户个人信息
;(async () => {
    try {
        let res = await request.getProfile()
        if (res) {
            store.commit('setUserProfile', res)
            Object.assign(user, store.state.userInfo)
        }
    } catch (error) {
        console.log(`${error}`)
    }
})()

</script>

<style lang="scss">
.profile{
    &__avatar{
        &__upload{
            position: relative;
            width: .7rem;
            height: .7rem;
            font-size: .25rem;
            border: .01rem solid #ccc;
            border-radius: .06rem;
            .el-icon-plus{
                color: #ccc;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
        .el-form-item__label{
            align-self: flex-end;
        }
    }

    &__submit{
        text-align: center;
    }

    &__requireButton {
            cursor: pointer;
    }

    &__codeConfirm {
        margin-left: -.08rem;
    }

    .el-input{
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

.imgCropper__button{
    margin-top: .2rem;
    text-align: center;
}
</style>