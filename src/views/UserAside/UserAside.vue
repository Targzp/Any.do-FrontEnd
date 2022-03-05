<!--
 * @Author: 胡晨明
 * @Date: 2021-10-09 16:57:58
 * @LastEditTime: 2022-02-13 20:26:50
 * @LastEditors: 胡晨明
 * @Description: 用户账户及功能侧边栏区域
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Home\UserAside.vue
-->
<template>
    <div :class="['UserAside', isHide?'UserAside--hide':'']">
        <!-- 用户附加功能区域 -->
        <UserAddition />
        <!-- 用户主要功能区域 -->
        <div class="UserAside__all">
            <el-scrollbar>
                <!-- 所有和今天清单整理列表 -->
                <UserFastList />
                <!-- 用户清单列表 -->
                <UserLists />
                <!-- 已完成和垃圾桶 -->
                <UserTaskRecoveryVue />
                <!-- 功能区域 -->
                <UserFunction />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import UserAddition from './UserAddition.vue'
import UserLists from './UserLists.vue'
import UserFunction from './UserFunctions.vue'
import UserFastList from './UserFastList.vue'
import UserTaskRecoveryVue from './UserTaskRecovery.vue'

const store = useStore()

const isHide = computed(() => {
  return store.state.aside.isHide
})
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.UserAside {
    width: 100%;
    font-size: .14rem;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    background: rgba(255, 255, 255, 0.15);
    border-radius: .02rem;
    user-select: none;
    position: relative;
    overflow: hidden;
    transition: all .5s ease;

    &--hide {
      transform: translateX(-450px);
      opacity: 0;
    }

    &__all {
        overflow: auto;
    }

    &__feedbackSubmit {
        text-align: center;

        .el-button--default {
            background-color: #F2F6FC;
        }
    }

    .el-icon-s-custom:before {
        color: #fff;
        font-size: .23rem;
    }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .UserAside {
    background: rgb(255, 255, 255);
  }
}
</style>