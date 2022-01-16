<!--
 * @Author: 胡晨明
 * @Date: 2021-12-20 14:08:40
 * @LastEditors: 胡晨明
 * @LastEditTime: 2021-12-28 19:31:11
 * @Description: 任务优先级设定模态框组件
-->
<template>
  <div class="TaskPriority">
    <span class="TaskPriority__title">优先级</span>
    <div class="TaskPriority__icons">
      <span
        v-for="(taskPriority, index) in taskPrioritys"
        :key="taskPriority.iconFlag"
        :class="[
          'iconfont',
          `TaskPriority__${taskPriority.classFlag}`,
          { 'selectedPriority':  selectedPriority === taskPriority.dataFlag }
        ]"
        :title="taskPriority.title"
        v-html="taskPriority.iconFlag"
        @click="() => handleSelectPriority(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
// 父子数据通信
const props = defineProps({
  taskPriority: {
    type: String
  },
  offset: {
    type: Number
  }
})
const emit = defineEmits(['saveTaskPriority'])

//! 新增任务优先级相关逻辑区域
/* ---------------------------- */
// 新增任务优先级标记集合
const taskPrioritys = ref([
  { classFlag: 'icon1', title: '低', iconFlag: '&#xe673;', dataFlag: 'low' },
  { classFlag: 'icon2', title: '中', iconFlag: '&#xe674;', dataFlag: 'mid' },
  { classFlag: 'icon3', title: '高', iconFlag: '&#xe675;', dataFlag: 'high' }
])

// 当前选中的优先级
const selectedPriority = ref('')
watch(() => props.taskPriority, () => {
  selectedPriority.value = props.taskPriority
}, { immediate: true })

// 模态框偏移量
const offset = computed(() => {
  return `${props.offset}rem`
})

// 选中指定任务优先级处理逻辑
const handleSelectPriority = (index) => {
  emit('saveTaskPriority', taskPrioritys.value[index].dataFlag)
}
/* ---------------------------- */
</script>

<style lang="scss" scoped>
@import '../../assets/style/variables.scss';
.TaskPriority {
  padding: .08rem .1rem;
  box-sizing: border-box;
  position: absolute;
  top: .36rem;
  right: v-bind(offset);
  z-index: 1;
  background-color: $base-bgColor;
  border-radius: .05rem;
  box-shadow: 0 0 .15rem .02rem rgba(196, 196, 196, 0.39);

  &__title {
    display: inline-block;
    color: $lighter-fontColor;
    font-size: .13rem;
    margin-bottom: .05rem;
  }

  .selectedPriority {
    border-radius: .12rem;
    background-color: $background-light;
    background-origin: padding-box;
  }

  &__icons {
    font-size: .24rem;
    display: flex;
    justify-content: center;
  }

  &__icon1, &__icon2, &__icon3 {
    padding: .02rem;
  }

  &__icon1 {
    color: #0888ff;
    margin-right: .12rem;
  }

  &__icon2 {
    color: #ffbb44;
    margin-right: .12rem;
  }

  &__icon3 {
    color: #f25555;
  }
}
</style>
