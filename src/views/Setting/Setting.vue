<!--
 * @Author: 胡晨明
 * @Date: 2021-09-22 17:29:42
 * @LastEditTime: 2021-09-28 00:00:34
 * @LastEditors: Please set LastEditors
 * @Description: 设置界面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\Setting.vue
-->
<template>
    <div class="setting">
        <div class="setting__wrapper">
            <div class="setting__wrapper__header">
                <el-icon :size="25" class="setting__wrapper__back" @click="router.replace('/')">
                    <back />
                </el-icon>
                <span class="setting__wrapper__content">账户设置</span>
            </div>
            <div class="setting__wrapper__main">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Back } from '@element-plus/icons'

// 路由实例
const router = useRouter()
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.setting {
    width: 100%;
    height: 100vh;
    position: relative;
    box-sizing: border-box;
    padding-top: .4rem;
    background-image: linear-gradient( 135deg, #5EFCE8 10%, #736EFE 100%);
    overflow-y: auto;
    &__wrapper{
        width: 6rem;
        margin: 0 auto .2rem auto;
        transition: all .3s ease;
        &__header {
            padding: .18rem;
            margin-bottom: .2rem;
            border-radius: .1rem;
            box-shadow: 0 0 .08rem .02rem #eee;
            background: $base-bgColor;
            display: flex;
            align-items: center;
            font-size: .20rem;
        }
        &__back{
                cursor: pointer;
        }
        &__content{
                position: relative;
                bottom: .01rem;
                margin-left: .1rem;
        }
        &__main{
            padding: .18rem;
            border-radius: .1rem;
            box-shadow: 0 0 .08rem .02rem #eee;
            background: $base-bgColor;
        }
    }
}

@media screen and (max-width: 650px) {
    .setting__wrapper{
        width: 3.5rem;
    }
}
</style>