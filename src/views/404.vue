<!--
 * @Author: 胡晨明
 * @Date: 2021-09-15 23:47:39
 * @LastEditTime: 2022-03-15 13:45:59
 * @LastEditors: 胡晨明
 * @Description: 404界面组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\404.vue
-->
<template>
  <n-result
    class="exception"
    status="404"
    title="404 资源不存在"
    description="生活总归带点荒谬"
  >
    <template #footer>
      <n-button type="info" ghost @click="handleGoHome">找点乐子吧</n-button>
    </template>
  </n-result>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { NResult, NButton } from "naive-ui"
const router = useRouter()
// 返回
const handleGoHome = () =>  {
  router.push('/')
}
</script>

<style lang="scss">
.exception {
  width: 100%;
  height: 100vh;
  padding-top: 2rem;
  background-color: #fff;
}
</style>