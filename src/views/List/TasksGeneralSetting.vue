<!--
 * @Author: 胡晨明
 * @Date: 2021-12-16 22:53:36
 * @LastEditTime: 2022-01-25 10:10:00
 * @LastEditors: 胡晨明
 * @Description: 任务通用设定模态框组件及逻辑
 * @FilePath: \Anydo-app\src\components\TaskGeneralSetting.vue
-->
<template>
  <!-- 新增任务通用设置模态框 -->
  <div
    class="TaskSetting"
  >
    <div class="TaskSetting__timeModeSelect">
      <div
        :class="['TaskSetting__timeModeSelect__dateMode', { 'TaskSetting__timeModeSelect__modeSelected': !showTaskQuantum }]"
        @click="handleShowTaskDate"
      >日期</div>
      <div
        :class="['TaskSetting__timeModeSelect__dateMode', { 'TaskSetting__timeModeSelect__modeSelected': showTaskQuantum }]"
        @click="handleShowTaskQuantum"
      >时间段</div>
    </div>
    <!-- 日期/时间段模式切换 -->
    <div
      v-if="!showTaskQuantum"
    >
      <v-date-picker
        v-model="subNewTask.taskDate"
        trim-weeks
        class="TaskSetting__taskCalendar"
        :attributes="calendarAttributes"
        :model-config="modelConfig"
        :first-day-of-week="+(_.get(timeAndDateData, 'firstDayOfWeek', 1))"
      />
      <div class="TaskSetting__taskTime">
        <el-time-picker
          v-model="subNewTask.taskTime"
          placeholder="时间"
          class="TaskSetting__taskTime__timeSetting"
          :format="_.get(timeAndDateData, 'timeFormat', '24')==='24'?'HH:mm':'hh:mm A'"
        >
        </el-time-picker>
      </div>
    </div>
    <div v-else>
      <div class="TaskSetting__taskQuantum">
        <span class="TaskSetting__taskQuantum__title">开始</span>
        <el-date-picker
          v-model="subNewTask.startTaskDate"
          type="date"
          placeholder="开始日期"
          class="TaskSetting__taskQuantum__dateSetting"
          @change="handleSelectStartDate"
          value-format="x"
        ></el-date-picker>
        <el-time-picker
          v-model="subNewTask.startTaskTime"
          placeholder="开始时间"
          class="TaskSetting__taskQuantum__timeSetting"
          :format="_.get(timeAndDateData, 'timeFormat', '24')==='24'?'HH:mm':'hh:mm A'"
          @change="handleSelectQuantumTime"
        ></el-time-picker>
      </div>
      <div class="TaskSetting__taskQuantum">
        <span class="TaskSetting__taskQuantum__title">结束</span>
        <el-date-picker
          v-model="subNewTask.endTaskDate"
          type="date"
          placeholder="结束日期"
          class="TaskSetting__taskQuantum__dateSetting"
          :disabledDate="handleDisableDate"
          value-format="x"
        ></el-date-picker>
        <el-time-picker
          v-model="subNewTask.endTaskTime"
          placeholder="结束时间"
          class="TaskSetting__taskQuantum__timeSetting"
          :format="_.get(timeAndDateData, 'timeFormat', '24')==='24'?'HH:mm':'hh:mm A'"
          @change="handleSelectQuantumTime"
        ></el-time-picker>
      </div>
    </div>
    <div class="TaskSetting__taskNotify">
      <el-select
        v-model="subNewTask.notify"
        placeholder="提醒"
        :clearable="true"
      >
          <el-option value="0" label="准时"></el-option>
          <el-option value="5" label="提前5分钟"></el-option>
          <el-option value="30" label="提前30分钟"></el-option>
          <el-option value="60" label="提前1小时"></el-option>
      </el-select>
    </div>
    <div class="TaskSetting__button">
      <el-button
        type="info"
        plain
        class="TaskSetting__clear"
        @click="() => { handleCleanTaskSetting() }"
      >清除</el-button>
      <el-button
        type="primary"
        class="TaskSetting__confirm"
        @click="handleToSaveTaskSetting"
      >确定</el-button>
    </div>
  </div>
</template>

<script setup>
import _ from "lodash"
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'

// 父子数据通信
const props = defineProps({
  newTask: {
    type: Object
  },
  taskDefaultData: {
    type: Object
  },
  timeAndDateData: {
    type: Object
  },
  isReset: {
    type: Boolean
  },
  isDetail: {
    type: Boolean,
    default: false
  },
  offset: {
    type: Number
  }
})
const emit = defineEmits(['saveTaskSetting'])

//! 任务数据通用逻辑
/* -------------------------- */
// 传入的新任务配置对象进行深拷贝以便更改复制
const subNewTask =  reactive(_.cloneDeep(props.newTask))
// 当设定任务值需要进行重置时
watch(() => props.isReset, (isReset) => {
  if(isReset) {
    Object.assign(subNewTask, props.newTask)
  }
})

// 模态框偏移量
const offset = computed(() => {
  return `${props.offset}rem`
})
/* -------------------------- */

//! v-calendar 组件配置逻辑区域
/* -------------------------- */
// 日历日期配置对象
const modelConfig = {
  type: 'number',
  timeAdjust: '00:00:00'
}

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
/* -------------------------- */

//! 任务设定模式（日期/时间段）切换逻辑区域
/* -------------------------- */
// 任务设定模式切换（日期/时间段）
const showTaskQuantum = ref(false)

// 切换为任务日期设定模式
const handleShowTaskDate = () => {
  showTaskQuantum.value = false
  if (!props.isDetail) {
    Object.assign(subNewTask, {
      startTaskDate: '',
      startTaskTime: '',
      endTaskDate: '',
      endTaskTime: '',
    })
  }
}

// 切换为任务时间段设定模式
const handleShowTaskQuantum = () => {
  showTaskQuantum.value = true
  if (!props.isDetail && !subNewTask.startTaskDate) {
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

    Object.assign(subNewTask, {
      taskDate: '',
      taskTime: '',
      startTaskDate: dayjs(new Date()).startOf('day').valueOf() + '',  // 默认设定为当前日期
      endTaskDate: dayjs(new Date()).endOf('day').valueOf() + '',
      startTaskTime: startTime.toDate(), // 默认设定为当前时间
      endTaskTime: endTime.toDate()
    })
  }
}

// 根据默认任务日期设定模式来判断是显示时间段还是日期模式
watch(() => props.taskDefaultData, () => {
  if (_.get(props.taskDefaultData, 'defaultDateMode', '') !== 'date') {
    handleShowTaskQuantum()
  } else {
    handleShowTaskDate()
  }
})
/* -------------------------- */

//! 时间段模式下选择开始日期结束日期、开始时间结束时间逻辑区域
/* -------------------------- */
// 禁用选择结束日期时小于开始日期的日期
const handleDisableDate = (date) => {
  if (!subNewTask.startTaskDate) {
    subNewTask.startTaskDate = dayjs(new Date()).startOf('day').valueOf() + ''
  }
  if (
    subNewTask.startTaskDate
    && 
    (dayjs(date).startOf('day').valueOf() < dayjs(subNewTask.startTaskDate).startOf('day').valueOf())
  ) {
    return true
  } else {
    return false
  }
}

// 选择开始日期的逻辑
const handleSelectStartDate = (date) => {
  if (
    subNewTask.endTaskDate
    &&
    (dayjs(subNewTask.endTaskDate).startOf('day').valueOf() < dayjs(date).startOf('day').valueOf())
  ) {
    subNewTask.endTaskDate = ''
  }
}

// 选择时间段模式开始时间或结束时间
const handleSelectQuantumTime = () => {
  let startDate, endDate
  startDate = dayjs(subNewTask.startTaskDate).date()

  // 选择了结束时间但是没有选择结束日期，需要让用户进行选择结束日期
  if (!subNewTask.endTaskDate && subNewTask.endTaskTime) {
    ElMessage.error('请选择结束日期')
    subNewTask.endTaskTime = ''
    return
  }
  endDate = dayjs(subNewTask.endTaskDate).date()

  if (subNewTask.startTaskTime && subNewTask.endTaskTime && startDate === endDate) {
    const startTime = dayjs(subNewTask.startTaskTime)
    const endTime = dayjs(subNewTask.endTaskTime)

    const startHour = startTime.hour()
    const endHour = endTime.hour()
    const startMinute = startTime.minute()
    const endMinute = endTime.minute()

    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      ElMessage.error('结束时间不能小于等于开始时间')
      subNewTask.endTaskTime = ''
    } 
  }
}
/* -------------------------- */

//! 清除任务设定值逻辑区域
/* -------------------------- */
// 清除任务值设定
const handleCleanTaskSetting = () => {
  // 将任务设定值进行合并清除/重置
  Object.assign(subNewTask, {
    taskInfo: subNewTask.taskInfo,
    taskDate: '',
    taskTime: '',
    startTaskDate: '',
    startTaskTime: '',
    endTaskDate: '',
    endTaskTime: '',
    notify: ''
  })
}
/* -------------------------- */

//! 确认保存任务设定值逻辑区域
/* -------------------------- */
const handleToSaveTaskSetting = () => {
  // 如果只设定了开始日期没有设定开始时间，那么默认设定开始日期为用户设定时间
  if (subNewTask.startTaskDate && !subNewTask.startTaskTime) {
    subNewTask.startTaskTime = new Date(dayjs().valueOf())
  }

  // 如果只设定了结束日期没有设定结束时间，那么默认设定为结束日期当天零点
  if (subNewTask.endTaskDate && !subNewTask.endTaskTime) {
    subNewTask.endTaskTime = subNewTask.endTaskDate
  }

  // 如果设定了开始日期和开始时间，则将开始时间调整至对应开始日期时间范围内（统一调整，不管是否已经对应）
  if (subNewTask.startTaskDate && subNewTask.startTaskTime) {
    const hour = dayjs(subNewTask.startTaskTime).get('hour')
    const minute = dayjs(subNewTask.startTaskTime).get('minute')

    subNewTask.startTaskTime = new Date((dayjs(subNewTask.startTaskDate).set('hour', hour).set('minute', minute)).valueOf())
  }

  // 如果设定了结束日期和结束时间，则将结束时间调整至对应结束日期时间范围内（统一调整，不管是否已经对应）
  if (subNewTask.endTaskDate && subNewTask.endTaskTime) {
    const hour = dayjs(subNewTask.endTaskTime).get('hour')
    const minute = dayjs(subNewTask.endTaskTime).get('minute')

    subNewTask.endTaskTime = new Date((dayjs(subNewTask.endTaskDate).set('hour', hour).set('minute', minute)).valueOf())
  }

  // 如果只设定了任务时间但是没有设置任务日期，则日期默认为今天
  if (subNewTask.taskTime && !subNewTask.taskDate) {
    subNewTask.taskDate = dayjs().startOf('day').valueOf()
  }

  // 如果设定了任务日期和任务时间，则将任务时间调整至对应任务日期时间范围内（统一调整，不管是否已经对应）
  if (subNewTask.taskDate && subNewTask.taskTime) {
    const hour = dayjs(subNewTask.taskTime).get('hour')
    const minute = dayjs(subNewTask.taskTime).get('minute')

    subNewTask.taskTime = new Date((dayjs(subNewTask.taskDate).set('hour', hour).set('minute', minute)).valueOf())
  }

  emit('saveTaskSetting', subNewTask)
}
/* -------------------------- */

//! 当设定任务值默认值发生变化时
/* -------------------------- */
watch(() => props.newTask, (newTask) => {
  // 如果是查看任务数据，则将任务数据合并给 subNewTask
  if (props.isDetail) {
    Object.assign(subNewTask, newTask)
    
    // 根据 startTaskDate 来判定任务日期模式
    if (subNewTask.startTaskDate) {
      handleShowTaskQuantum()
    } else {
      handleShowTaskDate()
    }
  } else {
    subNewTask.notify = newTask.notify
  }
}, { deep: true, immediate: true })
/* -------------------------- */
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.TaskSetting {
  width: 2.7rem;
  position: absolute;
  top: .36rem;
  right: v-bind(offset);
  z-index: 1;
  background-color: $base-bgColor;
  border-radius: .05rem;
  box-shadow: 0 0 .15rem .02rem rgba(196, 196, 196, 0.39);
  
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

    &__timeSetting {
      flex: 1;
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
}
</style>