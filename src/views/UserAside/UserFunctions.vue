<!--
 * @Author: 胡晨明
 * @Date: 2021-10-28 16:20:02
 * @LastEditTime: 2021-10-28 21:29:37
 * @LastEditors: Please set LastEditors
 * @Description: 用户边栏功能区界面组件
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\views\UserAside\userFunction.vue
-->
<template>
    <div class="UserFunction">
        <div class="UserFunction__calender" v-if="userFunctions.calender">
            <span class="iconfont">&#xe61c;</span>
            <span>日历</span>
        </div>
        <div class="UserFunction__habit" v-if="userFunctions.habit">
            <span class="iconfont">&#xe62b;</span>
            <span>打卡</span>
        </div>
        <div class="UserFunction__focus" v-if="userFunctions.focus">
            <span class="iconfont">&#xe638;</span>
            <span>专注</span>
        </div>
        <div class="UserFunction__chat">
            <span class="iconfont">&#xe603;</span>
            <span>群聊</span>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import request from '../../api/index'

// 用户功能开启列表
const userFunctions = reactive({})

// 获取用户功能开启列表
;(async () => {
    try {
        let res = await request.getUserFunctions()
        Object.assign(userFunctions, res.functions)
    } catch (error) {
        console.log(`${error}`)
    }
})()
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.UserFunction {
    @include listPieceStyle;
    display: flex;
    flex-flow: column wrap;
    border-bottom: none;

    &__calender, &__habit, &__focus, &__chat {
        padding: .1rem;
        cursor: pointer;
    }

    span[class*="iconfont"] {
        display: inline-block;
        vertical-align: middle;
        margin-right: .15rem;
    }

    &__calender > span:nth-child(1){
        font-size: .18rem;
    }

    &__habit > span:nth-child(1){
        font-size: .22rem;
        position: relative;
        margin-right: .12rem;
        right: .02rem;
    }

    &__focus > span:nth-child(1){
        font-size: .22rem;
        margin-right: .12rem;
        position: relative;
        right: .02rem;
    }

    &__chat > span:nth-child(1){
        font-size: .2rem;
    }

    span[class*="iconfont"] + span {
        color: $base-fontColor;
        vertical-align: middle;
    }
}
</style>