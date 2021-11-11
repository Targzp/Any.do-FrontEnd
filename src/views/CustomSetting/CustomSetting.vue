<!--
 * @Author: your name
 * @Date: 2021-10-19 16:36:38
 * @LastEditTime: 2021-10-26 15:32:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\views\CustomSetting\CustomSetting.vue
-->
<template>
    <div class="customSetting">
        <div class="customSetting__wrapper">
            <SettingHeader>
                功能与偏好
            </SettingHeader>
            <div class="customSetting__wrapper__main">
                <CustomMain />
                <CustomAside />
            </div>
        </div>
    </div>
</template>

<script setup>
import SettingHeader from '../../components/SettingHeader.vue'
import CustomMain from './CustomMain.vue'
import CustomAside from './CustomAside.vue'
</script>

<style lang="scss">
.customSetting {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow-y: auto;
    &__wrapper{
        width: 8rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all .3s ease;
        &__main{
            position: relative;
            height: 5.5rem;
            box-sizing: border-box;
            border-radius: .02rem;
            background: rgba(255, 255, 255, .2);
        }
    }
}

@media screen and (max-width: 800px) {
    /* 设置容器响应式 */
    .customSetting__wrapper{
        width: 100%;
        height: 100%;

        &__main {
            height: 92%;
        }
    }
}
</style>