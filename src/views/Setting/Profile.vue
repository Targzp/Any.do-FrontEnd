<!--
 * @Author: 胡晨明
 * @Date: 2021-09-22 20:53:41
 * @LastEditTime: 2021-09-27 23:58:11
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
                        <el-avatar v-if="userAvatar!=' '" shape="square" :size="70" fit="fill" :src="userAvatar"></el-avatar>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <el-form-item label="用户名：" prop="userName" :error="errorTips" required>
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
                    placeholder="请输入您的生日"
                    ></el-date-picker>
            </el-form-item>
            <el-form-item label="密码：">
                已设置
                <el-link type="primary" :underline="false">更改密码</el-link>
            </el-form-item>
            <el-form-item label="电子邮箱：">
                {{user.userMail}}
                <span>
                    <el-link type="primary" :underline="false">更改绑定邮箱</el-link>
                </span>
            </el-form-item>
            <el-form-item label="账号管理：">
                <el-link type="danger" :underline="false">注销账号</el-link>
            </el-form-item>
            <div>
                <el-form-item label-width="0px" class="profile__submit">
                    <el-button type="primary" @click="handlePostUserProfile">保存</el-button>
                </el-form-item>
            </div>
        </el-form>
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
import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import VuePictureCropper, { cropper } from 'vue-picture-cropper/dist/esm'
import request from '../../api/index'
import debounce from '../../utils/debounce'

// 状态管理仓库
const store = useStore()

// 用户相关数据
const user = reactive({})
Object.assign(user, store.state.userInfo)

// 图片路径
const { userAvatar } = toRefs(store.state.userInfo)

// 个人信息表单对象
const userForm = ref(null)

// 裁剪图片
const pic = ref('')

// 裁剪框状态
const trigger = ref(false)

// 用户名重名提示信息
const errorTips = ref('')

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
        console.log(error)
    }
}

// 上传用户个人信息
const handlePostUserProfile = () => {
    userForm.value.validate((valid) => {
        if (valid) {
            ElMessageBox.confirm('你确定这么做吗？小猪猪', '确认框', {
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
                }
            })
            .catch(() => {
                return
            })
        }
    })
}

// 监听用户名变化，查询是否重名
watch(() => user.userName, debounce(async ()=>{
    try {
        let res = await request.checkUserName({ userName: user.userName })
        if (res) {
            errorTips.value = '用户名已存在'
        } else {
            errorTips.value = ''
        }
    } catch (error) {
        console.log(`${error}`)
    }
}, 500))

// 获取用户个人信息
;(async () => {
    try {
        let res = await request.getProfile()
        if (res) {
            store.commit('setUserProfile', res)
            Object.assign(user, res)
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
            outline: .01rem solid #ccc;
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
    .el-input{
        width: 2rem;
    }
}
.imgCropper__button{
    margin-top: .2rem;
    text-align: center;
}
</style>