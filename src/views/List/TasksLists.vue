<!--
 * @Author: 胡晨明
 * @Date: 2021-12-02 14:10:07
 * @LastEditTime: 2021-12-04 23:39:07
 * @LastEditors: Please set LastEditors
 * @Description: 任务列表组件
 * @FilePath: \Anydo-app\src\views\List\TasksLists.vue
-->
<template>
  <div class="taskLists">
    <el-scrollbar>
      <!-- 任务列表 -->
      <div class="taskLists__allTasks">
        <draggable
          :list="userTasks"
          @start="dragging = true"
          @end="dragging = false"
          item-key="taskId"
        >
          <template #item="{element}">
            <div>
              <div
                :class="[
                  'taskLists__allTasks__task', 
                  { 'selectedStyle':  enterTaskId === element.taskId || selectedTaskId === element.taskId}
                ]"
                @mouseenter="enterTaskId = element.taskId"
                @mouseleave="enterTaskId = 0"
                @click="selectedTaskId = element.taskId"
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
        <!-- TODO所有和已完成清单列表下展开式的任务列表 -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import draggable from 'vuedraggable'
import request from '../../api/index'
import _ from 'lodash'
import db from '../../store/db'

// 父子数据通信
const props = defineProps({
  listId: {
    type: String
  }
})

// 状态管理仓库
const store = useStore()

// 当前清单任务列表
const userTasks = store.state.tasks.userTasks

// 监听 listId 的变化动态获取对应清单任务集合
watch(() => props.listId, (val) => {
  store.dispatch('getUserTasks', val)
})

// 任务拖拽标记
const dragging = ref(true)

// 鼠标进出任务区域标记
const enterTaskId = ref(0)

// 鼠标选中任务区域标记
const selectedTaskId = ref(0)

// 点击完成任务
const handleCompleteTask = (taskId) => {
  console.log(taskId)
}

// 获取全部任务列表
;(async () => {
  try {
    const tasksTotal = await db.tasks.count()
    // 只有本地没有任务数据时再向后端请求数据
    if (!tasksTotal) {
      let res = await request.getUserAllTasks()
      if (!_.isEmpty(res)) {
        const allTasks = res.allTasks
        store.dispatch('saveUserTasksDB',{ listId: props.listId, allTasks })
      }
    } else {
      store.dispatch('saveUserTasksDB', { listId: props.listId })
    }
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.taskLists {
  margin-top: .05rem;
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
    }

    .selectedStyle {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
