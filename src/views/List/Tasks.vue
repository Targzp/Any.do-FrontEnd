<!--
 * @Author: 胡晨明
 * @Date: 2021-10-12 16:12:01
 * @LastEditTime: 2022-03-14 00:03:27
 * @LastEditors: 胡晨明
 * @Description: 清单任务组件
 * @FilePath: e:\毕设项目\Anydo-app\src\views\List\Tasks.vue
-->
<template>
  <div :class="['Tasks']">
    <div :class="['Tasks__list', isHide2?'Tasks__list--spread':'']">
      <!-- 清单任务头部区域 -->
      <div class="Tasks__list__header">
        <div>
          <span
            :class="['Tasks__list__header__shrink', (isHide + isHide2 === 2)?'Tasks__list__header__shrink--hide':'']"
            @click="handleHideAside"
          >
            <i
              :class="['el-icon-s-fold', isHide?'el-icon-s-fold--hide':'']"
            ></i>
          </span>
          <span class="Tasks__list__header__title">{{selectedList.desc}}</span>
        </div>
        <div :class="['Tasks__list__header__right', isHide2?'Tasks__list__header__right--hide':'']">
          <span
            title="共享"
            class="iconfont Tasks__list__header__other-icon1"
            v-if="!([0, 1, 2, 3].includes(listId)) && listId < 300000"
            @click="handleOpenListsShareDialog"
          >&#xe6c7;</span>
          <span
            title="展开"
            :class="['iconfont', 'Tasks__list__header__other-icon3', isHide2?'Tasks__list__header__other-icon3--hide':'']"
            v-if="listId !== 3"
            @click="handleHideTaskDetail"
          >&#xe87e;</span>
          <span
            title="清空"
            class="iconfont Tasks__list__header__other-icon2"
            v-if="listId === 3"
            @click="handleBatchDeleteTask"
          >&#xe6cc;</span>
        </div>
      </div>
      <!-- 任务增加区域 -->
      <div
        :class="['Tasks__list__addTask', (isHide + isHide2 === 2)?'Tasks__list__addTask--hide':'']"
        v-if="showAddTask"
      >
        <!-- 新任务输入框 -->
        <el-input
          v-model="newTask.taskInfo"
          class="Tasks__list__addTask__inputTask"
          :placeholder="selectedList.placeHolder"
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
        <TasksGeneralSetting
          v-if="showTaskSetting"
          :newTask="newTask"
          :taskDefaultData="taskDefaultData"
          :timeAndDateData="timeAndDateData"
          :defaultDate="defaultDate"
          :defaultStartDate="defaultStartDate"
          :defaultEndDate="defaultEndDate"
          :isReset="reset"
          :offset="0.05"
          @saveTaskSetting="handleSaveTaskSetting"
        />
        <!-- 新增任务优先级设置模态框 -->
        <TasksPrioritySetting
          v-if="showTaskPriority"
          :taskPriority="newTask.taskPriority"
          @saveTaskPriority="handleSaveTaskPriority"
          :offset="0.2"
        />
        <!-- 新增任务添加按钮 -->
        <el-button
          class="Tasks__list__addTask__addBtn"
          @click="handleAddTask"
        >添加</el-button>
        <!-- 在所有清单下提示用户选择清单模态框 -->
        <el-dialog
          title="清单列表"
          :width="300"
          top="5%"
          v-model="selectListTrigger"
          :append-to-body="true"
          :destroy-on-close="true"
          @close="handleCloseDialog"
        >
          <div class="Tasks__list__addTask__selectLists">
            <div class="selectLists__listContainer">
              <el-scrollbar>
                <div
                    class="Tasks__list__addTask__selectLists__listItem"
                    v-for="list in userLists"
                    :key="list.listId"
                >
                  <el-checkbox
                    class="selectLists__checkBox"
                    :checked="selectedListId === list.listId"
                    @change="() => { handleSelectList(list.listId) }"
                    :disabled="disable && selectedListId !== list.listId"
                  />
                  <span class="Tasks__list__addTask__selectLists__pattern">{{list.listFlag}}</span>
                  <span class="Tasks__list__addTask__selectLists__listName">{{list.listName}}</span>
                </div>
              </el-scrollbar>
            </div>
            <div class="Tasks__list__addTask__selectLists__closeSelectLists">
              <el-button
                type="primary"
                class="Tasks__list__addTask__closeBtn"
                @click="handleConfrimList"
              >确定</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
      <!-- 任务列表区域 -->
      <TaskLists :listId="parseInt(route.params.listId)"/>
    </div>
    <!-- 任务详细信息展示区域 -->
    <div
      :class="['Tasks__detail', isHide2?'Tasks__detail--shrink':'', !isHide2?'Tasks__detail--show':'']"
      v-if="showTaskDetail"
    >
      <!-- 没有选中任务时的默认展示 -->
      <div
        class="Tasks__detail__initial"
        v-if="userTasks.length > 0 && !route.params.taskId"
      >
        <img src="@/assets/images/点击查看任务.svg" class="Tasks__detail__initial__img"/>
        <span class="Tasks__detail__initial__content">点击任务标题查看详情</span>
      </div>
      <router-view else></router-view>
    </div>
    <!-- Modal 区域。随设定任务日期和优先级打开 -->
    <div
      v-show="showTaskSetting || showTaskPriority"
      class="Tasks__modal"
      @click="() => { handleCloseTaskSettings(false) }"
    ></div>
    <!-- Modal 区域。共享清单模态框组件 -->
    <el-dialog
      title="共享清单"
      v-model="shareListTrigger"
      center
      :width="450"
      :append-to-body="true"
      :destroy-on-close="true"
      :show-close="false"
    >
      <ListsShareDialog
        @handleCancel="handleCloseListsShareDialog"
        :listId="listId"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import request from '../../api/index'
import storage from '@/utils/storage'
import dayjs from 'dayjs'
import _ from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'
import { setNewTaskNotify } from '@/utils/tasksNotify'
import dailyNotify from '@/utils/dailyNotify'
import TaskLists from './TasksLists.vue'
import TasksGeneralSetting from './TasksGeneralSetting.vue'
import TasksPrioritySetting from './TasksPrioritySetting.vue'
import ListsShareDialog from './ListsShareDialog.vue'

// 状态管理仓库
const store = useStore()

// 当前路由对象,获取 listId
const route = useRoute()

// 清单列表
const userLists = store.state.lists.userLists

// 当前清单任务列表
const userTasks = store.state.tasks.userTasks

//! 组件内部通用状态
// 新增任务数据
const newTask = reactive({
  taskInfo: '',   // 新增任务信息
  taskDate: '',  // 新增任务默认日期
  taskTime: '',   // 新增任务默认时间
  startTaskDate: '',  // 新增任务时间段模式开始日期
  startTaskTime: '',          // 新增任务时间段模式开始时间
  endTaskDate: '',            // 新增任务时间段模式结束日期
  endTaskTime: '',            // 新增任务时间段模式结束时间
  notify: '',      // 新增任务提醒设置
  taskPriority: '', // 新增任务默认值
})

// 任务默认值
const taskDefaultData = reactive({})

// 时间和日期默认设定
const timeAndDateData = reactive({})

// 任务添加是否显示标记
const showAddTask = ref(true)

// 任务详情是否显示标记
const showTaskDetail = ref(true)

// 清单 id 值
const listId = ref(+route.params.listId)

const isHide = computed(() => {
  return store.state.aside.isHide
})

const isHide2 = computed(() => {
  return store.state.aside.isHide2
})

//! 获取当前用户选择清单名和flag
const selectedList = reactive({
  desc: '',
  placeHolder: ''
})
watch(
  () => userLists,
  (lists) => {
    // 根据 listId 在清单中寻找对应清单
    lists.forEach((list) => {
      if (list.listId === listId.value) {
        selectedList.desc = `${list.listFlag} ${list.listName}`
        selectedList.placeHolder = `添加任务至 ${list.listName}`
      }
    })
  },
  { immediate: true, deep: true }
)
watch(
  () => route.params.listId, 
  (val) => {
    // 获取当前清单 Id 值
    listId.value = parseInt(val)
    
    // 如果是已完成和垃圾桶界面则不显示任务输入框
    if (listId.value === 2 || listId.value === 3) {
      showAddTask.value = false
    } else {
      showAddTask.value = true
    }

    if (listId.value === 3) {
      showTaskDetail.value = false
    } else {
      showTaskDetail.value = true
    }

    // listId 一旦变化当前输入任务进行同步清空
    if (newTask.taskInfo) {
      newTask.taskInfo = ''
    }

    // 如果 listId 为 all
    if ([0, 1, 2, 3].includes(listId.value)) {
      let descDic = {
        0: '所有',
        1: '今天',
        2: '已完成',
        3: '垃圾桶'
      }
      selectedList.desc = descDic[listId.value]
      selectedList.placeHolder = '添加任务'
      return
    }

    // 根据 listId 在清单中寻找对应清单
    userLists.forEach((list) => {
      if (list.listId === listId.value) {
        selectedList.desc = `${list.listFlag} ${list.listName}`
        selectedList.placeHolder = `添加任务至 ${list.listName}`
      }
    })
  },
  { immediate: true }
)

//! 缩放用户侧边栏及任务信息侧边栏逻辑区域
const handleHideAside = () => {
  store.commit('changeIsHide')
}

const handleHideTaskDetail = () => {
  store.commit('changeIsHide2')
}

//! 新增任务展示逻辑区域
// 新增任务设置展开/关闭状态变量
const showTaskSetting = ref(false)

// 新增任务设置展开
const handleShowTaskSetting = (save) => {
  showTaskSetting.value = !showTaskSetting.value
  // 如果是点击模态关闭，重置任务设置
  if (!save && !showTaskSetting.value) {
    handleResetTaskSetting('modal')
  }
}

//! 重置任务设定值逻辑区域
// 重置标记
const reset = ref(false)
// 重置任务值设定
const handleResetTaskSetting = (flag) => {
  // 将任务设定值进行合并重置
  Object.assign(newTask, {
    taskInfo: flag === 'modal'?newTask.taskInfo:'',
    taskDate: newTask.taskDate || '',
    taskTime: '',
    startTaskDate: newTask.startTaskDate || '',
    startTaskTime: '',
    endTaskDate: newTask.endTaskDate || '',
    endTaskTime: '',
    notify: taskDefaultData.defaultNotify,
    taskPriority: flag === 'modal'?newTask.taskPriority:taskDefaultData.defaultPriority // 提交任务之后重置优先级
  })
  reset.value = true
  setTimeout(() => {
    reset.value = false
  }, 0)
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

//! 任务设定值确定（保存）逻辑区域
const handleSaveTaskSetting = (subNewTask) => {
  // 获取在任务设定模态框中设定的值
  const generalTaskSetting = _.pick(subNewTask, [
    'taskDate',
    'taskTime',
    'startTaskDate',
    'startTaskTime',
    'endTaskDate',
    'endTaskTime',
    'notify'
  ])

  Object.assign(newTask, generalTaskSetting)
  handleCloseTaskSettings(true)
}

//! 新增任务优先级相关逻辑区域
// 新增任务优先级设置展开/关闭状态变量
const showTaskPriority = ref(false)

// 新增任务优先级展开
const handleShowTaskPriority = () => {
  showTaskPriority.value = !showTaskPriority.value
}

// 任务优先级赋值操作
const handleSaveTaskPriority = (taskPriority) => {
  newTask.taskPriority = taskPriority
}

//! 添加任务逻辑区域
const selectListTrigger = ref(false)

// 清单选择禁用标记
const disable = ref(false)

// 用户当前选择的清单 listId
const selectedListId = ref(0)

// 用户选择清单
const handleSelectList = (val) => {
  disable.value = !disable.value  // 禁止选择其他清单或解除选择
  selectedListId.value = val
}

// 用户选择了添加清单的确认操作
const handleConfrimList = async () => {
  await handleSubmitTask(selectedListId.value)
  selectListTrigger.value = false
}

// 添加任务按钮操作
const handleAddTask = () => {
  // 获取当前所选清单清单名
  const listName = selectedList.desc.split(' ')[1]

  // 检查是否输入任务
  if (!newTask.taskInfo) {
    ElMessage.warning('请输入任务!')
    return
  }

  // 如果 listId 为 all 则打开清单列表供用户选择
  if (listId.value === 0 || listId.value === 1) {
    if (taskDefaultData.defaultList) {
      selectedListId.value = taskDefaultData.defaultList || 0
      disable.value = true
    }
    selectListTrigger.value = true
    return
  }

  ElMessageBox.confirm(`任务将被添加至${listName}`, '确认框', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    type: 'warning',
  }).then(async () => {
    await handleSubmitTask(listId.value)
  }).catch((err) => {
    console.log(err)
    return
  })
}

// 提交添加的任务
const handleSubmitTask = async (listId) => {
  // 将日期时间转换为时间戳格式
  const task = _.cloneDeep(newTask)
  for(let key in task) {
    if (task[key] instanceof Date) {
      task[key] = task[key].valueOf() + ''
    } else if (key === 'taskDate') {
      task[key] = task[key] + ''
    }
  }
  const params = { listId, task }

  const { id, taskId } = await store.dispatch('saveUserTaskDB', params)
  setNewTaskNotify(id, task)
  ElMessage.success('添加成功')
  handleResetTaskSetting()  // 重置任务设定

  // 发送添加任务实时通知
  if (listId > 300000) {
    const userName = storage.getItem('userInfo').userName
    await request.sendTaskNotice({ flag: 'add', userName, listId, taskInfo: task.taskInfo, taskId})
  }
}

// 选择清单模态框关闭操作
const handleCloseDialog = () => {
  disable.value = false
}

//! 任务批量永久删除逻辑区域
// 用户任务批量删除
const handleBatchDeleteTask = () => {
  ElMessageBox.confirm(
    '请确认是否永久删除全部任务',
    '确认框',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const ids = []
    const ltIds = []
    userTasks.forEach((item) => {
      ids.push(item.id)
      ltIds.push({ listId: item.listId, taskId: item.taskId })
    })

    store.dispatch('batchDeleteUserTask', { ids, ltIds })
  }).catch(() => {
    return
  })
}

//! 清单共享逻辑区域
const shareListTrigger = ref(false)

// 打开清单共享模态框
const handleOpenListsShareDialog = () => {
  shareListTrigger.value = true
}

// 关闭清单共享模态框
const handleCloseListsShareDialog = () => {
  shareListTrigger.value = false
}

//! 获取任务默认值逻辑区域
// 默认日期值
const defaultDate = ref(0)
// 默认开始日期值
const defaultStartDate = ref('')
// 默认结束日期值
const defaultEndDate = ref('')

// 获取用户设定任务相关默认值
;(async () => {
  try {
    const res = await request.getCustomSettings()
    const { taskDefault, timeAndDate, notify } = res
    Object.assign(taskDefaultData, taskDefault)
    store.commit('saveUserNotify', notify)
    newTask.notify = taskDefaultData.defaultNotify  // 将默认提醒进行赋值
    newTask.taskPriority = taskDefaultData.defaultPriority    // 将默认优先级进行赋值
    Object.assign(timeAndDateData, timeAndDate)

    if (notify.dailyNotifyTime.time) {
      dailyNotify(notify.dailyNotifyTime) // 每日提醒设定定时器
    }

    // 根据用户设置的默认任务日期进行时间设定
    if (taskDefault.defaultDate === 'td') {
      defaultDate.value = dayjs().startOf('day').valueOf()
      defaultStartDate.value = dayjs().startOf('day').valueOf() + ''
      defaultEndDate.value = dayjs().endOf('day').valueOf() + ''
    } else if (taskDefault.defaultDate === 'tm') {
      defaultDate.value = dayjs().add(1, 'day').startOf('day').valueOf()
      defaultStartDate.value = dayjs().add(1, 'day').startOf('day').valueOf() + ''
      defaultEndDate.value = dayjs().add(1, 'day').endOf('day').valueOf() + ''
    } else if (taskDefault.defaultDate === 'at') {
      defaultDate.value = dayjs().add(2, 'day').startOf('day').valueOf()
      defaultStartDate.value = dayjs().add(2, 'day').startOf('day').valueOf() + ''
      defaultEndDate.value = dayjs().add(2, 'day').endOf('day').valueOf() + ''
    }
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Tasks {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  &__list {
    height: 100%;
    flex: 3 0 0%;
    padding: .15rem 0;
    box-sizing: border-box;
    box-shadow: 1px 0px 1px -1px rgb(255, 255, 255);
    display: flex;
    flex-flow: column;
    transition: all .45s ease;

    &--spread {
      flex-basis: 100%;
      box-shadow: none;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .23rem;
      margin: 0 .15rem;
      color: $base-fontColor;

      &__shrink {
        margin-right: .1rem;
        cursor: pointer;
        color: $icon-color;
        position: relative;
        z-index: 5;

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

      &__right {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 9;

        &--hide {
          z-index: 11;
        }
      }

      &__other-icon1 {
        font-size: .2rem;
        margin-right: .13rem;
      }

      &__other-icon2 {
        font-size: .28rem;
      }

      &__other-icon3 {
        font-size: .18rem;
        transition: .3s ease;

        &--hide {
          transform: rotateZ(-180deg);
        }
      }
    }

    &__addTask {
      display: flex;
      align-items: center;
      margin: .1rem .15rem 0 .15rem;
      position: relative;
      
      &--hide {
        z-index: 10;
      }

      &__taskIcons {
        display: flex;
        align-items: center;
        margin-right: .05rem;
      }

      &__taskSettingIcon {
        font-size: .18rem;
        margin-right: .12rem;
      }

      &__taskPriorityIcon {
        font-size: .22rem;
      }

      .el-input__inner {
        background-color: rgba(253, 253, 253, 0.315);
      }

      .el-input__inner::placeholder {
        color: $placeholder-color;
      }

      &__addBtn {
        position: relative;
        top: .005rem;
        border-radius: 0rem;
        background-color: rgba(255, 255, 255, 0.178);
      }

      &__addBtn:hover {
        background-color: rgba(255, 255, 255, 0.473);
      }

      &__addBtn:focus {
        background-color: rgba(255, 255, 255, 0.473);
      }

      &__selectLists {
        &__listContainer {
          height: 3.5rem;
          overflow: auto;
        }

        &__listItem {
          display: flex;
          align-items: center;
          line-height: 50px;
          margin: 0 .1rem;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(204, 204, 204, 0.329);
        }

        &__listItem:last-child {
          border-bottom: none;
        }

        .selectLists__checkBox {
          margin-right: .05rem;
        }

        &__pattern {
          margin-right: .05rem;
        }

        &__listName {
          color: $base-fontColor;
        }

        &__closeSelectLists {
          margin: .1rem 0 .05rem 0;
          text-align: center;
        }

        &__closeBtn {
            border: 1px solid rgba(218, 218, 218, 0.61);
        }
      }
    }
  }

  &__detail {
    width: 5%;
    padding: .15rem 0 0 0;
    flex-grow: 2;
    flex-shrink: 1;
    transition: all .45s ease;
    position: relative;
    z-index: 6;

    &--shrink {
      transform: translateX(150px);
      opacity: 0;
      width: 0rem;
    }

    &__initial {
      margin-top: 1.31rem;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;

      &__img {
        width: 180px;
        filter: opacity(.5);
      }

      &__content {
        font-size: .15rem;
        margin-bottom: .1rem;
        color: rgb(80, 80, 80);
      }
    }
  }

  &__modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .Tasks {
    &__detail {
      width: 60%;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      z-index: 9;
      background-color: #fff;

      &--show {
        z-index: 11;
      }
    }
  }
}
</style>