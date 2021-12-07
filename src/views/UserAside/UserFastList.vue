<!--
 * @Author: 胡晨明
 * @Date: 2021-12-04 23:08:34
 * @LastEditTime: 2021-12-07 17:08:13
 * @LastEditors: Please set LastEditors
 * @Description: 用户快速查看清单任务区域组件（所有/今天）
 * @FilePath: \Anydo-app\src\views\UserAside\UserFastList.vue
-->
<template>
  <div class="FastList">
    <div
      class="FastList__all"
      @click="() => { handleListClick(0) }"
    >
      <span class="iconfont">&#xe835;</span>
      <span>所有</span>
    </div>
    <div
      class="FastList__today"
      @click="() => { handleListClick(1) }"
    >
      <span class="iconfont">&#xe654;</span>
      <span>今天</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 点击查看所有/今天清单任务集合
const handleListClick = (id) => {
  router.push({ path: `/list/${id}/tasks` })
}
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.FastList {
  @include listPieceStyle;

  &__all, &__today {
    padding: .1rem;
    cursor: pointer;
  }

  span[class*="iconfont"] {
    display: inline-block;
    vertical-align: middle;
    font-size: .2rem;
    margin-right: .15rem;
  }

  span[class*="iconfont"] + span {
    color: $base-fontColor;
    vertical-align: middle;
  }
}
</style>