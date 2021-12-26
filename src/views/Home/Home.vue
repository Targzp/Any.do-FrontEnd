<!--
 * @Author: 胡晨明
 * @Date: 2021-09-16 16:31:52
 * @LastEditTime: 2021-12-19 20:46:19
 * @LastEditors: Please set LastEditors
 * @Description: 应用界面框架
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Home.vue
-->
<template>
  <div class="Home">
    <div class="Home__container">
      <div class="Home__container__userAside">
        <UserAsideVue />
      </div>
      <div class="Home__container__main">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserAsideVue from '../UserAside/UserAside.vue';
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.Home {
  width: 100%;
  height: 100vh;

  &__container {
    width: 80%;
    height: 85%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;

    &__userAside {
      width: 2.5rem;
      height: 100%;
      flex: 0 0 auto;
    }

    &__main {
      height: 100%;
      min-width: 6rem;
      margin-left: .2rem;
      flex: 1 1 auto;
    }
  }
}
</style>