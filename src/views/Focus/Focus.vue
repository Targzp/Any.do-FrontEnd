<!--
 * @Author: 胡晨明
 * @Date: 2022-02-09 09:26:28
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-15 13:37:11
 * @Description: 专注页面组件
-->
<template>
  <div :class="['Focus', isHide?'Focus--spread':'']">
    <!-- 专注顶部操作区域 -->
    <div class="Focus__header">
      <span
        class="Focus__header__shrink"
        @click="handleHideAside"
      >
        <i :class="['el-icon-s-fold', isHide?'el-icon-s-fold--hide':'']"></i>
      </span>
      <el-button
        plain
        round
        size="small"
        @click="handleViewFocusHistory"
      >专注历史</el-button>
      <el-button
        plain
        round
        size="small"
        v-if="!isFocus"
        @click="handleViewFocusStatistics"
      >统计</el-button>
      <!-- 专注历史模态框 -->
      <el-dialog
        v-model="focusHistoryTrigger"
        title="专注历史"
        :width="300"
        :append-to-body="true"
        :destroy-on-close="true"
      >
        <el-scrollbar
          max-height="280px"
          v-if="focusHistories.length > 0 && !loading"
        >
          <div>
            <el-timeline
              class="timeLine"
            >
              <el-timeline-item
                v-for="(focusHistory, index) in focusHistories"
                :key="index"
                :timestamp="dayjs((focusHistory.focusTime)).format('YYYY-MM-DD HH:mm')"
                placement="top"
                type="primary"
              >
                <p class="timeLine__info">专注标题: {{focusHistory.focusInfo}}</p>
                <p class="timeLine__total" v-if="focusHistory.focusDoneFlag">专注时长: {{focusHistory.focusTotalMinutes}}分钟</p>
                <p>完成情况: {{focusHistory.focusDoneFlag?'已完成':'未完成'}}</p>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-scrollbar>
        <el-empty
          v-if="focusHistories.length === 0 && !loading"
          description="暂无专注历史数据"
          class="empty"
        ></el-empty>
        <el-skeleton :loading="loading" :rows="3" animated />
      </el-dialog>
    </div>
    <div class="Focus__body">
      <!-- 专注信息输入区域 -->
      <div
        class="Focus__body__inputFocus"
        v-show="!isFocus"
      >
        <!-- 新任务输入框 -->
        <el-input
          v-model="focusData.focusInfo"
          placeholder="请输入专注标题"
        >
          <template #suffix>
            <div class="Focus__body__inputFocus__icon">
              <span
                class="iconfont focusSettingIcon"
                @click="handleSettingFocus"
              >&#xe671;</span>
            </div>
          </template>
        </el-input>
        <!-- 专注设置模态框 -->
        <el-dialog
          v-model="focusSettingTrigger"
          title="专注设置"
          :width="280"
          :append-to-body="true"
          :destroy-on-close="true"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <div
            class="Focus__body__inputFocus__focusSetting"
          >
            <div class="item1">
              <span>专注时长</span>
              <el-input v-model.number="focusSettingData.totalMinutes"/>
              <span>分钟</span>
            </div>
            <div class="item2">
              <span>休息间隔</span>
              <el-input v-model.number="focusSettingData.intervalMinutes"/>
              <span>分钟</span>
            </div>
            <div class="item3">
              <span>休息时长</span>
              <el-input v-model.number="focusSettingData.restMinutes"/>
              <span>分钟</span>
            </div>
            <div class="btns">
              <el-button
                type="info"
                plain
                @click="handleCancelFocusSetting"
              >取消</el-button>
              <el-button
                type="primary"
                plain
                @click="handleConfirmFocusSetting"
              >确认</el-button>
            </div>
          </div>
        </el-dialog>
        <el-button
          class="Focus__body__startBtn"
          @click="handleStartFocus"
        >开始专注</el-button>
      </div>
      <!-- 专注时间或标记显示区域 -->
      <div class="Focus__body__main">
        <div 
          class="Focus__body__main__flag"
          v-if="!isFocus && !focusStatistics"
        >
          <span class="iconfont icon">&#xe665;</span>
          <span class="tips">输入专注标题开始专注吧!</span>
        </div>
        <div
          v-if="isFocus && !focusStatistics"
          class="Focus__body__main__focusing"
        >
          <el-progress
            type="circle"
            :percentage="progressData"
            :width="250"
            :stroke-width="15"
            class="progress"
          >
            <template #default="{ percentage }">
              <span class="percentage-label">正在专注: {{focusData.focusInfo}}</span>
              <span class="percentage-value">{{ percentage }}%</span>
              <span class="percentage-clock">{{clockMinute}}:{{clockSecond}}</span>
            </template>
          </el-progress>
          <el-button
            plain
            class="cancelBtn"
            @click="handleCancelFocus"
          >取消专注</el-button>
          <section>
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
            <div class="wave wave4"></div>
          </section>
        </div>
        <!-- 专注统计数据可视化 -->
        <el-scrollbar
          v-if="!isFocus && focusStatistics"
          style="margin-top: 10px;"
        >
          <div
            class="Focus__body__main__statistics"
          >
            <!-- 专注时长统计 -->
            <div class="Focus__body__main__statistics__total">
              <div class="title">专注时长统计</div>
              <div class="totalContent">
                <div class="today">
                  <span>{{todayFocusData}}m</span>
                  <span>今日专注时长</span>
                </div>
                <div class="all">
                  <span>{{allFocusData}}m</span>
                  <span>总专注时长</span>
                </div>
              </div>
            </div>
            <!-- 专注时长趋势 -->
            <div class="Focus__body__main__statistics__trend">
              <div class="title trandTitle">
                专注时长趋势
                <el-select v-model="trendMode">
                  <el-option label="按日" value="day"></el-option>
                  <el-option label="按周" value="week"></el-option>
                  <el-option label="按月" value="month"></el-option>
                </el-select>
              </div>
              <div class="trendContent"></div>
            </div>
            <!-- 专注完成度 -->
            <div class="Focus__body__main__statistics__done">
              <div class="title">专注完成度</div>
              <div class="doneContent"></div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, nextTick, computed } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import _ from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../api/index'

const store = useStore()

const isHide = computed(() => {
  return store.state.aside.isHide
})

const handleHideAside = () => {
  store.commit('changeIsHide')
}

// 专注数据对象
const focusData = reactive({
  focusInfo: '',  // 专注标题
  focusTime: '',  // 专注开始时间
  focusTotalMinutes: '' // 专注有效时长
})

// 专注历史数据集合
const focusHistories = ref([])

// 显示专注统计数据标记
const focusStatistics = ref(false)

// 专注设置区域显示标记
const focusSettingTrigger = ref(false)

// 专注设置数据对象
const focusSettingData = reactive({
  totalMinutes: '',
  intervalMinutes: '',
  restMinutes: ''
})

//* 点击进入专注设置
const handleSettingFocus = () => {
  focusSettingTrigger.value = true
}

//* 点击取消专注设置
const handleCancelFocusSetting = () => {
  focusSettingTrigger.value = false
  focusSettingData.totalMinutes = ''
  focusSettingData.intervalMinutes = ''
  focusSettingData.restMinutes = ''
}

//* 点击确认专注设置
const handleConfirmFocusSetting = () => {
  if (focusSettingData.totalMinutes) {
    if (!(typeof focusSettingData.totalMinutes === 'number')) {
      ElMessage.warning('必须是数字!')
      return
    }

    if (focusSettingData.intervalMinutes && focusSettingData.intervalMinutes >= focusSettingData.totalMinutes) {
      ElMessage.warning('休息间隔必须小于专注时长!')
      return
    }

    if (focusSettingData.intervalMinutes && !focusSettingData.restMinutes) {
      ElMessage.warning('请输入休息时长!')
      return
    }

    if (!focusSettingData.intervalMinutes && focusSettingData.restMinutes) {
      ElMessage.warning('请输入休息间隔!')
      return
    }

    if (focusSettingData.intervalMinutes && !(typeof focusSettingData.intervalMinutes === 'number')) {
      ElMessage.warning('必须是数字!')
      return
    }

    if (focusSettingData.restMinutes && !(typeof focusSettingData.restMinutes === 'number')) {
      ElMessage.warning('必须是数字!')
      return
    }
  } else {
    ElMessage.warning('专注时长不允许为空!')
    return
  }
  focusSettingTrigger.value = false
}

//* 是否开始专注标记
const isFocus = ref(false)

//* 进度条数据
const progressData = ref(0)

//* 时钟数据
const clockMinute = ref('')
const clockSecond = ref('')

//* 点击开始专注逻辑
let cancelFlag = null
let restFlag = null
const handleStartFocus = () => {
  focusStatistics.value = false

  if (!focusData.focusInfo) {
    ElMessage.warning('请输入专注标题!')
    return
  }

  if (!focusSettingData.totalMinutes) {
    ElMessage.warning('请输入专注时长!')
    return
  }

  isFocus.value = true
  focusData.focusTime = new Date().valueOf()
  focusData.focusTotalMinutes = +(focusSettingData.totalMinutes)

  clockMinute.value = +(focusSettingData.totalMinutes) < 10?('0'+focusSettingData.totalMinutes):focusSettingData.totalMinutes
  clockSecond.value = '00'

  let totalMsecond = focusSettingData.totalMinutes * 60 * 1000  // 专注总微秒
  let intervalMsecond = focusSettingData.intervalMinutes * 60 * 1000  // 休息间隔微秒
  let restMsecond = focusSettingData.restMinutes * 60 * 1000  // 休息时长微秒

  let progressItem = _.round(totalMsecond / 5)
  let progressPiece = 0

  function handleFocusing () {
    cancelFlag = setInterval(async () => {
      // 时间显示逻辑
      clockSecond.value = (+(clockSecond.value) - 1) < 10 && clockSecond.value!=='00'?('0'+(+(clockSecond.value) - 1)):((+(clockSecond.value) - 1) + '')

      if (+(clockSecond.value) < 0) {
        clockSecond.value = '59'
        clockMinute.value = (+(clockMinute.value) - 1) + ''
        if (+(clockMinute.value) < 0) {
          clockMinute.value = '00'
          clockSecond.value = '00'
          ElMessage.success('专注结束啦~')
          isFocus.value = false
          progressData.value = 0
          clearInterval(cancelFlag)
          const copyFocusData = _.cloneDeep(focusData)
          copyFocusData.focusDoneFlag = true
          focusHistories.value.push(copyFocusData)
          await request.postUserFocus(copyFocusData)

          // 清空当前专注数据
          handleCancelFocusSetting()
          focusData.focusInfo = ''
        }
        clockMinute.value = +clockMinute.value < 10?('0'+(+clockMinute.value)):(+(clockMinute.value) + '')
      }

      // 进度显示逻辑
      progressPiece = progressPiece + 1000
      if ((progressPiece%intervalMsecond) === 0) {
        if (+(clockMinute.value) > 0) {
          clearInterval(cancelFlag)
          ElMessage.success('可以休息啦~')
          restFlag = setTimeout(() => {
            ElMessage.warning('休息结束啦~')
            handleFocusing ()
          }, restMsecond)
        }
      }
      const index = [1, 2, 3, 4, 5].indexOf(progressPiece/progressItem)
      if (index > -1) {
        const progressNum = [1, 2, 3, 4, 5][index]
        switch (progressNum) {
          case 1:
            progressData.value = 20
            break;
          case 2:
            progressData.value = 40
            break;
          case 3:
            progressData.value = 60
            break;
          case 4:
            progressData.value = 80
            break;
          case 5:
            progressData.value = 100
          default:
            break;
        }
      }
    }, 1000)
  }

  handleFocusing()
}

//* 点击取消专注逻辑
const handleCancelFocus = () => {
  ElMessageBox.confirm(
    '确认取消专注吗?',
    '确认框',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async () => {
    clearInterval(cancelFlag)
    clearTimeout(restFlag)
    isFocus.value = false
    clockMinute.value = ''
    clockSecond.value = ''
    progressData.value = 0
    ElMessage.success('取消成功')
    const copyFocusData = _.cloneDeep(focusData)
    copyFocusData.focusDoneFlag = false
    await request.postUserFocus(copyFocusData)
  })
  .catch(() => {})
}

// 专注历史模态框显示标记
const focusHistoryTrigger = ref(false)

// 获取专注历史数据 loading 效果
const loading = ref(false)

//* 点击查看专注历史逻辑
const handleViewFocusHistory = async () => {
  focusHistoryTrigger.value = true
  loading.value = true

  const res = await request.getUserFocus()

  if (res && res.length > 0) {
    focusHistories.value.splice(0, focusHistories.value.length)
    focusHistories.value.push(...res)
  }

  loading.value = false
}

// 专注时长趋势模式
const trendMode = ref('day')

// 今日专注时长
const todayFocusData = ref(0)

// 总专注时长
const allFocusData = ref(0)

// 图标对象
let trendChart = null
let doneChart = null

//* 点击查看专注统计
const handleViewFocusStatistics = () => {
  focusStatistics.value = true
}

//* 专注时长趋势模式更改，横轴数据跟着更改
watch(() => trendMode.value, async (val) => {
  // 获取专注趋势数据及 x 轴模板数据
  const { modeDataArr, modeDesc } = await request.getUserFocusStatistics({ trendMode: val})
  switch (val) {
    case 'day':
      trendChart.setOption({
        xAxis: {
          type: 'category',
          data: modeDesc
        },
        series: [
          {
            data: modeDataArr,
            type: 'bar'
          }
        ],
      })
      break
    case 'week':
      trendChart.setOption({
        xAxis: {
          type: 'category',
          data: modeDesc
        },
        series: [
          {
            data: modeDataArr,
            type: 'bar'
          }
        ],
      })
      break
    case 'month':
      trendChart.setOption({
        xAxis: {
          type: 'category',
          data: modeDesc
        },
        series: [
          {
            data: modeDataArr,
            type: 'bar'
          }
        ],
      })
      break
    default:
      break
  }
})

//* 建立专注时长趋势图表逻辑
const handleCreateTrendChart = (modeDataArr, modeDesc) => {
  trendChart = echarts.init(document.getElementsByClassName('trendContent')[0])
  
  // 绘制图表
  trendChart.setOption({
    xAxis: {
      type: 'category',
      data: modeDesc
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: modeDataArr,
        type: 'bar'
      }
    ],
    color: '#409EFF'
  })
  window.onresize = function () { // 自适应大小
    trendChart.resize()
  }
}

//* 建立专注完成度图表逻辑
const handleCreateDoneChart = (doneTotal, notDoneTotal) => {
  doneChart = echarts.init(document.getElementsByClassName('doneContent')[0])

  // 绘制图表
  doneChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '2%',
      left: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: doneTotal, name: '已完成专注数量' },
          { value: notDoneTotal, name: '未完成专注数量' },
        ]
      }
    ],
    color: ['#409EFF', '#67C23A']
  })
}

//* 根据监听专注统计数据显示标记为 true 来获取相应数据
watch(() => focusStatistics.value, async (val) => {
  if (val) {
    const res = await request.getUserFocusStatistics({ trendMode: trendMode.value })
    const { todayTotal, allTotal, doneTotal, notDoneTotal, modeDataArr, modeDesc } = res
    todayFocusData.value = todayTotal
    allFocusData.value = allTotal
    nextTick(() => {
      handleCreateTrendChart(modeDataArr, modeDesc)
      handleCreateDoneChart(doneTotal, notDoneTotal)
    })
  }
}, { immediate: true })
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
@import '../../assets/style/wave.css';
.Focus {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  font-size: .16rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: .1rem;
  transition: all .5s ease;

  &--spread {
    margin-left: -2.7rem;
  }

  &__header {
    display: flex;
    justify-content: center;
    padding: .1rem .1rem .1rem 0;
    position: relative;
    z-index: 10;

    &__shrink {
      position: absolute;
      left: .1rem;
      font-size: .23rem;
      cursor: pointer;
      color: $icon-color;

      .el-icon-s-fold {
        transition: .3s ease;

        &--hide {
          transform: rotateZ(180deg);
        }
      }
    }

    .timeLine {
      padding: 0 0 0 .1rem;
    }

    .el-empty {
      align-items: flex-start;
    }
  }

  &__body {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    max-height: 82%;

    &__inputFocus {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: .1rem .15rem 0 .15rem;
      position: relative;
      z-index: 10;

      &__icon {
        .focusSettingIcon {
          font-size: .18rem;
          margin-right: .05rem;
        }
      }

      &__focusSetting {
        background-color: #fff;
        border-radius: .05rem;
        padding: .08rem;
        font-size: .15rem;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        color: $base-fontColor;

        .item1 {
          margin-bottom: .08rem;
        }

        .item3 {
          margin-top: .08rem;
        }

        .btns {
          margin-top: .2rem;
        }

        .el-input {
          border: 1px solid #ccc;
          border-radius: .05rem;
          width: .8rem !important;
          height: .28rem;
          line-height: .28rem;
          margin: 0 .15rem;
        }

        .el-input__inner {
          background-color: rgba(253, 253, 253, 0.315) !important;
          padding: .05rem;
          height: .23rem;
          line-height: .23rem;
        }
      }
    }

    .el-input {
      width: 4rem;
    }

    .el-input__inner {
      background-color: rgba(253, 253, 253, 0.315);
    }

    .el-input__inner::placeholder {
      color: $placeholder-color;
    }

    &__startBtn {
      margin-left: .1rem;
      position: relative;
      top: .01rem;
      border-radius: 0rem;
      background-color: rgba(255, 255, 255, 0.178);
    }

    &__startBtn:hover {
      background-color: rgba(255, 255, 255, 0.473);
    }

    &__startBtn:focus {
      background-color: rgba(255, 255, 255, 0.473);
    }

    &__main {
      flex: 1;
      position: relative;
      z-index: 10;
      height: 100%;

      &__flag {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        margin-top: 1.3rem;

        .icon {
          color: rgba(241, 241, 241, 0.877);
          font-size: 1.4rem;
        }

        .tips {
          margin-top: .15rem;
          font-size: .14rem;
          color: $base-fontColor;
        }
      }

      &__focusing {
        position: relative;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        .progress {
          margin-top: .9rem;

          .percentage-value {
            display: block;
            margin-top: .15rem;
            margin-bottom: .05rem;
          }

          .percentage-label {
            display: block;
            font-size: .15rem;
          }
          
          .percentage-clock {
            font-size: .2rem;
          }
        }

        .cancelBtn {
          margin-top: .3rem;
          position: relative;
          z-index: 12;
        }
      }

      &__statistics {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-around;
        margin: .3rem .23rem 0 .23rem;

        &__total, &__trend, &__done {
          height: 3rem;
          width: 5rem;
          background-color: rgba(255, 255, 255, 0.2);
        }

        &__total {
          margin-bottom: .2rem;
          display: flex;
          flex-flow: column nowrap;

          .totalContent {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-evenly;

            .today, .all {
              display: flex;
              flex-flow: column nowrap;
              align-items: center;

              span:first-child {
                font-weight: bold;
                font-size: .3rem;
                color: $base-fontColor;
              }

              span:last-child {
                font-size: .13rem;
                color: $lighter-fontColor;
              }
            }
            
          }
        }

        &__trend {
          margin-bottom: .2rem;
          display: flex;
          flex-flow: column nowrap;

          .trandTitle {
            display: flex;
            align-items: center;

            .el-select {
              width: .78rem;
              margin-top: .03rem;
              margin-left: .1rem;

              .el-input {
                width: .78rem;
                height: .3rem;
                line-height: .3rem;

                .el-input__inner {
                  height: .3rem;
                  line-height: .3rem;
                }

                .el-input__icon {
                  line-height: .3rem;
                }
              }
            }
          }

          .trendContent {
            flex: 1;
            display: flex;
            align-items: center;
          }
        }

        &__done {
          display: flex;
          flex-flow: column nowrap;

          .doneContent {
            flex: 1;
            display: flex;
            align-items: center;

            > div:first-child {
              width: 0rem !important;
            }
          }
        }

        .title {
          font-weight: bold;
          color: $base-fontColor;
          margin: .05rem 0 0 .08rem
        }
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .Focus {
    &--spread {
      margin-left: 0;
      border-radius: 0;
    }
  }
}
</style>