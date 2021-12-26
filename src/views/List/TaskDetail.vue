<!--
 * @Author: 胡晨明
 * @Date: 2021-10-12 16:12:41
 * @LastEditTime: 2021-12-25 23:50:13
 * @LastEditors: 胡晨明
 * @Description: 查看任务详细信息组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\List\TaskDetail.vue
-->
<template>
  <div class="TaskInfo">
    <!-- 任务顶部设置区域 -->
    <div class="TaskInfo__taskHeader">
      <div class="TaskInfo__taskHeader__left">
        <el-checkbox
          size="medium"
          class="doneCheck"
        />
        <div class="date">
          <div
            class="iconfont date__Icon"
            @click="handleShowTaskSetting"
          >&#xe61c;</div>
          <div class="date__desc" :title="taskDateFormat">{{taskDateFormat}}</div>
        </div>
      </div>
      <div class="TaskInfo__taskHeader__right">
        <div
          class="iconfont priorityIcon"
          @click="handleShowTaskPriority"
        >&#xe6e6;</div>
      </div>
      <!-- 任务通用设置模态框 -->
      <div v-show="showTaskSetting">
        <TasksGeneralSetting
          :newTask="subViewTask"
          :timeAndDateData="timeAndDateData"
          @saveTaskSetting="handleSaveTaskSetting"
          :offset="0.6"
          :isReset="reset"
          :isDetail="true"
        />
      </div>
      <!-- 任务优先级设置模态框 -->
      <TasksPrioritySetting
        v-show="showTaskPriority"
        :taskPriority="subViewTask.taskPriority"
        @saveTaskPriority="handleSaveTaskPriority"
        :offset="0.05"
      />
    </div>
    <!-- 任务详情设置区域 -->
    <div class="TaskInfo__taskMain">
      <div class="TaskInfo__taskMain__taskTitle">
        {{subViewTask.taskInfo}}
      </div>
      <div class="TaskInfo__taskMain__taskContentWrapper">
        <el-scrollbar>
          <div class="TaskInfo__taskMain__taskContent">
            <span v-if="subViewTask.taskDesc">{{subViewTask.taskDesc}}</span>
            <span 
              v-else
              class="TaskInfo__taskMain__taskContent__tips"
            >任务的一些具体描述</span>
          </div>
          <div class="TaskInfo__taskMain__taskFiles">
            <div class="iconfont fileIcon">&#xe61e;</div>
            <div class="fileInfo">
              <div class="fileInfo__title">任务文件</div>
              <div class="fileInfo__size">200K</div>
            </div>
            <el-dropdown class="fileSetting" trigger="click">
              <div class="iconfont">&#xe618;</div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>预览文件</el-dropdown-item>
                  <el-dropdown-item>下载文件</el-dropdown-item>
                  <el-dropdown-item>删除文件</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!-- 任务底部设置区域 -->
    <div class="TaskInfo__taskFooter">
      <div
        class="TaskInfo__taskFooter__taskList"
        @click="handleShowTaskList"
      >🏠 个人清单</div>
      <el-dropdown class="TaskInfo__taskFooter__taskSetting" trigger="click">
        <div class="iconfont">&#xe618;</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>上传附件</el-dropdown-item>
            <el-dropdown-item>任务动态</el-dropdown-item>
            <el-dropdown-item @click="handleDeleteTask">删除任务</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div
        class="TaskInfo__taskFooter__lists"
        v-show="showTaskList"
      >
        <el-scrollbar>
          <div
            v-for="item in userLists"
            :key="item.listId"
            class="listItem"
          >
            {{`${item.listFlag} ${item.listName}`}}
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!-- Modal 区域。随设定任务日期和优先级打开 -->
    <div
      v-show="showTaskSetting || showTaskPriority || showTaskList"
      class="modal"
      @click="() => { handleCloseTaskSettings() }"
    ></div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'
import TasksPrioritySetting from './TasksPrioritySetting.vue'
import TasksGeneralSetting from './TasksGeneralSetting.vue'
import request from '@/api/index'
import { ElMessageBox } from 'element-plus'

// 状态管理仓库
const store = useStore()

// 当前路由对象,获取 listId
const route = useRoute()
// 获取 taskId
const taskId = computed(() => {
  return parseInt(route.params.taskId)  // 转换为数值类型
})

// 清单列表
const userLists = store.state.lists.userLists
// 任务列表
const userTasks = store.state.tasks.userTasks

//! 任务数据通用逻辑
/* ------------------------ */
// 选定任务数据
const subViewTask = reactive({})
// 选定任务数据ID值
const subViewTaskId = ref(0)

// 根据路由的 taskId 和 listId 值获取指定任务数据
const getTaskData = async () => {
  const listId = parseInt(route.params.listId)
  const listId2 = parseInt(route.params.listId2)
  let task
  if (listId === 0 || listId === 1) {
    userTasks.forEach(item => {
      if (item.taskId === taskId.value && item.listId === listId2) {
        task = item.task
        subViewTaskId.value = item.id // 获取对应任务 id 值
      }
    })
  } else if (listId === 2) {
    userTasks.forEach(doneTasks => {
      doneTasks.tasks.forEach(doneTask => {
        if (doneTask.taskId === taskId.value && doneTask.listId === listId2) {
          task = doneTask.task
          subViewTaskId.value = doneTask.id
        }
      })
    })
  } else {
    userTasks.forEach(item => {
      if (item.taskId === taskId.value && item.listId === listId) {
        task = item.task
        subViewTaskId.value = item.id
      }
    })
  }
  // 深拷贝选定任务
  task = _.cloneDeep(task)
  // 将字符串类型时间戳转换为数值类型
  for (let key in task) {
    if (['taskDate', 'taskTime', 'startTaskDate', 'startTaskTime', 'endTaskDate', 'endTaskTime'].includes(key)) {
      task[key] = task[key] ? new Date(parseInt(task[key])) : task[key]
    }
  }
  Object.assign(subViewTask, task)
}
// 获取指定任务数据。当其中 taskId 和 userTasks 响应式数据发生变化则重新执行该函数
watchEffect(() => getTaskData())

// 用户设定默认日期和时间模式
const timeAndDateData = reactive({})

// 根据设定的任务日期和时间进行格式化显示
const taskDateFormat = computed(() => {
  if (_.isEmpty(subViewTask)) {
    return ''
  }

  if (!subViewTask.startTaskDate) {
    // 日期模式解析
    const taskDate = dayjs(subViewTask.taskDate)
    const taskTime = dayjs(subViewTask.taskTime)
    const paFlag = parseInt(taskTime.hour()) <= 12 ? '上午' : '下午'  // 根据小时设置上下午标记
    const day = taskDate.format('M月D日')
    const time = taskTime.format('hh:mm')
    return `${day} ${paFlag} ${time}`
  } else {
    // 时间段模式解析
    const startTaskDate = dayjs(subViewTask.startTaskDate)
    const startTaskTime = dayjs(subViewTask.startTaskTime)
    const day1 = startTaskDate.format('M月D日')
    const time1 = startTaskTime.format('hh:mm')
    const paFlag1 = parseInt(startTaskTime.hour()) <= 12 ? '上午' : '下午'  // 根据小时设置上下午标记
    if (!subViewTask.endTaskDate) {
      return `${day1} ${paFlag1} ${time1}-`
    } else {
      const endTaskDate = dayjs(subViewTask.endTaskDate)
      const endTaskTime = dayjs(subViewTask.endTaskTime)
      const day2 = endTaskDate.format('M月D日')
      const time2 = endTaskTime.format('hh:mm')
      const paFlag2 = parseInt(endTaskTime.hour()) <= 12 ? '上午' : '下午'  // 根据小时设置上下午标记
      return `${day1} ${paFlag1} ${time1} - ${day2} ${paFlag2} ${time2}`
    }
  }
})
/* ------------------------- */

//! 任务通用设定逻辑区域
/* ------------------------- */
// 任务通用设置展开/关闭状态变量
const showTaskSetting = ref(false)

// 任务设置展开
const handleShowTaskSetting = () => {
  showTaskSetting.value = !showTaskSetting.value
}

// 任务更新后保存
const handleSaveTaskSetting = (subViewTask) => {
  console.log(subViewTask)
}
/* ------------------------ */

//! 任务优先级逻辑区域
/* ------------------------ */
// 任务优先级设置展开/关闭状态变量
const showTaskPriority = ref(false)

// 任务优先级展开
const handleShowTaskPriority = () => {
  showTaskPriority.value = !showTaskPriority.value
}

// 任务优先级赋值操作
const handleSaveTaskPriority = (taskPriority) => {
  subViewTask.taskPriority = taskPriority
}
/* ------------------------ */

//! 更改任务清单逻辑区域
/* ------------------------ */
// 更改任务清单设置展开/关闭状态变量
const showTaskList = ref(false)

// 更改任务清单展开
const handleShowTaskList = () => {
  showTaskList.value = !showTaskList.value
}
/* ------------------------ */

//! 删除任务（软删除）逻辑区域
/* ------------------------ */
const handleDeleteTask = () => {
  ElMessageBox.confirm(
    '请确认是否删除该任务',
    '确认框',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const id = subViewTaskId.value
    const taskIdVal = taskId.value
    const listId = route.params.listId2 || route.params.listId
    store.dispatch('setUserTask', { 
      id,
      taskId: taskIdVal,
      listId,
      flag: 'softDel',
      value: 1
    })
  }).catch(() => {
    return
  })
}
/* ------------------------ */

//! 点击模态背景相关逻辑区域
/* ------------------------ */
const reset = ref(false)
// 模态检测关闭任务通用设定还是优先级设定
const handleCloseTaskSettings = () => {
  if (showTaskSetting.value) {
    handleShowTaskSetting()
    reset.value = true
    setTimeout(() => {
      reset.value = false
    }, 0)
  } else if (showTaskPriority.value) {
    handleShowTaskPriority()
  } else {
    handleShowTaskList()
  }
}
/* ------------------------ */

//! 获取任务默认值
// 获取用户设定任务相关默认值
;(async() => {
  try {
    const res = await request.getUserTaskDefault()
    Object.assign(timeAndDateData, res.timeAndDate)
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.TaskInfo {
  height: 100%;
  display: flex;
  flex-flow: column;

  &__taskHeader {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .4rem;
    padding: 0 .15rem .1rem .15rem;
    box-sizing: border-box;
    box-shadow: 0px 1px 1px -1px rgb(255, 255, 255);

    &__left {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      .doneCheck {
        height: .14rem;
        padding-right: .15rem;

        .el-checkbox__inner {
          width: .18rem;
          height: .18rem;
        }

        .el-checkbox__inner::after {
          top: 20%;
          left: 38%;
        }
      }
      .date {
        display: flex;
        align-items: center;
        padding-left: .15rem;
        box-shadow: -1.5px 0px 1px -1px rgb(255, 255, 255);
        &__Icon {
          font-size: .18rem;
          margin-right: .1rem;
        }

        &__desc {
          color: #235d97;
          font-size: .14rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          width: 85%;
        }
      }
    }

    &__right {
      margin-left: auto;
      .priorityIcon {
        font-size: .18rem;
      }
    }
  }

  &__taskMain {
    height: 75%;
    flex: 1;
    color: $base-fontColor;
    padding: .2rem .15rem .1rem .15rem;

    &__taskTitle {
      font-size: .18rem;
      font-weight: bold;
      margin-bottom: .05rem;
    }

    &__taskContentWrapper {
      height: 95%;
    }

    &__taskContent {
      margin: .1rem 0;
      font-size: .14rem;

      &__tips {
        color: rgb(150, 150, 150);
      }
    }

    &__taskFiles {
      display: flex;
      align-items: center;
      padding: .1rem .08rem;
      margin: 0 .16rem .1rem .16rem;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.2);
      border-radius: .05rem;
      transition: .2s ease;
      cursor: pointer;
      
      .fileIcon {
        font-size: .2rem;
        margin-right: .08rem;
      }

      .fileInfo {
        &__title {
          font-size: .14rem;
        }

        &__size {
          font-size: .12rem;
          color: rgba(161, 161, 161, 0.623);
        }
      }

      .fileSetting {
        font-size: .2rem;
        margin-left: auto;
        padding: .05rem;
      }
    }

    &__taskFiles:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }

  &__taskFooter {
    position: relative;
    height: .45rem;
    padding: 0 .15rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px -1px 1px -1px rgb(255, 255, 255);

    &__taskList {
      font-size: .15rem;
      color: $base-fontColor;
      padding: .05rem .15rem .05rem .15rem;
      cursor: pointer;
      border-radius: .05rem;
      transition: .2s ease;
    }

    &__taskList:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    &__taskSetting {
      font-size: .2rem;
    }

    &__lists {
      width: 1.2rem;
      height: 1.3rem;
      position: absolute;
      left: .13rem;
      bottom: .4rem;
      padding: .05rem 0;
      z-index: 2;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.5);
      border-radius: .05rem;

      .listItem {
        color: $base-fontColor;
        font-size: .13rem;
        text-align: center;
        padding: .05rem .05rem .05rem .02rem;
        cursor: pointer;
        border-radius: .05rem;
      }

      .listItem:hover{
        background: rgba(255, 255, 255, 0.6);
      }
    }
  }

  .modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>