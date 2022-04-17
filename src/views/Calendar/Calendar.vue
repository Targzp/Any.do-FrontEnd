<!--
 * @Author: 胡晨明
 * @Date: 2022-02-05 15:55:43
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-13 13:44:19
 * @Description: 日历页面组件
-->
<template>
  <div :class="['Container', isHide?'Container--spread':'']">
    <el-calendar
      class="Container__canlendar"
      v-model="value"
      ref="calendar"
    >
      <template #header="{ date }">
      <span class="Container__canlendar__header">
        <span
          :class="['Container__canlendar__shrink', isHide?'Container__canlendar__shrink--hide': '']"
          @click="handleHideAside"
        >
          <i :class="['el-icon-s-fold', isHide?'el-icon-s-fold--hide':'']"></i>
        </span>
        <span>{{ date }}</span>
      </span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-month')">上个月</el-button>
        <el-button size="small" @click="selectDate('today')">今天</el-button>
        <el-button size="small" @click="selectDate('next-month')">下个月</el-button>
      </el-button-group>
    </template>
      <template #dateCell="{ data }">
        <p
          class="date"
          @dblclick="(e) => { handleOpenCreateTask(data.day, e) }"
        >
          {{ data.day.split('-').slice(1).join('-') }}
          <p
            class="taskInfo"
            @click="() => { handleViewTasks(data.day) }"
          >
            {{handleShowTaskInfo(data.day)}}
          </p>
        </p>
      </template>
    </el-calendar>

    <!-- 任务信息模态框 -->
    <el-dialog
      title="该天的全部任务"
      v-model="tasksInfoTrigger"
      :width="300"
      :append-to-body="true"
      :destroy-on-close="true"
    >
      <el-scrollbar
        height="280px"
      >
        <div>
          <el-timeline
            class="timeLine"
          >
            <el-timeline-item
              v-for="(dateTask, index) in dateTasks"
              :key="index"
              :timestamp="dayjs((+dateTask.taskTime)).format('YYYY-MM-DD HH:mm')"
              placement="top"
              center
              type="primary"
            >
              <p class="timeLine__info">{{dateTask.taskInfo}}</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-scrollbar>
    </el-dialog>

    <!-- 创建任务模态框 -->
    <el-dialog
      title="创建任务"
      v-model="createTaskTrigger"
      :width="350"
      :append-to-body="true"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    > 
      <div class="Container__taskInfo">
        <span class="Container__label">标题</span>
        <el-input
          v-model="newTask.taskInfo"
          placeholder="任务标题"
        />
      </div>
      <div class="Container__taskTime">
        <span class="Container__label">时间</span>
        <el-time-picker
          v-model="newTask.taskTime"
          placeholder="时间"
          class="Container__taskTime__timeSetting"
          :format="_.get(timeAndDateData, 'timeFormat', '24')==='24'?'HH:mm':'hh:mm A'"
        >
        </el-time-picker>
      </div>
      <div class="Container__taskNotify">
        <span class="Container__label">提醒</span>
        <el-select
          v-model="newTask.notify"
          placeholder="提醒"
          :clearable="true"
        >
          <el-option value="0" label="准时"></el-option>
          <el-option value="5" label="提前5分钟"></el-option>
          <el-option value="30" label="提前30分钟"></el-option>
          <el-option value="60" label="提前1小时"></el-option>
        </el-select>
      </div>
      <div class="Container__taskPriority">
        <span class="Container__label">优先级</span>
        <el-select
          v-model="newTask.taskPriority"
          placeholder="优先级"
          :clearable="true"
        >
          <el-option value="low" label="低"></el-option>
          <el-option value="mid" label="中"></el-option>
          <el-option value="high" label="高"></el-option>
        </el-select>
      </div>
      <div class="Container__taskLists">
        <span class="Container__label">清单</span>
        <el-select
          v-model.number="selectedListid"
          placeholder="清单"
          :clearable="true"
        >
          <el-option
            v-for="list in userLists"
            :key="list.listId"
            :value="list.listId"
            :label="list.listName" 
          />
        </el-select>
      </div>
      <div class="Container__handleBtn">
        <el-button
          type="info"
          plain
          @click="handleCreateTaskClose"
        >取消</el-button>
        <el-button
          type="primary"
          @click="handleCreateTask"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { setNewTaskNotify } from '@/utils/tasksNotify'
import request from '../../api/index'
dayjs.extend(customParseFormat)

const store = useStore()

// 获取列表数据
const userLists = store.state.lists.userLists

// 全部任务列表
const userTasks = store.state.tasks.userTasks

const isHide = computed(() => {
  return store.state.aside.isHide
})

//* 隐藏侧边栏
const handleHideAside = () => {
  store.commit('changeIsHide')
}

//* 任务集合
const tasks = computed(() => {
  const filterTasks = []

  userTasks.forEach(item => {
    filterTasks.push(item.task)
  })

  return filterTasks
})

//* 日历对象
const calendar = ref(null)

//* 当前日期
const value = ref(new Date())

//* 日历日期显示任务个数信息
const handleShowTaskInfo = (day) => {
  let tasksCount = 0
  tasks.value.forEach(item => {
    if (dayjs(+item.taskTime).format('YYYY-MM-DD') === day) {
      tasksCount++
    }
  })
  if (tasksCount > 0) {
    return `有${tasksCount}个任务`
  }
}

//* 任务信息模态框打开触发标记
const tasksInfoTrigger = ref(false)

//* 某日期下的所有任务
const dateTasks = ref([])

//* 打开模态框查看具体任务
const handleViewTasks = (day) => {
  tasksInfoTrigger.value = true
  dateTasks.value.splice(0, dateTasks.value.length)

  tasks.value.forEach(item => {
    if (dayjs(+item.taskTime).format('YYYY-MM-DD') === day) {
      dateTasks.value.push(item)
    }
  })
}

//* 创建任务模态框打开触发标记
const createTaskTrigger = ref(false)

//* 任务默认值数据
const taskDefaultData = reactive({})

//* 任务默认时间格式
const timeAndDateData = reactive({})

//* 新任务数据
const newTask = reactive({})

//* 清单数据
const selectedListid = ref(0)

const targetElm = ref(null)

//* 切换月份
const selectDate = (val) => {
  calendar.value.selectDate(val)

  if (targetElm.value) {
    const taskInfoElm = targetElm.value.getElementsByClassName('taskInfo')[0]
    taskInfoElm.innerText = ''
  }
}

//* 双击打开创建任务模态框
const handleOpenCreateTask = (day, event) => {
  targetElm.value = event.target
  newTask.taskDate = dayjs(day, 'YYYY-MM-DD').valueOf() + ''
  createTaskTrigger.value = true
}

//* 点击取消关闭创建任务模态框
const handleCreateTaskClose = () => {
  createTaskTrigger.value = false
  newTask.notify = taskDefaultData.defaultNotify
  newTask.taskPriority = taskDefaultData.defaultPriority
  newTask.taskTime = ''
  selectedListid.value = taskDefaultData.defaultList
}

//* 点击确定创建任务
const handleCreateTask = async () => {
  if (newTask.taskDate && newTask.taskTime) {
    const hour = dayjs(newTask.taskTime.valueOf()).get('hour')
    const minute = dayjs(newTask.taskTime.valueOf()).get('minute')

    newTask.taskTime = (dayjs(+newTask.taskDate).set('hour', hour).set('minute', minute)).valueOf() + ''
  }

  try {
    const task = _.cloneDeep(newTask)
    const params = { listId: selectedListid.value, task }
    const { id } = await store.dispatch('saveUserTaskDB', params)
    setNewTaskNotify(id, task)
    ElMessage.success('添加成功')
  } catch (error) {
    console.log(`${error}`)
  }

  handleCreateTaskClose()
}

//! 获取任务默认值逻辑区域
// 获取用户设定任务相关默认值
;(async () => {
  try {
    const res = await request.getUserTaskDefault()
    const { taskDefault, timeAndDate } = res
    Object.assign(taskDefaultData, taskDefault)
    newTask.notify = taskDefaultData.defaultNotify  // 将默认提醒进行赋值
    selectedListid.value = taskDefaultData.defaultList 
    newTask.taskPriority = taskDefaultData.defaultPriority    // 将默认优先级进行赋值
    Object.assign(timeAndDateData, timeAndDate)

    store.dispatch('getUserTasks', 0)  // 获取全部任务列表
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Container {
  height: 100%;
  font-size: .16rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: .1rem;
  transition: all .5s ease;

  &--spread {
    margin-left: -2.7rem;
  }

  &__canlendar {
    border-radius: .1rem;
    &__header {
      display: flex;
      align-items: center;
    }

    &__shrink {
      margin-right: .1rem;
      cursor: pointer;
      color: $icon-color;
      font-size: .23rem;
      position: relative;

      .el-icon-s-fold {
        transition: .3s ease;

        &--hide {
          transform: rotateZ(180deg);
        }
      }

      &--hide {
        z-index: 999;
      }
    }
  }

  .date {
    height: 100%;
    margin: 0;
  }

  .taskInfo {
    margin: 0;
    font-size: .13rem;
    color: #409EFF;
  }

  .timeLine {
    padding: 0 0 0 .1rem;

    p {
      margin: 0;
    }

    &__info {
      font-size: .14rem;
    }
  }

  .el-calendar {
    display: flex;
    flex-flow: column;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    --el-calendar-selected-background-color: rgba(255, 255, 255, 0.5);
  }

  .el-calendar__header {
    flex: 1;
    padding: 0 .2rem;
    align-items: center;
  }

  .el-calendar__title {
    font-size: .18rem;
  }

  .el-button {
    font-size: .15rem;
  }

  .el-calendar__body {
    flex: 1;
    padding: 0;
    display: flex;
    flex-flow: column;
    position: relative;
    z-index: 9;
  }

  .el-calendar-table {
    .current, .prev, .next {
      height: 100%;
      border-left: none;
    }

    .current:last-child,
    .prev:last-child,
    .next:last-child
    {
      border-right: none;
    }
  }

  .prev, .next {
    color: rgba(255, 255, 255, 0.589) !important;
  }

  .el-calendar-day:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .el-calendar-table__row:last-child {
    .current,
    .prev,
    .next
    {
      border-bottom: none;
    }
  }

  &__label {
    margin-right: .05rem;
  }

  &__taskInfo {
    margin: 0 .1rem .1rem .1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-input, .el-input__inner, .el-input__icon {
      height: .3rem;
      line-height: .3rem;
    }

    .el-input {
      flex: 1;
      height: .3rem;
      line-height: .3rem;
      border: .01rem solid #ccc;
      border-radius: .05rem;
    }

    .el-input__inner::placeholder {
      color: #ccc;
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

    .el-input__inner::placeholder {
      color: #ccc;
    }

    .el-input__icon {
      color: #ccc;
    }

    &__timeSetting {
      flex: 1;
    }
  }

  &__taskNotify, &__taskPriority, &__taskLists {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 .12rem .1rem .1rem;

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

  &__taskPriority {
    margin-left: -.03rem;
  }

  &__handleBtn {
    display: flex;
    justify-content: center;
    margin: .15rem 0 .05rem 0;
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .Container {
    &--spread {
      margin-left: 0;
      border-radius: 0;
    }
  }
}
</style>
