<!--
 * @Author: 胡晨明
 * @Date: 2021-09-22 17:29:42
 * @LastEditTime: 2021-09-22 20:56:47
 * @LastEditors: Please set LastEditors
 * @Description: 设置界面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\Setting.vue
-->
<template>
    <div class="setting">
        <div class="setting__header">
            <el-icon :size="25" class="setting__header__back">
                <back />
            </el-icon>
            <span class="setting__header__content">账户设置</span>
        </div>
        <div class="setting__wrapper">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { Back } from '@element-plus/icons'
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.setting {
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    padding-top: .4rem;
    background-image: linear-gradient( 135deg, #5EFCE8 10%, #736EFE 100%);
    &__header {
        width: 7rem;
        margin: 0 auto .2rem auto;
        padding: .18rem;
        border-radius: .1rem;
        box-shadow: 0 0 .08rem .02rem #eee;
        background: $base-bgColor;
        display: flex;
        align-items: center;
        font-size: .20rem;
        &__back{
            cursor: pointer;
        }
        &__content{
            position: relative;
            bottom: .01rem;
            margin-left: .1rem;
        }
    }
    &__wrapper{
        width: 7rem;
        height: 5rem;
        margin: auto;
        padding: .18rem;
        border-radius: .1rem;
        box-shadow: 0 0 .08rem .02rem #eee;
        background: $base-bgColor;
    }
}
</style>