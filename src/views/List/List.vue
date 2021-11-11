<!--
 * @Author: your name
 * @Date: 2021-10-12 16:06:02
 * @LastEditTime: 2021-10-15 10:04:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\List\List.vue
-->
<template>
    <div class="List">
        <router-view></router-view>
    </div>
</template>

<script setup>
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
@import "../../assets/style/mixins.scss";
.List {
    height: 100%;
    font-size: .16rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: .02rem;
}
</style>