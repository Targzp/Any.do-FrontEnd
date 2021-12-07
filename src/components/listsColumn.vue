<!--
 * @Author: your name
 * @Date: 2021-10-12 21:12:02
 * @LastEditTime: 2021-12-05 20:28:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\Home\listsColumn.vue
-->
<template>
    <div class="lists">
        <div
          :class="['listsColumn', { 'listsColumn--back': background }]"
          @click="$emit('update:showList', !showList)"
        >
            <div class="listsColumn__left">
                <span :class="['iconfont', 'listsColumn__left__show',{'listsColumn__left__show--bottom': showList}]">&#xe6ae;</span>
                <span class="listsColumn__left__tip">{{title}}</span>
            </div>
            <slot name="addition"></slot>
        </div>
        <slot name="content"></slot>
    </div>
</template>

<script setup>
// 父子数据通信
defineProps({
  showList: {
    type: Boolean,
    default: false
  },
  title: {
    type: String
  },
  background: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:showList'])
</script>

<style lang="scss">
@import "../assets/style/variables.scss";
.listsColumn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .03rem .1rem;
  color: $base-fontColor;
  cursor: pointer;

  &__left {
    display: flex;
    align-items: center;

    &__show {
      display: inline-block;
      position: relative;
      left: -.04rem;
      transition: all .3s ease;
    }

    &__show--bottom {
      transform: rotate(90deg);
    }

    &__tip {
      font-size: .14rem;
    }
  }

  &--back {
    border-radius: .02rem;
    background: rgba(255, 255, 255, 0.2);
    margin-bottom: .08rem;
  }
}
</style>