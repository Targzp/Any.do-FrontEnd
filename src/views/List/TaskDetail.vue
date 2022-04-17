<!--
 * @Author: 胡晨明
 * @Date: 2021-10-12 16:12:41
 * @LastEditTime: 2022-03-09 14:03:05
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
          :checked="!!subViewTask.doneFlag"
          @change="() => { handleCompleteTask() }"
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
        <div
          class="iconfont memberIcon"
          @click="handleShowTaskAssign"
          v-if="parseInt(route.params.listId2 || route.params.listId) < 300000"
        >
        &#xe615;</div>
      </div>
      <!-- 任务指派设置模态框 -->
      <div
        class="TaskInfo__taskHeader__taskAssign"
        v-show="showTaskAssignSetting"
      >
        <div class="title">
          指派给
        </div>
        <div class="membersList">
          <div
            class="notAssign"
            @click="handleRemoveAssign"
          >
            <span class="iconfont icon">&#xe604;</span>
            <span>不指派</span>
          </div>
          <el-scrollbar max-height="70px">
            <div
              v-for="member in members"
              :key="member._id"
              class="member"
              @click="() => { handleSelectMember(member._id) }"
            >
              <span>{{member.userName}}</span>
              <span
                v-if="isSelectedId === member._id"
                class="iconfont selected"
              >&#xebe6;</span>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <!-- 任务通用设置模态框 -->
      <div v-show="showTaskSetting">
        <TasksGeneralSetting
          :newTask="subViewTask"
          :timeAndDateData="timeAndDateData"
          @saveTaskSetting="handleSaveTaskSetting"
          :offset="0.8"
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
      <div
        class="TaskInfo__taskMain__taskTitle"
        @click="handleEditTaskInfo"
      >
        <span v-if="!isEditTaskInfo">{{subViewTask.taskInfo}}</span>
        <el-input
          v-else
          ref="taskInfoInput"
          class="taskInfoInput"
          v-model="subViewTask.taskInfo"
          @change="() => { handleCompleteTaskEdit('taskInfo') }"
        />
      </div>
      <div class="TaskInfo__taskMain__taskContentWrapper">
        <el-scrollbar>
          <div
            class="TaskInfo__taskMain__taskContent"
            @click="handleEditTaskDesc"
          >
            <span
              v-if="subViewTask.taskDesc && !isEditTaskDesc"
            >{{subViewTask.taskDesc}}</span>
            <el-input
              type="textarea"
              v-else-if="isEditTaskDesc"
              ref="taskDescInput"
              class="taskDescInput"
              v-model="subViewTask.taskDesc"
              @change="() => { handleCompleteTaskEdit('taskDesc') }"
              placeholder="任务的一些具体描述"
            />
            <span
              v-else-if="!subViewTask.taskDesc"
              class="TaskInfo__taskMain__taskContent__tips"
            >任务的一些具体描述</span>
          </div>
          <div
            v-if="!(_.isEmpty(subViewTask.taskFile))"
            class="TaskInfo__taskMain__taskFiles"
          >
            <div class="iconfont fileIcon">&#xe61e;</div>
            <div class="fileInfo">
              <div class="fileInfo__title">{{subViewTask.taskFile.fileName}}</div>
              <div class="fileInfo__size">{{subViewTask.taskFile.fileSize}}K</div>
            </div>
            <el-dropdown class="fileSetting" trigger="click">
              <div class="iconfont fileSettingIcon">&#xe618;</div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="handlePreviewFile"
                  >预览文件</el-dropdown-item>
                  <el-dropdown-item
                    @click="handleDonloadFile"
                  >下载文件</el-dropdown-item>
                  <el-dropdown-item
                    @click="handleDeleteFile"
                  >删除文件</el-dropdown-item>
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
      >{{subViewListInfo}}</div>
      <el-dropdown class="TaskInfo__taskFooter__taskSetting" trigger="click">
        <div class="iconfont settingIcon">&#xe618;</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <el-upload
                action=""
                :show-file-list="false"
                :before-upload="beforeFileUpload"
                name="File"
              >
                <span>上传附件</span>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item
              @click="handleCheckTaskDevelopment"
            >任务动态</el-dropdown-item>
            <el-dropdown-item
              @click="handleDeleteTask"
              v-if="parseInt(route.params.listId2 || route.params.listId) < 300000"
            >删除任务</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 选择清单列表模态框 -->
      <div
        class="TaskInfo__taskFooter__lists"
        v-show="showTaskList && route.params.listId !== '2'"
      >
        <el-scrollbar>
          <div
            v-for="item in userLists"
            :key="item.listId"
            class="listItem"
            @click="() => { handleSelectList(item) }"
          >
            {{`${item.listFlag} ${item.listName}`}}
          </div>
        </el-scrollbar>
      </div>
    </div>
    <!-- Modal 区域 1：随设定任务日期和优先级打开 -->
    <div
      v-show="showTaskSetting || showTaskPriority || showTaskList || showTaskAssignSetting"
      class="modal"
      @click="() => { handleCloseTaskSettings() }"
    ></div>
    <!-- Modal 区域 2：查看任务动态 -->
    <el-dialog
      v-model="developmentVisible"
      title="任务动态"
      width="380px"
      :append-to-body="true"
    >
      <TasksDevelopment
        :taskDevelopments="subViewTask.taskOptRecords"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'
import storage from '@/utils/storage'
import TasksPrioritySetting from './TasksPrioritySetting.vue'
import TasksGeneralSetting from './TasksGeneralSetting.vue'
import TasksDevelopment from './TasksDevelopment.vue'
import request from '@/api/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Base64 } from 'js-base64'
import { clearNotifyFlag, resetTaskNotify } from '@/utils/tasksNotify'

// 状态管理仓库
const store = useStore()

// 当前路由对象,获取 listId
const route = useRoute()
// 获取 taskId
const taskId = computed(() => {
  return parseInt(route.params.taskId)  // 转换为数值类型
})

// 路由跳转对象
const router = useRouter()

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
// 选定任务所属清单信息
const subViewListInfo = ref('')

// 根据路由的 taskId 和 listId 值获取指定任务数据
const getTaskData = async () => {
  const listId = parseInt(route.params.listId)
  const listId2 = parseInt(route.params.listId2)
  let task = {}
  // 获取选定任务数据及 ID 值
  if ([0, 1, 3].includes(listId)) {
    userTasks.forEach(item => {
      if (item.taskId === taskId.value && item.listId === listId2) {
        task = item.task
        subViewTaskId.value = item.id // 获取对应任务 id 值
      }
    })
  } else if (listId === 2) {
    userTasks.forEach(doneTasks => {
      if (!doneTasks.tasks) {
        return
      }
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

  // 获取选定任务清单信息
  if ([0, 1, 2, 3].includes(listId)) {
    userLists.forEach(item => {
      if (item.listId === listId2) {
        subViewListInfo.value = item.listFlag + ' ' + item.listName
      }
    })
  } else {
    userLists.forEach(item => {
      if (item.listId === listId) {
        subViewListInfo.value = item.listFlag + ' ' + item.listName
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

  if (!task.taskDesc) {
    delete subViewTask.taskDesc
  }

  if (!task.taskFile) {
    delete subViewTask.taskFile
  }

  if (!task.taskOptRecords) {
    delete subViewTask.taskOptRecords
  }

  if (!_.isEmpty(task)) {
    Object.assign(subViewTask, task)
  } else {
    if (listId || listId2) {
      router.replace({ path: `/list/${route.params.listId}/tasks` })
    }
  }
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

  if (!subViewTask.startTaskDate && !subViewTask.taskDate) {
    return '未设定任务日期'
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
    if (typeof subViewTask.startTaskDate === 'string') {
      subViewTask.startTaskDate = new Date(parseInt(subViewTask.startTaskDate))
    }
    const startTaskDate = dayjs(subViewTask.startTaskDate)
    const startTaskTime = dayjs(subViewTask.startTaskTime)
    const day1 = startTaskDate.format('M月D日')
    const time1 = startTaskTime.format('hh:mm')
    const paFlag1 = parseInt(startTaskTime.hour()) <= 12 ? '上午' : '下午'  // 根据小时设置上下午标记
    if (!subViewTask.endTaskDate) {
      return `${day1} ${paFlag1} ${time1}-`
    } else {
      if (typeof subViewTask.endTaskDate === 'string') {
        subViewTask.endTaskDate = new Date(parseInt(subViewTask.endTaskDate))
      }
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

// 点击完成任务或还原完成任务
const handleCompleteTask = () => {
  const id = subViewTaskId.value
  const taskIdVal = taskId.value
  let listId = parseInt(route.params.listId2 || route.params.listId)
  const settingValues = {
    id,
    taskId: taskIdVal,
    listId,
    flag: 'done',
    value: subViewTask.doneFlag ? 0 : 1
  }
  if (settingValues.value) {
    settingValues.extValue = dayjs().startOf('day').valueOf() + ''  // 设置任务结束日期时间戳
  } else {
    settingValues.extValue = subViewTask.doneTime
  }
  store.dispatch('setUserTask', settingValues).then(async () => {
    router.back()
    if (settingValues.value) {
      const userName = storage.getItem('userInfo').userName
      await request.sendTaskNotice({ flag: 'done',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskIdVal})
    }
  })
}

// 任务更新后保存
const handleSaveTaskSetting = (settingTask) => {
  const id = subViewTaskId.value
  const taskIdVal = taskId.value
  let listId = parseInt(route.params.listId2 || route.params.listId)

  let quantumModeObj = null
  let dateModeObj = null
  let modeObj = null

  //* 原日期模式改为时间段模式
  if (subViewTask.taskDate && settingTask.startTaskDate) {
    subViewTask.taskDate = ''
    subViewTask.taskTime = ''

    quantumModeObj = _.pick(settingTask, [
      'startTaskDate',
      'startTaskTime',
      'endTaskDate',
      'endTaskTime',
      'notify'
    ])

    Object.assign(subViewTask, quantumModeObj)
    for (let key in quantumModeObj) {
      if (quantumModeObj[key] instanceof Date) {
        quantumModeObj[key] = quantumModeObj[key].valueOf() + ''
      } else {
        quantumModeObj[key] = quantumModeObj[key] + ''
      }
    }
    quantumModeObj.subFlag = 'quantum'  //* 子 Flag，标识修改了哪个模式下的值
  //* 原时间段模式改为日期模式
  } else if (subViewTask.startTaskDate && settingTask.taskDate) {
    subViewTask.startTaskDate = ''
    subViewTask.startTaskTime = ''
    subViewTask.endTaskDate = ''
    subViewTask.endTaskTime = ''

    dateModeObj = _.pick(settingTask, [
      'taskDate',
      'taskTime',
      'notify'
    ])

    Object.assign(subViewTask, dateModeObj)
    for (let key in dateModeObj) {
      if (dateModeObj[key] instanceof Date) {
        dateModeObj[key] = dateModeObj[key].valueOf() + ''
      } else {
        dateModeObj[key] = dateModeObj[key] + ''
      }
    }
    dateModeObj.subFlag = 'date'
  //* 未进行模式更改
  } else {
    modeObj = _.pick(settingTask, [
      'startTaskDate',
      'startTaskTime',
      'endTaskDate',
      'endTaskTime',
      'taskDate',
      'taskTime',
      'notify'
    ])

    Object.assign(subViewTask, modeObj)
    for (let key in modeObj) {
      if (modeObj[key] instanceof Date) {
        modeObj[key] = modeObj[key].valueOf() + ''
      } else {
        modeObj[key] = modeObj[key] + ''
      }
    }
    modeObj.subFlag = 'none'
  }

  handleShowTaskSetting() // 关闭任务通用设置模态框

  store.dispatch('setUserTask', {
    id,
    taskId: taskIdVal,
    listId,
    flag: 'setTaskGeneral',
    value: quantumModeObj || dateModeObj || modeObj,
    extValue: subViewTask.doneTime
  })
  .then(async () => {
    resetTaskNotify(id, Object.assign(_.cloneDeep(subViewTask), quantumModeObj || dateModeObj || modeObj))
    const userName = storage.getItem('userInfo').userName
    await request.sendTaskNotice({ flag: 'edit',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskId.value})
  })
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
  const id = subViewTaskId.value
  const taskIdVal = taskId.value
  let listId = parseInt(route.params.listId2 || route.params.listId)
  
  subViewTask.taskPriority = taskPriority

  store.dispatch('setUserTask', {
    id,
    taskId: taskIdVal,
    listId,
    flag: 'setTaskPriority',
    value: subViewTask.taskPriority,
    extValue: subViewTask.doneTime
  })
  .then(async () => {
    const userName = storage.getItem('userInfo').userName
    await request.sendTaskNotice({ flag: 'edit',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskId.value})
  })
}
/* ------------------------ */

//! 更改任务信息逻辑区域
/* ------------------------ */
// 是否正编辑任务标题
const isEditTaskInfo = ref(false)
// 是否正编辑任务描述
const isEditTaskDesc = ref(false)

// 任务标题输入框对象
const taskInfoInput = ref(null)
// 任务描述输入框对象
const taskDescInput = ref(null)

// 用户点击任务标题进行输入
const handleEditTaskInfo = async () => {
  isEditTaskInfo.value = true
  await nextTick()
  taskInfoInput.value.focus()
}

// 用户点击任务描述进行输入
const handleEditTaskDesc = async () => {
  isEditTaskDesc.value = true
  await nextTick()
  taskDescInput.value.focus()
}

// 用户结束输入任务标题和任务描述
const handleCompleteTaskEdit = async (flag) => {
  if (flag === 'taskInfo') {
    isEditTaskInfo.value = false
  } else {
    isEditTaskDesc.value = false
  }
  
  const id = subViewTaskId.value
  const taskIdVal = taskId.value
  let listId = parseInt(route.params.listId2 || route.params.listId)

  //* 任务修改标志字典
  const flagDics = {
    taskInfo: {
      action: 'setTaskInfo',
      value: subViewTask.taskInfo
    },
    taskDesc: {
      action: 'setTaskDesc',
      value: subViewTask.taskDesc
    }
  }

  store.dispatch('setUserTask', {
    id,
    taskId: taskIdVal,
    listId,
    flag: flagDics[flag].action,
    value: flagDics[flag].value,
    extValue: subViewTask.doneTime
  })
  .then(async () => {
    const userName = storage.getItem('userInfo').userName
    await request.sendTaskNotice({ flag: 'edit',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskId.value})
  })
}
/* ------------------------ */

//! 更改任务清单逻辑区域
/* ------------------------ */
// 更改任务清单设置展开/关闭状态变量
const showTaskList = ref(false)

// 更改任务清单展开
const handleShowTaskList = () => {
  let listId = parseInt(route.params.listId2 || route.params.listId)
  if (listId > 300000) {
    return
  }
  showTaskList.value = !showTaskList.value
}

// 选择了要更改到的清单
const handleSelectList = (list) => {
  const id = subViewTaskId.value
  const taskIdVal = taskId.value
  let listId = parseInt(route.params.listId2 || route.params.listId)
  ElMessageBox.confirm(
    `任务将放入${list.listName}中`,
    '确认框',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const extValue = _.cloneDeep(subViewTask)
    for (let key in extValue) {
      if (extValue[key] instanceof Date) {
        extValue[key] = extValue[key].valueOf() + ''
      }
    }

    store.dispatch('setUserTask', { 
      id,
      taskId: taskIdVal,
      listId,
      flag: 'setList',
      value: list.listId,  // value 值为用户所选清单 id 值
      extValue
    }).then(() => {
      subViewListInfo.value = list.listFlag + ' ' + list.listName

      if (!route.params.listId2 && list.listId !== listId) {
        store.commit('deleteUserTask', { id })
      }

      router.replace({ path: `/list/${route.params.listId}/tasks` })
    })
  }).catch(() => {
    return
  })
}
/* ------------------------ */

//! 删除任务（软删除）逻辑区域
/* ------------------------ */
const handleDeleteTask = () => {
  const id = subViewTaskId.value
  const taskIdVal = taskId.value
  let listId = route.params.listId2 || route.params.listId
  listId = parseInt(listId)
  ElMessageBox.confirm(
    '请确认是否删除该任务',
    '确认框',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    clearNotifyFlag(id) // 清除该任务定时器
    store.dispatch('setUserTask', { 
      id,
      taskId: taskIdVal,
      listId,
      flag: 'softDel',
      value: 1,
      extValue: subViewTask.doneTime
    }).then(async () => {
      router.back()
      const userName = storage.getItem('userInfo').userName
      await request.sendTaskNotice({ flag: 'delete',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskIdVal})
    })
  }).catch(() => {
    return
  })
}
/* ------------------------ */

//! 任务附件（上传、下载、删除、预览）相关逻辑区域
/* ------------------------ */
// 上传文件对象
const taskFile = ref(null)

//* 任务附件上传之前钩子函数
const beforeFileUpload = (file) => {
  const isLt2M = file.size / 1024 / 1024 < 2  // 文件大小检测

  if (!isLt2M) {
    ElMessage.error('文件大小不超过2M！')
    return false
  }

  taskFile.value = file

  fileUpload()

  return false  // 停止自动上传
}

//* 任务附件上传
const fileUpload = () => {
  const id = subViewTaskId.value
  let listId = parseInt(route.params.listId2 || route.params.listId)

  const formData = new FormData()
  formData.append('File', taskFile.value)

  store.dispatch('uploadUserTaskFile', {
    id,
    listId,
    taskId: taskId.value,
    formData,
    beforeFileFlag: (subViewTask.taskFile && subViewTask.taskFile.fileFlag) || 'noFile',
    extValue: subViewTask.doneTime
  })
  .then(async () => {
    ElMessage.success('上传成功')
    const userName = storage.getItem('userInfo').userName
    await request.sendTaskNotice({ flag: 'file',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskId.value})
  })
  .catch((error) => {
    console.log(`${error}`)
  })
}

//* 任务附件下载
const handleDonloadFile = () => {
  const fileFlag = subViewTask.taskFile.fileFlag
  window.open(`http://${window.location.hostname}:3000/${fileFlag}`)  //TODO 上线后改成 host（或同一写入进一个配置文件中）

  //? 以下是项目上线后的做法，href 必须是同源链接
  // let DownloadLink = document.createElement('a')
  // DownloadLink.style = 'display: none' // 创建一个隐藏的a标签
  // DownloadLink.download = fileFlag
  // DownloadLink.href = link
  // document.body.appendChild(DownloadLink)
  // DownloadLink.click() // 触发a标签的click事件
  // document.body.removeChild(DownloadLink)
}

//* 任务附件预览
const handlePreviewFile = () => {
  const fileFlag = subViewTask.taskFile.fileFlag
  const previewUrl = `http://localhost:3000/${fileFlag}`

  window.open(`http://localhost:8012/onlinePreview?url=${encodeURIComponent(Base64.encode(previewUrl))}`)
}

//* 任务附件删除
const handleDeleteFile = () => {
  const id = subViewTaskId.value
  let listId = parseInt(route.params.listId2 || route.params.listId)

  store.dispatch('deleteUserTaskFile', {
    id,
    listId,
    taskId: taskId.value,
    value: subViewTask.taskFile.fileFlag,
    extValue: subViewTask.doneTime
  })
  .then(async () => {
    ElMessage.success('删除成功')
    const userName = storage.getItem('userInfo').userName
    await request.sendTaskNotice({ flag: 'delfile',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskId.value})
  })
  .catch((error) => {
    console.log(`${error}`)
  })
}
/* ------------------------ */

//! 查看任务动态相关逻辑区域
/* ------------------------ */
// 显示任务动态 modal 标记
const developmentVisible = ref(false)

//* 查看任务动态
const handleCheckTaskDevelopment = async () => {
  let listId = parseInt(route.params.listId2 || route.params.listId)
  let res = null
  if (listId > 300000) {
    res = await request.getShareTaskDevelopment({ listId, taskId: taskId.value })
  } else {
    res = await request.getTaskDevelopments({ listId, taskId: taskId.value })
  }

  if (res && res.length > 0) {
    subViewTask.taskOptRecords = res
  }
  
  developmentVisible.value = true
}
/* ------------------------ */

//! 任务指派逻辑区域
/* ------------------------ */
// 任务指派设置模态框显示标志
const showTaskAssignSetting = ref(false)

// 是否指派人员id
const isSelectedId = ref('')

// 清单共享成员集合
const members = ref([])

watch(() => taskId.value, async () => {
  if (!taskId.value) {
    return
  }
  const listId = parseInt(route.params.listId2 || route.params.listId)
  isSelectedId.value = ''
  if (listId < 300000) {
    const assignMember = await request.getAssignMemberId({ listId, taskId: taskId.value })
    if (assignMember.userId) {
      isSelectedId.value = assignMember.userId
    }
  }
})

// 打开/关闭任务指派模态框
const handleShowTaskAssign = () => {
  showTaskAssignSetting.value = !showTaskAssignSetting.value
}

// 选中成员进行任务指派
const handleSelectMember = async (id) => {
  const listId = parseInt(route.params.listId2 || route.params.listId)

  isSelectedId.value = id

  try {
    const params = {
      userId: id,
      listId,
      taskId: taskId.value
    }
    const userName = storage.getItem('userInfo').userName
    await request.assignMemberTask(params)
    await request.sendTaskNotice({ flag: 'assign',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskId.value})
  } catch (error) {
    console.log(`${error}`)
  }
}

// 移除任务指派
const handleRemoveAssign = async () => {
  const listId = parseInt(route.params.listId2 || route.params.listId)
  
  isSelectedId.value = ''

  try {
    const params = {
      listId,
      taskId: taskId.value
    }

    const userName = storage.getItem('userInfo').userName
    await request.deleteAssignMember(params)
    await request.sendTaskNotice({ flag: 'rassign',  userName, listId, taskInfo: subViewTask.taskInfo, taskId: taskId.value})
  } catch (error) {
    console.log(`${error}`)
  }
}
/* ------------------------ */

//! 点击模态背景相关逻辑区域
/* ------------------------ */
// 是否重置任务通用设定标记
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
  } else if (showTaskAssignSetting.value) {
    handleShowTaskAssign()
  } else {
    handleShowTaskList()
  }
}
/* ------------------------ */

//! 获取任务默认值
// 获取用户设定任务相关默认值
;(async() => {
  try {
    const user = store.state.users.userInfo
    const listId = parseInt(route.params.listId2 || route.params.listId)
    const res = await request.getUserTaskDefault()  // 获取任务设定默认值
    Object.assign(timeAndDateData, res.timeAndDate)

    if (listId < 300000) {
      const shareMembersRes = await request.getShareUsers({ listId })
      shareMembersRes.forEach(item => {
        if (item._id !== user._id) {
          members.value.push(item)
        }
      })
      const assignMember = await request.getAssignMemberId({ listId, taskId: taskId.value })
      if (assignMember.userId) {
        isSelectedId.value = assignMember.userId
      }
    }    
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
    z-index: 6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .4rem;
    padding: 0 .15rem .1rem .15rem;
    width: 100%;
    box-sizing: border-box;
    box-shadow: 0px 1px 1px -1px rgb(255, 255, 255);

    &__left {
      width: 80%;
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
        width: 80%;
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
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    &__right {
      display: flex;
      align-items: center;
      text-align: right;
      margin-left: auto;
      .priorityIcon {
        font-size: .18rem;
        position: relative;
        z-index: 1000;
      }

      .memberIcon {
        font-size: .25rem;
        margin-left: .05rem;
        position: relative;
        z-index: 1000;
      }
    }

    &__taskAssign {
      position: absolute;
      z-index: 9;
      top: .28rem;
      right: .12rem;
      width: 1.2rem;
      font-size: .13rem;
      background-color: #fff;
      color: $base-fontColor;
      border-radius: .05rem;
      padding: .05rem 0 .05rem 0;

      .title {
        font-size: .14rem;
        padding: 0rem .05rem .02rem .05rem;
        border-bottom: .01rem solid rgba(228, 228, 228, 0.555);
      }

      .membersList {
        padding: .05rem .05rem .02rem .05rem;

        .notAssign {
          display: flex;
          align-items: center;
          padding: .05rem 0 .05rem .03rem;
          cursor: pointer;

          .icon {
            font-size: .17rem;
            margin-right: .03rem;
            color: $base-fontColor !important;
            position: relative;
            z-index: 1000;
          }
        }

        .member {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: .05rem 0 .05rem .03rem;
          cursor: pointer;

          .selected {
            font-size: .17rem;
            color: $base-fontColor !important;
          }
        }

        .notAssign:hover, .member:hover {
          background-color: rgba(238, 238, 238, 0.712);
          border-radius: .02rem;
        }
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

      .taskInfoInput {
        line-height: 0rem;
        
        .el-input__inner {
          font-size: .18rem;
          font-weight: bold;
          color: $base-fontColor;
          background: none;
          height: inherit;
          line-height: 0rem;
          padding: 0rem;
        }
      }
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

      .taskDescInput {
        line-height: 0rem;

        .el-textarea__inner {
          line-height: 1;
          color: $base-fontColor;
          background: none;
          border: none;
          height: inherit;
          padding: 0rem;
          resize: unset;
        }

        .el-textarea__inner::placeholder {
          color: rgb(150, 150, 150);
        }
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
      z-index: 6;
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
    z-index: 5;
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .TaskInfo {
    &__taskHeader {
      &__left {
        .date {
          box-shadow: -1.5px 0px 1px -1px rgb(48, 48, 48);

          &__Icon {
            color: rgb(48, 48, 48) !important;
          }
        }
      }

      &__right {
        .priorityIcon {
          color: rgb(48, 48, 48) !important;
        }

        .memberIcon {
          color: rgb(48, 48, 48) !important;
        }
      }

      &__taskAssign {
        box-shadow: 0px 0px 3px 1px rgba(204, 204, 204, 0.658);
      }
    }

    &__taskMain {
      &__taskFiles {
        box-shadow: 0px 0px 3px 1px rgba(204, 204, 204, 0.658);

        .fileIcon {
          color: rgb(48, 48, 48) !important;
        }

        .fileSetting {
          .fileSettingIcon {
            color: rgb(48, 48, 48) !important;
          }
        }
      }
    }

    &__taskFooter {
      &__taskList:hover {
        background: rgba(134, 134, 134, 0.2);
      }

      &__lists {
        box-shadow: 0px 0px 3px 1px rgba(204, 204, 204, 0.658);
      }

      .listItem:hover{
        background: rgba(216, 216, 216, 0.6);
      }

      &__taskSetting {
        .settingIcon {
          color: rgb(48, 48, 48) !important;
        }
      }
    }
  }
}
</style>