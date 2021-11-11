<!--
 * @Author: 胡晨明
 * @Date: 2021-10-19 17:08:47
 * @LastEditTime: 2021-10-23 15:55:12
 * @LastEditors: Please set LastEditors
 * @Description: 用户账号/自定义功能设置头部UI组件
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\components\SettingHeader.vue
-->
<template>
    <div class="settingHeader">
        <el-icon :size="25" class="settingHeader__back" @click="router.replace('/')">
            <back />
        </el-icon>
        <span class="settingHeader__content">
            <slot></slot>
        </span>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Back } from '@element-plus/icons'

// 路由实例
const router = useRouter()
</script>

<style lang="scss">
@import "../assets/style/variables.scss";
.settingHeader {
    padding: .18rem;
    margin-bottom: .2rem;
    border-radius: .02rem;
    box-sizing: border-box;
    background: rgba(255, 255, 255, .15);
    display: flex;
    align-items: center;
    font-size: .20rem;

    &__back{
        cursor: pointer;
    }

    &__content{
        color: $base-fontColor;
        position: relative;
        bottom: .01rem;
        margin-left: .1rem;
    }
}

@media screen and (max-width: 800px) {
    /* 设置头部响应式 */
    .settingHeader {
        height: 8%;
        margin-bottom: 0;
    }
}
</style>