/* eslint-disable indent */
<!--
 * @Author: 胡晨明
 * @Date: 2021-12-02 14:10:07
 * @LastEditTime: 2021-12-07 23:12:54
 * @LastEditors: Please set LastEditors
 * @Description: 任务列表组件
 * @FilePath: \Anydo-app\src\views\List\TasksLists.vue
-->
<template>
  <div class="taskLists">
    <el-scrollbar>
      <!-- 任务列表 -->
      <div class="taskLists__allTasks">
        <!-- 显示指定 listId 清单任务集合 -->
        <draggable
          :list="userTasks"
          @start="dragging = true"
          @end="dragging = false"
          item-key="id"
          v-if="syncListId !== 0"
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
                @click="selectedTaskId = element.id"
              >
                <el-checkbox
                  size="medium"
                  class="doneCheck"
                  @change="() => { handleCompleteTask(element.taskId) }"
                />
                <span class="taskInfo">{{element.task && element.task.taskInfo}}</span>
                <span
                  v-if="syncListId === 1"
                  class="listInfo"
                  @click.self="() => { handleGotoList(element.listId) }"
                >{{handleTodayTaskList(element.listId)}}</span>
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
                    @click="selectedTaskId = element.id"
                  >
                    <el-checkbox
                      size="medium"
                      class="doneCheck"
                      @change="() => { handleCompleteTask(element.taskId) }"
                    />
                    <span class="taskInfo">{{element.task && element.task.taskInfo}}</span>
                  </div>
                </div>
              </template>
            </draggable>
          </template>
        </listsColumn>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import listsColumn from '@/components/listsColumn.vue'

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

// 清单列表及对应的任务集合显示标记
const userLists = store.state.lists.userLists
const showLists = reactive({})
watch(() => userLists, (val) => {
  val.map((item) => {
    showLists[item.listId] = false
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
})

// 任务拖拽标记
const dragging = ref(true)

// 鼠标进出任务区域标记
const enterTaskId = ref(0)

// 鼠标选中任务区域标记
const selectedTaskId = ref(0)

// 点击完成任务
const handleCompleteTask = (taskId) => {
  store.dispatch('', taskId)
}

// 获取任务清单名称和flag
const handleTodayTaskList = (listId) => {
  let listDesc = ''
  userLists.forEach((list) => {
    if (list.listId === listId) {
      listDesc = list.listFlag + ' ' + list.listName
    }
  })
  return listDesc
}

// 查看今天任务下点击任务清单信息跳转到指定清单
const handleGotoList = (listId) => {
  router.push({ path: `/list/${listId}/tasks` })
}

// 获取全部任务列表
;(async () => {
  try {
    store.dispatch('saveUserTasksDB', props.listId)
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
  
  &__allTasks {
    margin: 0 .15rem;

    &__task {
      display: flex;
      align-items: center;
      line-height: .4rem;
      cursor: pointer;
      transition: .2s ease;

      .doneCheck {
        margin: 0 .06rem 0 .08rem;
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
    }

    .selectedStyle {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
