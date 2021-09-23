<!--
 * @Author: 胡晨明
 * @Date: 2021-09-22 20:53:41
 * @LastEditTime: 2021-09-23 23:46:24
 * @LastEditors: Please set LastEditors
 * @Description: 设置基本账户信息界面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\Profile.vue
-->
<template>
    <div class="profile">
        <div class="profile__avatar">
            <el-upload
                class="profile__avatar__upload"
                action=""
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                name="Avatar"
            >
                <el-avatar v-if="imageUrl" shape="circle" :size="70" fit="cover" :src="imageUrl"></el-avatar>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
        <!-- 裁剪框 -->
        <el-dialog
            width="500px"
            top="10vh"
            center
            v-model="trigger"
            class="profile__imgCropper">
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
                    dragMode: 'crop',
                }"
            />
            <div class="profile__imgCropper__button">
                <el-button @click="trigger = false">取消</el-button>
                <el-button @click="clear">清除</el-button>
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" @click="postImage">裁切</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import VuePictureCropper, { cropper } from 'vue-picture-cropper/dist/esm'
import request from '../../api/index'

const useAvatarEffect = () => {
    // 用户相关数据
    const user = reactive({})

    // 图片路径
    const imageUrl = ref('')

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

    // 剪切成功上传图片
    const postImage = async () => {
        const blob = await cropper.getBlob()    // 获取裁剪图片的 blob 对象
        const formData = new FormData()
        formData.append('Avatar', blob)
        const res = await request.sendImg(formData)
        if (res) {
            ElMessage.success('上传成功')
            trigger.value = false
            imageUrl.value = URL.createObjectURL(blob)
        }
    }

    // 清除裁切框
    const clear = () => {
      cropper.clear()
    }

    // 重置裁剪框
    const reset = () => {
      cropper.reset()
    }

    return {
        user,
        imageUrl,
        pic,
        trigger,
        beforeAvatarUpload,
        postImage,
        clear,
        reset
    }
}

const {
    user,
    imageUrl,
    pic,
    trigger,
    beforeAvatarUpload,
    postImage,
    clear,
    reset
} = useAvatarEffect()
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
            border-radius: .5rem;
            .el-icon-plus{
                color: #ccc;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    &__imgCropper{
        &__button{
            margin-top: .2rem;
            text-align: center;
        }
    }
}
</style>