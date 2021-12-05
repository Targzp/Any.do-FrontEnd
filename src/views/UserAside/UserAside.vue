<!--
 * @Author: 胡晨明
 * @Date: 2021-10-09 16:57:58
 * @LastEditTime: 2021-10-30 15:49:56
 * @LastEditors: Please set LastEditors
 * @Description: 用户账户及功能侧边栏区域
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Home\UserAside.vue
-->
<template>
    <div class="UserAside">
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
                <div class="UserAside__listRecovery">
                    <div class="UserAside__listRecovery__complete">
                        <span class="iconfont">&#xe67c;</span>
                        <span>已完成</span>
                    </div>
                    <div class="UserAside__listRecovery__bin">
                        <span class="iconfont">&#xe7be;</span>
                        <span>垃圾桶</span>
                    </div>
                </div>
                <!-- 功能区域 -->
                <UserFunction />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import UserAddition from './UserAddition.vue'
import UserLists from './UserLists.vue'
import UserFunction from './UserFunctions.vue'
import UserFastList from './UserFastList.vue'
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.UserAside {
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

    &__all {
        overflow: auto;
    }

    &__listRecovery {
        @include listPieceStyle;

        &__complete, &__bin {
            padding: .1rem;
            cursor: pointer;
        }

        &__complete > span:nth-child(1){
            display: inline-block;
            vertical-align: middle;
            font-size: .17rem;
            margin-right: .15rem;
        }

        &__bin > span:nth-child(1){
            display: inline-block;
            vertical-align: middle;
            position: relative;
            right: .02rem;
            font-size: .21rem;
            margin-right: .12rem;
        }

        span[class*="iconfont"] + span {
            color: $base-fontColor;
            vertical-align: middle;
        }
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
</style>