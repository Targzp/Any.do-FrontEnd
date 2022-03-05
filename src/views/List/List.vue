<!--
 * @Author: your name
 * @Date: 2021-10-12 16:06:02
 * @LastEditTime: 2022-02-08 15:19:50
 * @LastEditors: 胡晨明
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\List\List.vue
-->
<template>
    <div :class="['List', isHide?'List--spread':'']">
      <router-view></router-view>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isHide = computed(() => {
  return store.state.aside.isHide
})
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.List {
  height: 100%;
  font-size: .16rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: .02rem;
  transition: all .5s ease;

  &--spread {
    margin-left: -2.7rem;
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .List {
    &--spread {
      margin-left: 0;
    }
  }
}
</style>