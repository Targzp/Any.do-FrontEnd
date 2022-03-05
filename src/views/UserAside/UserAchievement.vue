<!--
 * @Author: 胡晨明
 * @Date: 2022-02-16 17:19:14
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-04 10:42:42
 * @Description: 用户成就模态框组件
-->
<template>
  <div class="Achievement">
    <div class="Achievement__statistics">
      <div class="Achievement__statistics__total">
        <div class="item tasks">
          <span>{{TDLTotal.tasksTotal}}</span>
          <span>任务</span>
        </div>
        <div class="item doneTasks">
          <span>{{TDLTotal.doneTasksTotal}}</span>
          <span>已完成</span>
        </div>
        <div class="item lists">
          <span>{{TDLTotal.listsTotal}}</span>
          <span>清单</span>
        </div>
        <div class="item useDays">
          <span>{{userUseDays}}</span>
          <span>使用天数</span>
        </div>
      </div>
    </div>
    <div class="Achievement__achieveChart">
      <div class="title">
        <span>我的成就值</span>
        <span>
          {{scores}}
          <img src="../../assets/images/成就.png" alt="成就" class="img">
        </span>
      </div>
      <div class="chart"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import _ from 'lodash'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import request from '../../api/index'

const props = defineProps({
  scores: {
    type: Number
  },
  scoreByDay: {
    type: Array
  }
})

// 用户使用天数
const userUseDays = ref(0)

// 用户任务、已完成任务、清单数量
const TDLTotal = reactive({
  tasksTotal: 0,
  doneTasksTotal: 0,
  listsTotal: 0
})

;(async () => {
  const UseRes = await request.getUserUseDays()  // 获取用户使用天数
  const TDLRes = await request.getUserTDLtotal()  // 获取用户任务和已完成任务以及清单数量

  if (!_.isEmpty(UseRes)) {
    userUseDays.value = UseRes.useDays
  }

  if (!_.isEmpty(TDLRes)) {
    const { tasksTotal, doneTasksTotal, listsTotal } = TDLRes

    TDLTotal.tasksTotal = tasksTotal
    TDLTotal.doneTasksTotal = doneTasksTotal
    TDLTotal.listsTotal = listsTotal
  }
})()

onMounted(() => {
  nextTick(() => {
    const achieveChart = echarts.init(document.getElementsByClassName('chart')[0])

    // 绘制图表
    achieveChart.setOption({
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [
          dayjs().subtract(4, 'day').format('M月D日'),
          dayjs().subtract(3, 'day').format('M月D日'),
          dayjs().subtract(2, 'day').format('M月D日'),
          dayjs().subtract(1, 'day').format('M月D日'),
          dayjs().format('M月D日')
        ]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: props.scoreByDay,
          type: 'line',
          areaStyle: {},
          emphasis: {
            label: {
              show: true
            }
          },
          label: {
            axisName: {
              position: 'top',
              fontSize: 13
            }
          }
        }
      ],
      color: '#409EFF'
    })

    window.onresize = function () { // 自适应大小
      achieveChart.resize()
    }
  })
})
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Achievement {
  display: flex;
  flex-flow: column nowrap;
  height: 4rem;
  width: 100%;

  &__statistics {
    height: .5rem;
    border-radius: .05rem;
    box-shadow: 0 0 .02rem .01rem rgb(236, 236, 236);

    &__total {
      height: 100%;
      margin-left: .1rem;
      display: flex;
      align-items: center;
      color: $base-fontColor;

      .item {
        margin-right: .12rem;

        span:first-child {
          font-weight: bold;
          margin-right: .05rem;
        }

        span:last-child {
          font-size: .15rem;
        }
      }
    }
  }

  &__achieveChart {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    flex: 1;
    margin: .15rem 0rem .1rem 0rem;
    border-radius: .05rem;
    box-shadow: 0 0 .02rem .01rem rgb(236, 236, 236);
    box-sizing: border-box;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .16rem;
      font-weight: bold;
      padding: .1rem .1rem 0 .1rem;
      box-sizing: border-box;

      span:last-child {
        display: flex;
        align-items: center;
      }

      .img {
        width: .3rem;
        padding-left: .05rem;
      }
    }

    .chart {
      box-sizing: border-box;
      width: 100%;
      flex: 1;
      margin-top: -.06rem;
      padding-left: .1rem;
    }
  }
}
</style>
