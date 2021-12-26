<!--
 * @Author: 胡晨明
 * @Date: 2021-12-12 15:40:48
 * @LastEditTime: 2021-12-15 23:00:58
 * @LastEditors: Please set LastEditors
 * @Description: 用户任务回收区域（已完成任务和删除任务）
 * @FilePath: \Anydo-app\src\views\UserAside\UserListRecovery.vue
-->
<template>
  <div class="taskRecovery">
    <div
      class="taskRecovery__complete"
      @click="() => { handleListClick(2) }"
    >
      <span class="iconfont">&#xe67c;</span>
      <span>已完成</span>
    </div>
    <div
      class="taskRecovery__bin"
      @click="() => { handleListClick(3) }"
    >
      <span class="iconfont">&#xe7be;</span>
      <span>垃圾桶</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 点击查看已完成/垃圾桶清单任务集合
const handleListClick = (id) => {
  router.push({ path: `/list/${id}/tasks` })
}
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.taskRecovery {
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
</style>