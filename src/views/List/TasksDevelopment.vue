<!--
 * @Author: 胡晨明
 * @Date: 2022-01-16 22:09:42
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-03 00:29:42
 * @Description: 任务动态界面组件
-->
<template>
  <div class="TasksDevelopment">
    <div
      v-if="taskDevelopments && taskDevelopments.length !== 0" 
    >
      <el-scrollbar
        height="280px"
      >
        <div>
          <el-timeline
            class="timeLine"
          >
            <el-timeline-item
              v-for="(taskDevelopment, index) in taskDevelopments"
              :key="index"
              :timestamp="dayjs((+taskDevelopment.optTime)).format('YYYY-MM-DD HH:mm')"
              placement="top"
              center
              type="primary"
            >
              <p class="timeLine__flag">{{optDesc[taskDevelopment.optFlag]}}</p>
              <p class="timeLine__name">操作人: {{taskDevelopment.optName}}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-scrollbar>
    </div>
    <div
      class="TasksDevelopment__tips"
      v-else
    >
      <span class="TasksDevelopment__tips__content">
        <el-empty
          :image-size="100"
          description="暂无任务操作动态"
        ></el-empty>
      </span>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

// 父子数据通信
defineProps({
  taskDevelopments: {
    type: Array,
    default: () => []
  }
})

// 任务操作动态说明集合
const optDesc = {
  TITLE: '修改了任务标题',
  DESC: '修改了任务描述',
  PRIO: '修改了任务优先级',
  DT: '修改了任务日期/时间',
  LIST: '修改了任务所属清单',
  DONE: '标记了任务为已完成状态',
  AFILE: '增加了任务附件',
  DFILE: '删除了任务附件'
}
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.TasksDevelopment {
  padding: .05rem 0 .1rem 0;

  .timeLine {
    padding: 0 0 0 .1rem;

    p {
      margin: 0;
    }

    &__flag {
      font-size: .14rem;
    }

    &__name {
      padding-top: .05rem;
      font-size: .13rem;
      color: $lighter-fontColor;
    }
  }

  &__tips {
    margin-top: -.15rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.5rem;
    padding-bottom: .1rem;
    color: $lighter-fontColor;
  }
}
</style>