<!--
 * @Author: 胡晨明
 * @Date: 2021-10-19 20:11:59
 * @LastEditTime: 2021-10-23 16:12:03
 * @LastEditors: Please set LastEditors
 * @Description: 用户自定义功能设置侧边栏界面组件
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\views\CustomSetting\CustomAside.vue
-->
<template>
    <div class="customAside">
        <div 
            v-for="tab in asideTabs" 
            :key="tab.tabName" 
            :class="['customAside__item', {'customAside__item--active': currentTab===tab.tabName}]"
            @click="() => handleTabClick(tab.tabName, tab.tabDom)"
        >
            <span class="iconfont customAside__icon" v-html="tab.tabIcon"></span>
            <span class="customAside__desc">{{tab.tabName}}</span>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref } from 'vue'

// 状态管理仓库
const store = useStore()

// 侧边栏选项卡数组
const asideTabs = [
    { tabName: '功能模块', tabIcon: '&#xe601;', tabDom: 'functionDom' },
    { tabName: '日期与时间', tabIcon: '&#xe614;', tabDom: 'dateDom' },
    { tabName: '提醒与通知', tabIcon: '&#xe641;', tabDom: 'notifyDom' },
    { tabName: '任务默认值', tabIcon: '&#xe62e;', tabDom: 'taskDom' }
]

// 当前选项卡
const currentTab = ref(asideTabs[0].tabName)

// 
const handleTabClick = (tabName, tabDom) => {
    currentTab.value = tabName
    store.commit('setTabDom', tabDom)
}
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.customAside {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 20%;
    font-size: .14rem;
    color: $base-fontColor;
    display: flex;
    flex-flow: column nowrap;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;

    &__item {
        height: .3rem;
        display: flex;
        align-items: center;
        padding: .1rem;
        cursor: pointer;
        transition: all .3s ease;

        &--active {
            background: rgba(255, 255, 255, .2);
        }
    }

    &__icon {
        font-size: .2rem;
        color: $icon-color;
    }

    &__desc {
        margin-left: .12rem;
    }
}

@media screen and (max-width: 800px) {
    /* 设置边栏响应式 */
    .customAside {
        width: 12%;

        &__item {
            justify-content: center;
        }

        &__desc {
            display: none;
        }
    }
}
</style>