<!--
 * @Author: 胡晨明
 * @Date: 2021-10-30 15:38:26
 * @LastEditTime: 2022-03-13 23:16:46
 * @LastEditors: 胡晨明
 * @Description: 用户附加功能区域组件
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\views\UserAside\UserAddition.vue
-->
<template>
    <div class="UserAddition">
        <!-- 用户头像及下拉菜单 -->
        <div>
            <el-dropdown
            size="medium"
            trigger="click"
            >
                <div class="UserAddition__avatar">
                    <el-avatar v-if="avatar!=' '" shape="square" :size="35" fit="fill" :src="avatar"></el-avatar>
                    <i v-else class="el-icon-s-custom avatar-uploader-icon"></i>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item icon="el-icon-setting" @click="router.push('/setting')">账户设置</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-set-up" @click="router.push('/customSetting')">功能设置</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-switch-button" @click="handleLoginOut">退出登录</el-dropdown-item>
                        <el-dropdown-item icon="el-icon-question" @click="feedbackTrigger=true">反馈建议</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <!-- 搜索与通知模态框 -->
        <div class="UserAddition__icons">
          <el-tooltip
            v-for="item in additionFunctions"
            :key="item.iconCode"
            effect="light"
            placement="bottom"
            :content="item.content"
          >
            <el-badge
              class="badge"
              v-if="item.content === '通知'"
              :is-dot="isNotice"
            >
              <span
                class="iconfont UserAddition__notification"
                v-html="item.iconCode"
                @click="item.method"
              ></span>
            </el-badge> 
            <span
              v-else
              class="iconfont UserAddition__function"
              v-html="item.iconCode"
              @click="item.method"
            ></span>
          </el-tooltip>
        </div>
        <!-- 反馈与建议模态框 -->
        <el-dialog
            title="反馈与建议"
            :width="350"
            top="10%"
            center
            v-model="feedbackTrigger"
            :append-to-body="true"
            :destroy-on-close="true"
            @closed="handleFeedbackFormReset"
        >
            <el-form
                :model="feedbackData"
                ref="feedbackForm"
                :rules="feedbackRules"
                label-position="top"
                label-width="150px"
                :hide-required-asterisk="true"
            >
                <el-form-item label="描述你的问题：" prop="advice">
                    <el-input v-model="feedbackData.advice" type="textarea"></el-input>
                </el-form-item>
                <div>
                    <el-form-item label-width="0px" class="UserAside__feedbackSubmit">
                        <el-button @click="handleFeedbackSubmit">提交</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
        <!-- 通知模态框 -->
        <el-dialog
          title="通知"
          :width="400"
          center
          v-model="noticeTrigger"
          :append-to-body="true"
          :destroy-on-close="true"
        >
          <UserNotifications
            @cancel="handleCloseNotificatin"
          />
        </el-dialog>
        <!-- 搜索模态框 -->
        <el-dialog
          title="搜索"
          :width="600"
          v-model="searchTrigger"
          :append-to-body="true"
          :destroy-on-close="true"
          :fullscreen="isLessThan1100"
        >
          <UserSearch
            @cancel="handleCloseSearch"
          />
        </el-dialog>
        <!-- 成就模态框 -->
        <el-dialog
          title="成就"
          :width="600"
          v-model="achievementTrigger"
          :append-to-body="true"
          :destroy-on-close="true"
          :fullscreen="isLessThan1100"
        >
          <UserAchievement
            :scores="achievementScores"
            :scoreByDay="scoreByDay"
          />
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import _ from 'lodash'
import Cookies from '@/utils/cookies'
import config from '../../config/index'
import request from '../../api/index'
import Socket from '../../utils/websocket'
import { clearNotifyFlags } from '@/utils/tasksNotify'
import { clearDailyNotifyFlags } from '@/utils/dailyNotify'
import UserNotifications from './UserNotifications.vue'
import UserSearch from './UserSearch.vue'
import UserAchievement from './UserAchievement.vue'

// 获取 user/notice 状态管理仓库
const store = useStore()
const userInfo = store.state.users.userInfo
const notifications = store.state.notice.notifications
const isLessThan1100 = computed(() => {
  return store.state.aside.isLessThan1100
})

// 路由对象
const router = useRouter()

// 图片路径
const avatar = computed(() => {
  const { userAvatar } = userInfo
  if (userAvatar && userAvatar !== ' ') {
    return `http://localhost:${config.port}/${userAvatar}`    /* TODO:上线后可更改为相对路径 */
  } else {
    return ' '
  }
})

//TODO 同步问题暂时搁置，暂时先从后端获取
// 同步用户清单和用户任务
const handleSync = async () => {
  try {
    let res = await request.getUserLists()
    store.commit('saveUserLists', res.allLists)
    const listsRes = await request.getShareLists()
    if (listsRes && listsRes.length > 0) {
      store.commit('saveUserShareLists', listsRes)
    }
    ElMessage.success('同步清单成功')
  } catch (error) {
    console.log(`${error}`)
  }
}

// 是否显示通知小红点标记
const isNotice = computed(() => {
  if (notifications.length > 0) {
    return true
  } else {
    return false
  }
})

// 显示通知模态框标记
const noticeTrigger = ref(false)

//* 打开通知栏模态框
const handleOpenNotification = () => {
  noticeTrigger.value = true
}

//* 关闭通知栏模态框
const handleCloseNotificatin = () => {
  noticeTrigger.value = false
}

// 显示搜索模态框表标记
const searchTrigger = ref(false)

//* 打开搜索模态框
const handleOpenSearch = () => {
  searchTrigger.value = true
}

//* 关闭搜索模态框
const handleCloseSearch = () => {
  searchTrigger.value = false
}

// 总成就值数据
const achievementScores = ref(0)

// 近五日成就值数据集合
const scoreByDay = ref([])

// 显示成就模态框标记
const achievementTrigger = ref(false)

//* 打开成就模态框
const handleOpenAchievement = () => {
  achievementTrigger.value = true
}

// 附加功能集合
const additionFunctions = [
  { content: '搜索', iconCode: '&#xe630;', method: handleOpenSearch },
  { content: '通知', iconCode: '&#xe641;', method: handleOpenNotification },
  { content: '同步', iconCode: '&#xe815;', method: handleSync },
  { content: '成就', iconCode: '&#xe6d8;', method: handleOpenAchievement }
]

// 反馈表状态
const feedbackTrigger = ref(false)

// 反馈表数据
const feedbackData = reactive({})

// 反馈表对象
const feedbackForm = ref(null)

// 反馈表校验对象
const feedbackRules = {
  advice: [
    {
      required: true,
      message: '请输入你的问题',
      trigger: 'blur'
    },
    {
      pattern: /^(?!(\s+$))/,
      message: '输入有误，不能为全空格',
      trigger: 'change'
    }
  ]
}

// 反馈表单重置
const handleFeedbackFormReset = () => {
  feedbackForm.value.resetFields()
}

// 提交用户反馈
const handleFeedbackSubmit = () => {
  feedbackForm.value.validate(async (valid) => {
    if (valid) {
      try {
        await request.postUserAdvice({ advice: feedbackData.advice })
        ElMessage.success('提交成功')
        feedbackTrigger.value = false
        handleFeedbackFormReset()
      } catch (error) {
        console.log(`${error}`)
      }
    }
  })
}

// 退出登录
const handleLoginOut = () => {
  ElMessageBox.confirm('请确认是否退出登录', '确认框', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    type: 'warning',
  }).then(async () => {
    store.commit('saveUserInfo', null)  //* 清空用户信息
    store.commit('clearUserList')       //* 清空用户清单列表
    await store.dispatch('clearUserTask')     //* 清空用户任务列表
    Socket.closeWebSocket()   //* 关闭 webSocket 连接
    clearNotifyFlags()        //* 清除任务定时器
    clearDailyNotifyFlags()   //* 清除每日提醒定时器
    Cookies.removeCookies(['anydo.sid.sig', 'anydo.sid'])        //* 清空用户 cookie 值（也需调后端接口去清除后端 session）
    router.push('/login')
  }).catch(() => {
    return
  })
}

;(async () => {
  try {
    const NotifyRes = await request.getNotifications()  //* 获取用户通知数据

    if (!_.isEmpty(NotifyRes)) {
      store.commit('saveUserNotifications', NotifyRes.notifications)
    }

    const AchieveRes = await request.getUserAchievements()  //* 获取用户成就值数据
    if (!_.isEmpty(AchieveRes)) {
      achievementScores.value = AchieveRes.achievementScores

      for (let key in AchieveRes.scoreByDay) {
        scoreByDay.value.push(AchieveRes.scoreByDay[key])
      }
    }
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
.UserAddition {
    padding: .2rem .15rem 0 .13rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;

    &__icons {
      .badge {
        margin-right: .1rem;
        position: relative;
        top: -.04rem;
      }
    }

    &__avatar {
        cursor: pointer;
    }

    &__notification {
      font-size: .23rem;
    }

    &__function {
        font-size: .23rem;
        margin-right: .1rem;
    }

    &__function:last-child {
        margin-right: 0;
    }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .UserAddition {
    &__function, &__notification {
      color: rgb(48, 48, 48) !important;
    }
  }
}
</style>