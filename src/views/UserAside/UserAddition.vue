<!--
 * @Author: 胡晨明
 * @Date: 2021-10-30 15:38:26
 * @LastEditTime: 2022-01-27 21:10:23
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
        <!-- 搜索与通知 -->
        <div class="UserAddition__icons">
            <el-tooltip
                v-for="item in additionFunctions"
                :key="item.iconCode"
                effect="light"
                placement="bottom"
                :content="item.content"
            >
                <span
                  class="iconfont UserAddition__function"
                  v-html="item.iconCode"
                  @click="item.method"
                ></span>
            </el-tooltip>
        </div>
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
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import Cookies from '@/utils/cookies'
import config from '../../config/index'
import request from '../../api/index'
import Socket from '../../utils/websocket'
import { clearNotifyFlags } from '@/utils/tasksNotify'

// 获取 user 状态管理仓库
const store = useStore()
const userInfo = store.state.users.userInfo

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
// 同步用户清单
const handleSyncLists = async () => {
  try {
    let res = await request.getUserLists()
    store.commit('saveUserLists', res.allLists)
    ElMessage.success('同步清单成功')
  } catch (error) {
    console.log(`${error}`)
  }
}

// 附加功能集合
const additionFunctions = [
  { content: '搜索', iconCode: '&#xe630;' },
  { content: '通知', iconCode: '&#xe641;' },
  { content: '同步', iconCode: '&#xe815;', method: handleSyncLists }
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
    Cookies.removeCookies(['anydo.sid.sig', 'anydo.sid'])        //* 清空用户 cookie 值（也需调后端接口去清除后端 session）
    router.push('/login')
  }).catch(() => {
    return
  })
}
</script>

<style lang="scss">
.UserAddition {
    padding: .2rem .15rem 0 .13rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;

    &__avatar {
        cursor: pointer;
    }

    &__function {
        font-size: .23rem;
        margin-right: .1rem;
    }

    &__function:last-child {
        margin-right: 0;
    }
}
</style>