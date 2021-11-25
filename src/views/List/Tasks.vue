<!--
 * @Author: 胡晨明
 * @Date: 2021-10-12 16:12:01
 * @LastEditTime: 2021-11-25 17:39:12
 * @LastEditors: Please set LastEditors
 * @Description: 清单任务组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\List\Tasks.vue
-->
<template>
  <div class="Tasks">
    <div class="Tasks__list">
      <!-- 清单任务头部区域 -->
      <div class="Tasks__list__header">
        <div>
          <span class="Tasks__list__header__shrink"><i class="el-icon-s-fold"></i></span>
          <span class="Tasks__list__header__title">📦 购物清单</span>
        </div>
        <span class="iconfont Tasks__list__header__other">&#xe618;</span>
      </div>
      <!-- 任务增加区域 -->
      <div class="Tasks__list__addTask">
        <!-- 新任务输入框 -->
        <el-input
          v-model="newTask.taskName"
          class="Tasks__list__addTask__inputTask"
          placeholder='添加任`务至 "📦 购物清单"'
        >
          <template #suffix>
            <div class="Tasks__list__addTask__taskIcons">
              <span
                class="iconfont Tasks__list__addTask__taskSettingIcon"
                @click="handleShowTaskSetting"
              >&#xe61c;</span>
              <span
                class="iconfont Tasks__list__addTask__taskPriorityIcon"
                @click="handleShowTaskPriority"
              >&#xe61d;</span>
            </div>
          </template>
        </el-input>
        <!-- 新增任务通用设置模态框 -->
        <div
          v-show="showTaskSetting"
          class="Tasks__list__addTask__taskSetting"
        >
          <div class="Tasks__list__addTask__timeModeSelect">
            <div 
              :class="['Tasks__list__addTask__timeModeSelect__dateMode', { 'Tasks__list__addTask__timeModeSelect__modeSelected': !showTaskQuantum }]"
              @click="handleShowTaskDate"
            >日期</div>
            <div
              :class="['Tasks__list__addTask__timeModeSelect__dateMode', { 'Tasks__list__addTask__timeModeSelect__modeSelected': showTaskQuantum }]"
              @click="handleShowTaskQuantum"
            >时间段</div>
          </div>
          <!-- 日期/时间段模式切换 -->
          <div
            v-if="!showTaskQuantum"
          >
            <v-date-picker
              v-model="newTask.taskDate"
              trim-weeks
              class="Tasks__list__addTask__taskCalendar"
              :attributes="calendarAttributes"
              :first-day-of-week="+(_.get(timeAndDateData, 'firstDayOfWeek', 1))"
            />
            <div class="Tasks__list__addTask__taskTime">
              <el-time-picker
                v-model="newTask.taskTime"
                placeholder="时间"
                :class="['Tasks__list__addTask__timeSetting']"
                :format="_.get(timeAndDateData, 'timeFormat', '24')==='24'?'HH:mm:ss':'hh:mm:ss A'"
              >
              </el-time-picker>
            </div>
          </div>
          <div v-else>
            <div class="Tasks__list__addTask__taskQuantum">
              <span class="Tasks__list__addTask__taskQuantum__title">开始</span>
              <el-date-picker
                v-model="newTask.startTaskDate"
                type="date"
                placeholder="开始日期"
                class="Tasks__list__addTask__taskQuantum__dateSetting"
                @change="handleSelectStartDate"
              ></el-date-picker>
              <el-time-picker
                v-model="newTask.startTaskTime"
                placeholder="开始时间"
                class="Tasks__list__addTask__taskQuantum__timeSetting"
                :format="_.get(timeAndDateData, 'timeFormat', '24')==='24'?'HH:mm':'hh:mm A'"
                @change="handleSelectQuantumTime"
              ></el-time-picker>
            </div>
            <div class="Tasks__list__addTask__taskQuantum">
              <span class="Tasks__list__addTask__taskQuantum__title">结束</span>
              <el-date-picker
                v-model="newTask.endTaskDate"
                type="date"
                placeholder="结束日期"
                class="Tasks__list__addTask__taskQuantum__dateSetting"
                :disabledDate="handleDisableDate"
              ></el-date-picker>
              <el-time-picker
                v-model="newTask.endTaskTime"
                placeholder="结束时间"
                class="Tasks__list__addTask__taskQuantum__timeSetting"
                :format="_.get(timeAndDateData, 'timeFormat', '24')==='24'?'HH:mm':'hh:mm A'"
                @change="handleSelectQuantumTime"
              ></el-time-picker>
            </div>
          </div>
          <div class="Tasks__list__addTask__taskNotify">
            <el-select
              v-model="newTask.notify"
              placeholder="提醒"
              :clearable="true"
            >
                <el-option value="0" label="准时"></el-option>
                <el-option value="5" label="提前5分钟"></el-option>
                <el-option value="30" label="提前30分钟"></el-option>
                <el-option value="60" label="提前1小时"></el-option>
                <el-option value="1440" label="提前1天"></el-option>
            </el-select>
          </div>
          <div class="Tasks__list__addTask__button">
            <el-button
              type="info"
              plain
              class="Tasks__list__addTask__clear"
              @click="handleCleanTaskSetting"
            >清除</el-button>
            <el-button
              type="primary"
              class="Tasks__list__addTask__confirm"
              @click="() => { handleCloseTaskSettings(true) }"
            >确定</el-button>
          </div>
        </div>
        <!-- 新增任务优先级设置模态框 -->
        <div
          v-show="showTaskPriority"
          class="Tasks__list__addTask__taskPriority"
        >
          <span class="Tasks__list__addTask__taskPriority__title">优先级</span>
          <div class="Tasks__list__addTask__taskPriority__icons">
            <span
              v-for="(taskPriority, index) in taskPrioritys"
              :key="taskPriority.iconFlag"
              :class="[
                'iconfont',
                `Tasks__list__addTask__taskPriority__${taskPriority.classFlag}`,
                { 'selectedPriority':  selectedPriority === taskPriority.dataFlag }
              ]"
              :title="taskPriority.title"
              v-html="taskPriority.iconFlag"
              @click="() => handleSelectPriority(index)"
            ></span>
          </div>
        </div>
        <!-- 新增任务添加按钮 -->
        <el-button
          class="Tasks__list__addTask__addBtn"
        >添加</el-button>
      </div>
    </div>
    <!-- 任务细节展示区域 -->
    <div class="Tasks__detail">
      <div class="Tasks__detail__initial">Tasks__detail__initial</div>
      <router-view></router-view>
    </div>
    <!-- Modal 区域。随设定任务日期和优先级打开 -->
    <div
      v-show="showTaskSetting || showTaskPriority"
      class="Tasks__modal"
      @click="() => { handleCloseTaskSettings(false) }"
    ></div>
  </div>
</template>

<script setup>
import request from '../../api/index'
import _ from 'lodash'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

// 日历装饰器对象
const calendarAttributes = [
  {
    key: 'today',
    highlight: {
      color: 'blue',
      fillMode: 'outline'
    },
    dates: new Date()
  }
]

//! 组件内部通用状态
// 新增任务数据
const newTask = reactive({
  taskName: '',   // 新增任务名
  taskDate: '',  // 新增任务默认日期
  taskTime: '',   // 新增任务默认时间
  startTaskDate: '',  // 新增任务时间段模式开始日期
  startTaskTime: '',          // 新增任务时间段模式开始时间
  endTaskDate: '',            // 新增任务时间段模式结束日期
  endTaskTime: '',            // 新增任务时间段模式结束时间
  notify: '',      // 新增任务提醒设置
  taskPriority: '' // 新增任务默认值
})

// 任务默认值
const taskDefaultData = reactive({})

// 时间和日期默认设定
const timeAndDateData = reactive({})

//! 新增任务展示逻辑区域
// 新增任务设置展开/关闭状态变量
const showTaskSetting = ref(false)

// 新增任务设置展开
const handleShowTaskSetting = (save) => {
  showTaskSetting.value = !showTaskSetting.value
  // 如果是点击模态关闭，清空任务设置
  if (!save && !showTaskSetting.value) {
    handleCleanTaskSetting()
  }
}

//! 新增任务优先级相关逻辑区域
// 新增任务优先级标记集合
const taskPrioritys = ref([
  { classFlag: 'icon1', title: '低', iconFlag: '&#xe673;', dataFlag: 'low' },
  { classFlag: 'icon2', title: '中', iconFlag: '&#xe674;', dataFlag: 'mid' },
  { classFlag: 'icon3', title: '高', iconFlag: '&#xe675;', dataFlag: 'high' }
])

// 当前选中的优先级
const selectedPriority = ref('')

// 选中指定任务优先级处理
const handleSelectPriority = (index) => {
  selectedPriority.value = taskPrioritys.value[index].dataFlag
}

// 新增任务优先级设置展开/关闭状态变量
const showTaskPriority = ref(false)

// 新增任务优先级展开
const handleShowTaskPriority = () => {
  showTaskPriority.value = !showTaskPriority.value
}

//! 点击模态背景相关逻辑区域
// 模态检测关闭任务通用设定还是优先级设定
const handleCloseTaskSettings = (save) => {
  if (showTaskSetting.value) {
    handleShowTaskSetting(save)
  } else {
    handleShowTaskPriority()
  }
}

//! 任务设定模式（日期/时间段）切换逻辑区域
// 任务设定模式切换（日期/时间段）
const showTaskQuantum = ref(false)

// 切换为任务日期设定模式
const handleShowTaskDate = () => {
  showTaskQuantum.value = false
  Object.assign(newTask, {
      startTaskDate: '',
      startTaskTime: '',
      endTaskDate: '',
      endTaskTime: '',
  })
}

// 切换为任务时间段设定模式
const handleShowTaskQuantum = () => {
  showTaskQuantum.value = true

  let startTime = dayjs(new Date()) // 获取当前时间
  let nowHour = startTime.hour()
  let nowMinute = startTime.minute()

  // 如果当前小于 30 分钟，那么把开始时间设置为 30 分
  // 如果当前大于 30 分钟，那么把开始时间设置为 0 分，下一个小时
  if (nowMinute < 30) {
    startTime = startTime.minute(30)
  } else if (nowMinute > 30) {
    startTime = startTime.minute(0)
    startTime = startTime.hour(nowHour + 1)
  }

  // 结束时间就是为开始时间增加 30 分钟
  let endTime = dayjs(startTime.valueOf()).minute(startTime.minute() + 30)

  Object.assign(newTask, {
    taskDate: '',
    taskTime: '',
    startTaskDate: new Date(),  // 默认设定为当前日期
    endTaskDate: new Date(),
    startTaskTime: startTime.toDate(), // 默认设定为当前时间
    endTaskTime: endTime.toDate()
  })
}

// 根据默认任务日期设定模式来判断是显示时间段还是日期模式
watch(taskDefaultData, () => {
   if (_.get(taskDefaultData, 'defaultDateMode', '') !== 'date') {
     handleShowTaskQuantum()
   } else {
     handleShowTaskDate()
   }
})

//! 时间段模式下选择开始日期结束日期、开始时间结束时间逻辑区域
// 禁用选择结束日期时小于开始日期的日期
const handleDisableDate = (date) => {
  if (
    newTask.startTaskDate
    && 
    (dayjs(date).startOf('day').valueOf() < dayjs(newTask.startTaskDate).startOf('day').valueOf())
  ) {
    return true
  } else {
    return false
  }
}

// 选择开始日期的逻辑
const handleSelectStartDate = (date) => {
  if (
    newTask.endTaskDate
    &&
    (dayjs(newTask.endTaskDate).startOf('day').valueOf() < dayjs(date).startOf('day').valueOf())
  ) {
    newTask.endTaskDate = ''
  }
}

// 选择时间段模式开始时间或结束时间
const handleSelectQuantumTime = () => {
  if (newTask.startTaskTime && newTask.endTaskTime) {
    const startTime = dayjs(newTask.startTaskTime)
    const endTime = dayjs(newTask.endTaskTime)

    const startHour = startTime.hour()
    const endHour = endTime.hour()
    const startMinute = startTime.minute()
    const endMinute = endTime.minute()

    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      ElMessage.error('结束时间不能小于等于开始时间')
      newTask.endTaskTime = ''
    } 
  }
}

//! 清楚任务设定值逻辑区域
// 清除任务值设定
const handleCleanTaskSetting = () => {
  // 将任务设定值进行合并清除
  Object.assign(newTask, {
    taskDate: '',
    taskTime: '',
    startTaskDate: '',
    startTaskTime: '',
    endTaskDate: '',
    endTaskTime: '',
    notify: ''
  })
}

//! 获取任务默认值逻辑区域
// 获取用户设定任务相关默认值
;(async () => {
  try {
    const res = await request.getUserTaskDefault()
    const { taskDefault, timeAndDate } = res
    Object.assign(taskDefaultData, taskDefault)
    newTask.notify = taskDefaultData.defaultNotify  // 将默认提醒进行赋值
    selectedPriority.value = taskDefault.defaultPriority  // 将默认优先级进行选中
    newTask.taskPriority = taskDefault.defaultPriority    // 将默认优先级进行赋值
    Object.assign(timeAndDateData, timeAndDate)
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Tasks {
  display: flex;
  height: 100%;
  position: relative;

  &__list {
    flex: 3 1 auto;
    margin: .15rem 0;
    padding: 0 .15rem;
    border-right: .01rem solid rgba(223, 223, 223, 0.644);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .23rem;
      color: $base-fontColor;

      &__shrink {
        margin-right: .1rem;
        cursor: pointer;
        color: $icon-color;
      }
    }

    &__addTask {
      display: flex;
      align-items: center;
      margin-top: .1rem;
      position: relative;

      &__taskIcons {
        display: flex;
        align-items: center;
        margin-right: .05rem;
      }

      &__taskSettingIcon {
        font-size: .18rem;
        margin-right: .12rem;
      }

      &__taskSetting {
        width: 2.7rem;
        position: absolute;
        top: .36rem;
        right: .05rem;
        z-index: 1;
        background-color: $base-bgColor;
        border-radius: .05rem;
        box-shadow: 0 0 .15rem .02rem rgba(196, 196, 196, 0.39);
      }

      &__taskPriorityIcon {
        font-size: .22rem;
      }

      &__taskPriority {
        padding: .08rem .1rem;
        box-sizing: border-box;
        position: absolute;
        top: .36rem;
        right: .2rem;
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
          color: #f25555;
          margin-right: .12rem;
        }

        &__icon2 {
          color: #ffbb44;
          margin-right: .12rem;
        }

        &__icon3 {
          color: #0888ff;
        }
      }

      &__timeModeSelect {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: .12rem 0 .05rem 0;
        font-size: .13rem;
        color: $lighter-fontColor;

        &__dateMode, &__quantumMode {
          line-height: .25rem;
          padding: 0rem .12rem;
          background-color: rgba(224, 224, 224, 0.329);
          border-radius: .2rem;
          cursor: pointer;
        }

        &__dateMode {
          margin-right: .08rem;
        }

        &__modeSelected {
          color: rgb(49,130,206)
        }
      }

      &__taskCalendar {
        border: none;
        border-radius: .01rem;
        display: block;
        margin: auto;

        .vc-popover-content {   /* 内部年份选择器样式修改 */
          border-radius: .01rem;
        }
      }

      &__taskTime {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 .1rem .1rem .1rem;

        .el-input, .el-input__inner, .el-input__icon {
          height: .3rem;
          line-height: .3rem;
        }

        .el-input {
          border: .01rem solid #ccc;
          border-radius: .05rem;
        }

        .el-input__icon {
          color: #ccc;
        }
      }

      &__timeSetting {
        flex: 1;
      }

      &__taskNotify {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 .12rem 0 .1rem;

        .el-select {
          flex: 1;
        }

        .el-input, .el-input__inner, .el-input__icon {
          height: .3rem;
          line-height: .3rem;
        }

        .el-input {
          border: .01rem solid #ccc;
          border-radius: .05rem;
        }
      }

      &__taskQuantum {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: .1rem;

        &__title {
          font-size: .13rem;
          margin-right: .08rem;
        }

        &__dateSetting, &__timeSetting {
          flex: 1;
          border: .01rem solid #ccc;
          border-radius: .05rem;
        }

        &__dateSetting {
          margin-right: .1rem;
        }

        &__timeSetting {
          flex: 1;
        }

        .el-input, .el-input__inner, .el-input__icon {
          height: .3rem;
          line-height: .3rem;
        }

        .el-input__inner{
          padding-left: .04rem;
          font-size: .12rem;
        }

        .el-input__prefix {
          display: none;
        }
      }

      &__taskQuantum:nth-child(1) {
        margin-bottom: .1rem;
      }

      &__button {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: .1rem;
      }

      &__clear, &__confirm  {
        flex: 1;
        border-radius: .05rem;
      }

      .el-input__inner {
        background-color: rgba(253, 253, 253, 0.315);
      }

      .el-input__inner::placeholder {
        color: $placeholder-color;
      }

      &__addBtn {
        border-radius: 0rem;
        background-color: rgba(255, 255, 255, 0.178);
      }

      &__addBtn:hover {
        background-color: rgba(255, 255, 255, 0.473);
      }

      &__addBtn:focus {
        background-color: rgba(255, 255, 255, 0.473);
      }
    }
  }

  &__detail {
    flex: 2 1 auto;
  }

  &__modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>