<!--
 * @Author: 胡晨明
 * @Date: 2021-09-16 16:31:52
 * @LastEditTime: 2022-03-09 10:00:44
 * @LastEditors: 胡晨明
 * @Description: 应用界面框架
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Home.vue
-->
<template>
  <div class="Home">
    <div class="Home__container">
      <div :class="['Home__container__userAside', !isHide?'Home__container__userAside--show':'']">
        <UserAsideVue />
      </div>
      <div :class="['Home__container__main']">
        <router-view></router-view>
      </div>
      <!-- 用户栏 model 点击区域 -->
      <div
        class="HomeModel"
        v-if="!isHide && isModel1"
        @click="handleHideAside1"
      ></div>
      <!-- 任务信息显示 model 点击区域 -->
      <div
        :class="['HomeModel']"
        v-if="!isHide2 && isModel2"
        @click="handleHideAside2"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import UserAsideVue from '../UserAside/UserAside.vue'

const store = useStore()

const count = ref(0)

const isHide = computed(() => {
  return store.state.aside.isHide
})

const isHide2 = computed(() => {
  return store.state.aside.isHide2
})

const isModel1 = computed(() => {
  return !store.state.aside.isHide && count.value === 1
})

const isModel2 = computed(() => {
  return !store.state.aside.isHide2 && count.value === 1
})

const handleHideAside1 = () => {
  store.commit('changeIsHide')
}

const handleHideAside2 = () => {
  store.commit('changeIsHide2')
}

window.addEventListener('resize', (e) => {
  if (document.documentElement.clientWidth < 1100 && count.value === 0) {
    store.commit('changeIsHide', true)
    store.commit('changeIsHide2', true)
    store.commit('changeIsLess', true)
    count.value++
  } else if (document.documentElement.clientWidth > 1100 && count.value === 1) {
    store.commit('changeIsHide', false)
    store.commit('changeIsHide2', false)
    store.commit('changeIsLess', false)
    count.value--
  }
})

;(() => {
  if (document.documentElement.clientWidth < 1100 && count.value === 0) {
    store.commit('changeIsHide', true)
    store.commit('changeIsHide2', true)
    count.value++
  }
})()
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.Home {
  width: 100%;
  height: 100vh;

  &__container {
    width: 80%;
    height: 6.8rem;
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
      width: 100%;
      margin-left: .2rem;
      flex: 1 1 auto;
    }

    .HomeModel {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .Home__container {
    width: 100%;
    height: 100%;
  }

  .Home__container__userAside {
    position: absolute;
    z-index: 9;

    &--show {
      z-index: 11;
    }
  }

  .Home__container__main {
    margin-left: 0;
  }
}
</style>