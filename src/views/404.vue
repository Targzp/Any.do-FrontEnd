<!--
 * @Author: 胡晨明
 * @Date: 2021-09-15 23:47:39
 * @LastEditTime: 2021-09-21 16:37:46
 * @LastEditors: Please set LastEditors
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
import { NResult, NButton } from "naive-ui";
const router = useRouter()
// 返回
const handleGoHome = () =>  {
    router.go(-2);
}
</script>

<style lang="scss">
.exception {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>