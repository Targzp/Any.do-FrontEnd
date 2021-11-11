<!--
 * @Author: 胡晨明
 * @Date: 2021-09-16 16:13:42
 * @LastEditTime: 2021-10-18 15:41:33
 * @LastEditors: Please set LastEditors
 * @Description: 登录与注册页面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Login.vue
-->
<template>
    <div class="login">
        <div class="container">
            <!-- 登录&注册窗口 -->
            <transition name="model" mode="out-in">
                <login-box v-if="modelChange" v-model:mode="modelChange"></login-box>
                <register-box v-else v-model:mode="modelChange"></register-box>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginBox from './LoginBox.vue'
import RegisterBox from './RegisterBox.vue'

// 登录注册切换变量参数
const modelChange = ref(true)
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@media screen and (max-width: 500px) {
    .loginBox {
        width: 3rem;
    }
    .registerBox {
        width: 3rem;
    }
}

.model-enter-active,
.model-leave-active {
    transition: all 0.4s ease;
}

.model-enter-from,
.model-leave-to {
    transform: translateX(.2rem);
    opacity: 0;
}

.login{
    width: 100%;
    height: 100vh;
    .container {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
}
</style>