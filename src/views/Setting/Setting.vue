<!--
 * @Author: 胡晨明
 * @Date: 2021-09-22 17:29:42
 * @LastEditTime: 2021-10-26 15:47:50
 * @LastEditors: Please set LastEditors
 * @Description: 设置界面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Setting\Setting.vue
-->
<template>
    <div class="setting">
        <div class="setting__wrapper">
            <SettingHeader>
                账号设置
            </SettingHeader>
            <div class="setting__wrapper__main">
                <router-view v-slot="{ Component }">
                    <transition name="setting" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>

<script setup>
import SettingHeader from '../../components/SettingHeader.vue'
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";

.setting-enter-active {
  transition: all .3s cubic-bezier(0.46,0.03,0.52,0.96);;
}

.setting-leave-active {
  transition: all .3s cubic-bezier(0.46,0.03,0.52,0.96);;
}

.setting-enter-from,
.setting-leave-to {
  opacity: 0;
}

.setting {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow-y: auto;
    &__wrapper{
        width: 6rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: all .3s ease;
        &__main{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 6rem;
            padding: .18rem;
            box-sizing: border-box;
            border-radius: .02rem;
            background: rgba(255, 255, 255, .2);
        }
    }

    .el-dialog__header {
        text-align: left;
        font-size: .12rem;
    }
}

@media screen and (max-width: 800px) {
    .setting__wrapper{
        width: 100%;
        height: 100%;

        &__main {
            height: 92%;
        }
    }
}
</style>