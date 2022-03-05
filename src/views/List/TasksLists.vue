<!--
 * @Author: 胡晨明
 * @Date: 2021-12-02 14:10:07
 * @LastEditTime: 2022-03-01 17:33:24
 * @LastEditors: 胡晨明
 * @Description: 任务列表组件
 * @FilePath: \Anydo-app\src\views\List\TasksLists.vue
-->
<template>
  <div :class="['taskLists', (isHide + isHide2 === 2)?'taskLists--hide':'']">
    <el-scrollbar v-if="userTasks.length > 0">
      <!-- 任务列表 -->
      <div
        class="taskLists__allTasks"
      >
        <!-- 显示指定 listId 清单任务集合 -->
        <draggable
          :list="userTasks"
          @start="dragging = true"
          @end="dragging = false"
          item-key="id"
          v-if="syncListId !== 0 && syncListId !== 2"
        >
          <template #item="{element}">
            <div>
              <div
                :class="[
                  'taskLists__allTasks__task', 
                  { 'selectedStyle':  enterTaskId === element.id || selectedTaskId === element.id}
                ]"
                @mouseenter="enterTaskId = element.id"
                @mouseleave="enterTaskId = -1"
              >
                <el-checkbox
                  v-if="syncListId !== 3"
                  size="medium"
                  class="doneCheck"
                  @change="() => { handleCompleteTask({ id: element.id, listId: element.listId, taskId: element.taskId, taskInfo: element.task && element.task.taskInfo, flag: 'done', value: 1 }) }"
                />
                <div
                  class="optLink"
                  v-else
                >
                  <el-link
                    type="primary"
                    :underline="false"
                    class="optLink__delete"
                    @click="() => { handleDeleteTask({ id: element.id, listId: element.listId, taskId: element.taskId }) }"
                  >删除</el-link>
                  <el-link
                    type="primary"
                    :underline="false"
                    class="optLink__reset"
                    @click="() => { handleRevertTask({ id: element.id, listId: element.listId, taskId: element.taskId, flag: 'softDel', value: 0 }) }"
                  >还原</el-link>
                </div>
                <span
                  class="taskInfo"
                  @click="() => { handleCheckTaskInfo(element.id, element.listId, element.taskId) }"
                >{{element.task && element.task.taskInfo}}</span>
                <span
                  v-if="syncListId === 1 || syncListId === 3"
                  class="listInfo"
                  @click.self="() => { handleGotoList(element.listId) }"
                >{{handleTaskList(element.listId)}}</span>
                <span
                  v-if="syncListId !== 3"
                  class="timeInfo"
                >
                  {{handleGetTaskTime(element)}}
                </span>
              </div>
            </div>
          </template>
        </draggable>
        <!-- 所有清单列表下展开式的任务列表 -->
        <listsColumn
          v-if="syncListId === 0"
          v-for="list in userLists"
          :key="list.listId"
          v-model:showList="showLists[list.listId]"
          :title="list.listName"
          :background="true"
          :style="{ marginBottom: '.08rem' }"
        >
          <template v-slot:content>
            <draggable
              :list="userTasks"
              @start="dragging = true"
              @end="dragging = false"
              item-key="id"
            >
              <template #item="{element}">
                <div>
                  <div
                    v-if="element.listId === list.listId && showLists[list.listId]"
                    :class="[
                      'taskLists__allTasks__task', 
                      { 'selectedStyle':  enterTaskId === element.id || selectedTaskId === element.id}
                    ]"
                    @mouseenter="enterTaskId = element.id"
                    @mouseleave="enterTaskId = -1"
                  >
                    <el-checkbox
                      size="medium"
                      class="doneCheck"
                      @change="() => { handleCompleteTask({ id: element.id, listId: element.listId, taskId: element.taskId, taskInfo: element.task && element.task.taskInfo, flag: 'done', value: 1 }) }"
                    />
                    <span
                      class="taskInfo"
                      @click="() => { handleCheckTaskInfo(element.id, element.listId, element.taskId) }"
                    >{{element.task && element.task.taskInfo}}</span>
                    <span
                      class="timeInfo"
                    >
                      {{handleGetTaskTime(element)}}
                    </span>
                  </div>
                </div>
              </template>
            </draggable>
          </template>
        </listsColumn>
        <!-- 已完成任务列表 -->
        <listsColumn
          v-if="syncListId === 2"
          v-for="doneTask in userTasks"
          :key="doneTask.doneTime"
          v-model:showList="doneTask.show"
          :title="dayjs(+doneTask.doneTime).format('YYYY/MM/DD')"
          :background="true"
          :style="{ marginBottom: '.08rem' }"
        >
          <template v-slot:content>
            <draggable
              :list="doneTask.tasks"
              @start="dragging = true"
              @end="dragging = false"
              item-key="id"
            >
              <template #item="{element}">
                <div>
                  <div
                    v-if="doneTask.show"
                    :class="[
                      'taskLists__allTasks__task', 
                      { 'selectedStyle':  enterTaskId === element.id || selectedTaskId === element.id}
                    ]"
                    @mouseenter="enterTaskId = element.id"
                    @mouseleave="enterTaskId = -1"
                  >
                    <el-checkbox
                      size="medium"
                      class="doneCheck"
                      checked
                      @change="() => { handleCompleteTask({ id: element.id, listId: element.listId, taskId: element.taskId, taskInfo: element.task && element.task.taskInfo, flag: 'done', value: 0, extValue: doneTask.doneTime }) }"
                    />
                    <span
                      class="taskInfo"
                      @click="() => { handleCheckTaskInfo(element.id, element.listId, element.taskId) }"
                    >{{element.task && element.task.taskInfo}}</span>
                    <span
                      class="listInfo"
                    >{{handleTaskList(element.listId)}}</span>
                  </div>
                </div>
              </template>
            </draggable>
          </template>
        </listsColumn>
      </div>
    </el-scrollbar>
    <div v-else class="taskLists__NoneBox">
      <img src="@/assets/images/暂无任务.svg" class="taskLists__NoneBox__img"/>
      <span class="taskLists__NoneBox__content">没想好把任务安排在哪？可以先放这里</span>
      <span class="taskLists__NoneBox__tips">在输入框记下来</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import listsColumn from '@/components/listsColumn.vue'
import dayjs from 'dayjs'
import storage from '@/utils/storage'
import request from '../../api/index'
import { ElMessageBox } from 'element-plus'

const router = useRouter()

// 父子数据通信
const props = defineProps({
  listId: {
    type: Number
  }
})
const syncListId = ref(props.listId)

// 状态管理仓库
const store = useStore()

const isHide = computed(() => {
  return store.state.aside.isHide
})

const isHide2 = computed(() => {
  return store.state.aside.isHide2
})

// 清单列表及对应的任务集合显示标记
const userLists = store.state.lists.userLists
const showLists = reactive({})
watch(() => userLists, (val) => {
  val.map(async (item) => {
    showLists[item.listId] = true

    if (props.listId === 0 && item.listId > 300000) {
      const listTasks = await request.getShareTasks({ listId: item.listId })
      if (listTasks && listTasks.length > 0) {
        listTasks.forEach(item => {
          store.commit('addUserTask', item)
        })
      }
    }

    if (props.listId === 1 && item.listId > 300000) {
      const listTasks = await request.getShareTasks({ listId: item.listId })
      // 获取今天的开始和结束时间戳
      const todayStart = dayjs().startOf('day').valueOf() + ''
      const todayEnd = dayjs().endOf('day').valueOf() + ''

      listTasks.forEach(item => {
        if (item.task.taskDate && item.task.taskDate + '' === todayStart) {
          setTimeout(() => {
            store.commit('addUserTask', item)
          }, 100)
          return
        }

        const startDate = item.task.startTaskDate
        const endDate = item.task.endTaskDate
        if (
          (startDate>= todayStart && startDate <= todayEnd) ||
          (endDate >= todayStart && endDate <= todayEnd) ||
          (startDate <= todayStart && endDate >= todayEnd)
        ) {
          setTimeout(() => {
            store.commit('addUserTask', item)
          }, 100)
        }
      })
    }
  })
}, {
  deep: true,
  immediate: true
})

// 当前清单任务列表
const userTasks = store.state.tasks.userTasks

// 监听 listId 的变化动态获取对应清单任务集合
watch(() => props.listId, (val) => {
  store.dispatch('getUserTasks', val).then(() => {
    syncListId.value = val
  })

  let shareListsIds = []
  userLists.forEach(item => {
    if (item.listId > 300000) {
      shareListsIds.push(item.listId)
    }
  })
  if (val === 0) {
    shareListsIds.forEach(async (item) => {
      const listTasks = await request.getShareTasks({ listId: item })
      if (listTasks && listTasks.length > 0) {
        listTasks.forEach(item => {
          store.commit('addUserTask', item)
        })
      }
    })
  } else if (val === 1) {
    shareListsIds.forEach(async (item) => {
      const listTasks = await request.getShareTasks({ listId: item })
      // 获取今天的开始和结束时间戳
      const todayStart = dayjs().startOf('day').valueOf() + ''
      const todayEnd = dayjs().endOf('day').valueOf() + ''

      listTasks.forEach(item => {
        if (item.task.taskDate && item.task.taskDate + '' === todayStart) {
          nextTick(() => {
            store.commit('addUserTask', item)
          })
          return
        }

        const startDate = item.task.startTaskDate
        const endDate = item.task.endTaskDate
        if (
          (startDate>= todayStart && startDate <= todayEnd) ||
          (endDate >= todayStart && endDate <= todayEnd) ||
          (startDate <= todayStart && endDate >= todayEnd)
        ) {
          nextTick(() => {
            store.commit('addUserTask', item)
          })
        }
      })
    })
  }
})

// 任务拖拽标记
const dragging = ref(true)

// 鼠标进出任务区域标记
const enterTaskId = ref(0)

// 鼠标选中任务区域标记
const selectedTaskId = ref(0)

// 点击完成任务或还原完成任务
const handleCompleteTask = (settingValues) => {
  if (settingValues.value) {
    settingValues.extValue = dayjs().startOf('day').valueOf() + ''  // 设置任务结束日期时间戳
  }
  store.dispatch('setUserTask', settingValues)
  .then(async () => {
    if (settingValues.value) {
      const userName = storage.getItem('userInfo').userName
      await request.sendTaskNotice({ flag: 'done',  userName, listId: settingValues.listId, taskInfo: settingValues.taskInfo, taskId: settingValues.taskId})
    }
  })
}

// 获取任务清单名称和flag
const handleTaskList = (listId) => {
  let listDesc = ''
  userLists.forEach((list) => {
    if (list.listId === listId) {
      listDesc = list.listFlag + ' ' + list.listName
    }
  })
  return listDesc
}

// 获取任务时间并格式化返回
const handleGetTaskTime = (elm) => {
  if (elm.task.taskDate) {
    return dayjs(+elm.task.taskTime).format('MM月DD日 HH:mm')
  } else if (elm.task.startTaskDate) {
    return `${dayjs(+elm.task.startTaskDate).format('MM月DD日')} ${dayjs(+elm.task.startTaskTime).format('HH:mm')} - ${dayjs(+elm.task.endTaskDate).format('MM月DD日')} ${dayjs(+elm.task.endTaskTime).format('HH:mm')}`
  }
}

// 查看今天任务下点击任务清单信息跳转到指定清单
const handleGotoList = (listId) => {
  // 如果是垃圾桶界面则不进行清单跳转
  if (syncListId.value !== 3) {
    router.push({ path: `/list/${listId}/tasks` })
  }
}

// 点击指定任务查看任务信息
const handleCheckTaskInfo = (id, listId, taskId) => {
  selectedTaskId.value = id
  // 所有、今天、已完成任务列表显示任务详情跳转方式
  if (syncListId.value === 0 || syncListId.value === 1 || syncListId.value === 2) {
    router.push({ path: `/list/${syncListId.value}/tasks/${listId}/${taskId}` })
  // 垃圾桶任务列表不跳转至任务详情
  } else if (syncListId.value === 3) {
    return
  // 指定清单任务列表显示任务详情跳转方式
  } else {
    router.push({ path: `/list/${syncListId.value}/tasks/${taskId}` })
  }
}

// 点击已软删除任务进行硬（即永久）删除
const handleDeleteTask = (deleteValues) => {
  ElMessageBox.confirm(
    '请确认是否永久删除该任务',
    '确认框',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    store.dispatch('deleteUserTask', deleteValues)
  }).catch(() => {
    return
  })
}

// 点击已软删除任务进行还原
const handleRevertTask = (settingValues) => {
  store.dispatch('setUserTask', settingValues)
}

// 获取任务列表
;(async () => {
  try {
    store.dispatch('getUserTasks', props.listId)
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.taskLists {
  margin-top: .08rem;
  min-height: 80%;
  position: relative;

  &--hide {
    z-index: 9;
  }
  
  &__allTasks {
    margin: 0 .15rem;

    &__task {
      display: flex;
      align-items: center;
      line-height: .4rem;
      cursor: pointer;
      transition: .2s ease;

      .doneCheck, .optLink {
        margin: 0 .06rem 0 .08rem;
      }

      .optLink {
        &__delete, &__reset {
          font-size: .13rem;
        }

        &__delete {
          margin-right: .05rem;
        }
      }

      .taskInfo {
        flex: 1;
        font-size: .14rem;
        color: $base-fontColor;
      }

      .listInfo {
        font-size: .13rem;
        color: $lighter-fontColor;
        margin-right: .05rem;
      }

      .timeInfo {
        font-size: .12rem;
        color: $lighter-fontColor;
        margin-right: .05rem;
      }
    }

    .selectedStyle {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &__NoneBox {
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-top: .3rem;
    &__img {
      width: 180px;
      filter: opacity(.5);
    }

    &__content {
      font-size: .15rem;
      margin-bottom: .1rem;
      color: rgb(80, 80, 80);
    }

    &__tips {
      font-size: .13rem;
      color: rgb(102, 102, 102);
    }
  }
}
</style>
