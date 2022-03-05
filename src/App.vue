<!--
 * @Author: your name
 * @Date: 2021-09-15 23:08:44
 * @LastEditTime: 2022-03-02 14:13:58
 * @LastEditors: 胡晨明
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

<script setup>
import tasksNotify from '@/utils/tasksNotify'
import request from '@/api/index'
import storage from '@/utils/storage'

onMounted(async () => {
  tasksNotify() // 任务定时提醒设定

  const res = storage.getItem('userInfo')
  if (res) {
    await request.countUserUseDays()
  }
})
</script>

<style lang="scss">
.main-enter-active {
  transition: all .4s cubic-bezier(0.46,0.03,0.52,0.96);
}

.main-leave-active {
  transition: all .6s cubic-bezier(0.46,0.03,0.52,0.96);
}

.main-enter-from,
.main-leave-to {
  transform: scale(1.01);
  opacity: 0;
}
</style>
