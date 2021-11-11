<!--
 * @Author: your name
 * @Date: 2021-09-15 23:08:44
 * @LastEditTime: 2021-10-19 21:06:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\App.vue
-->
<template>
    <router-view v-slot="{ Component }">
        <transition name="main" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>

<style lang="scss">
.main-enter-active {
  transition: all .4s cubic-bezier(0.46,0.03,0.52,0.96);;
}

.main-leave-active {
  transition: all .6s cubic-bezier(0.46,0.03,0.52,0.96);;
}

.main-enter-from,
.main-leave-to {
  transform: scale(1.01);
  opacity: 0;
}
</style>
