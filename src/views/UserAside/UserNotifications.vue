<!--
 * @Author: 胡晨明
 * @Date: 2022-01-29 16:52:10
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-05 12:58:25
 * @Description: 用户通知栏模态框组件
-->
<template>
  <div class="Notifications">
    <el-scrollbar height="300px">
      <template v-if="userNotifications.length > 0">
        <div
          class="Notifications__notice"
          v-for="notification in userNotifications"
          :key="notification.noticeTime"
        >
          <!-- 共享邀请通知模板 -->
          <template v-if="notification.noticeFlag === 'SHARELIST'">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              邀请您加入共享清单
              <span class="shareList">{{notification.listName}}</span>
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-button
                type="danger"
                plain
                class="handleBtn"
                @click="() => { handleReject(notification) }"
              >拒绝</el-button>
              <el-button
                type="primary"
                class="handleBtn"
                @click="() => { handleAgree(notification) }"
              >接受</el-button>
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 拒绝邀请通知模板 -->
          <template v-if="notification.noticeFlag === 'REJECTSHARELIST'">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              拒绝加入共享清单
              <span class="shareList">{{notification.listName}}</span>
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 接受邀请通知模板 -->
          <template v-if="notification.noticeFlag === 'AGREESHARELIST'">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              同意加入共享清单
              <span class="shareList">{{notification.listName}}</span>
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 移除成员通知模板 -->
          <template v-if="notification.noticeFlag === 'REMOVEMEMBER'">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              将您移出共享清单
              <span class="shareList">{{notification.listName}}</span>
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 修改共享清单任务通知模板 -->
          <template v-if="['ADDTASK', 'EDITTASK', 'DELETETASK'].includes(notification.noticeFlag)">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              <span>在共享清单{{notification.listName}}中</span>
              {{taskFlags[notification.noticeFlag]}}了任务:
              <span class="shareTask">{{notification.taskInfo}}</span>
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-button
                type="primary"
                class="handleBtn"
                v-if="notification.noticeFlag !== 'DELETETASK'"
                @click="() => { handleView(notification) }"
              >查看</el-button>
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 上传共享清单任务附件通知模板 -->
          <template v-if="['ADDFILE', 'DELETEFILE'].includes(notification.noticeFlag)">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              <span>在共享清单{{notification.listName}}中为</span>
              <span class="shareTask">{{notification.taskInfo}}</span>
              {{taskFlags[notification.noticeFlag]}}了任务附件
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-button
                type="primary"
                class="handleBtn"
                @click="() => { handleView(notification) }"
              >查看</el-button>
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 完成共享清单任务通知模板 -->
          <template v-if="notification.noticeFlag === 'DONETASK'">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              <span>在共享清单{{notification.listName}}中</span>
              完成了任务:
              <span class="shareTask">{{notification.taskInfo}}</span>
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 指派任务通知模板 -->
          <template v-if="notification.noticeFlag === 'ASSIGNTASK'">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              <span>在共享清单{{notification.listName}}中</span>
              指派了任务:<span class="shareTask">{{notification.taskInfo}}</span>给你
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-button
                type="primary"
                class="handleBtn"
                v-if="notification.noticeFlag !== 'DELETETASK'"
                @click="() => { handleView(notification) }"
              >查看</el-button>
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
          <!-- 取消指派通知模板 -->
          <template v-if="notification.noticeFlag === 'REMOVEASSIGNTASK'">
            <div class="Notifications__notice__noticeTips">
              <div class="title">{{notification.userName}}</div>
              <div class="time">{{dayjs(notification.noticeTime).format('YYYY/MM/DD HH:mm')}}</div>
            </div>
            <div class="Notifications__notice__noticeInfo">
              <span>在共享清单{{notification.listName}}中</span>
              取消将任务:<span class="shareTask">{{notification.taskInfo}}</span>指派给你
            </div>
            <div class="Notifications__notice__noticeHandle">
              <el-link
                type="danger"
                :underline="false"
                class="delLink"
                @click="() => { handleDelNotification(notification.noticeFlag, notification.noticeTime) }"
              >删除</el-link>
            </div>
          </template>
        </div>
      </template>
      <el-empty v-else description="暂无通知"></el-empty>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import request from '@/api'
import storage from '@/utils/storage'

const store = useStore()

const router = useRouter()
const route = useRoute()

const emit = defineEmits(['cancel'])

//! 通用状态
/* ------------------------------- */
// 通知信息列表
const userNotifications = store.state.notice.notifications

// 清单列表
const userLists = store.state.lists.userLists

// 共享清单修改任务通知描述字典
const taskFlags = {
  ADDTASK: '添加',
  EDITTASK: '修改',
  DELETETASK: '删除',
  ADDFILE: '添加',
  DELETEFILE: '删除',
  REMOVEASSIGNTASK: '取消'
}
/* ------------------------------- */

//! 用户操作通知信息逻辑区域
/* ------------------------------- */
//* 用户拒绝共享清单邀请
const handleReject = async (notification) => {
  const userName = storage.getItem('userInfo').userName

  try {
    const params = {
      userName,
      userId: notification.userId,
      listName: notification.listName,
      noticeFlag: notification.noticeFlag,
      noticeTime: notification.noticeTime
    }
    await request.sendRejectInviteNotice(params)
    store.commit('delUserNotification', { noticeFlag: notification.noticeFlag, noticeTime: notification.noticeTime })
  } catch (error) {
    console.log(`${error}`)
  }
}

//* 用户接受共享清单邀请
const handleAgree = async (notification) => {
  const userName = storage.getItem('userInfo').userName

  try {
    const params = {
      userName,
      shareUserName: notification.userName,
      userId: notification.userId,
      listId: notification.listId,
      listName: notification.listName,
      noticeFlag: notification.noticeFlag,
      noticeTime: notification.noticeTime
    }

    const res = await request.sendAgreeInviteNotice(params)
    store.commit('delUserNotification', { noticeFlag: notification.noticeFlag, noticeTime: notification.noticeTime })
    store.commit('addUserList', res)
  } catch (error) {
    console.log(`${error}`)
  }
}

//* 查看共享清单下任务修改
const handleView = async (notification) => {
  let isShare = false
  const delParams = { noticeFlag: notification.noticeFlag, noticeTime: notification.noticeTime }

  userLists.forEach(async (list) => {
    if (list.listId === notification.listId) {
      isShare = true
      if (+route.params.listId !== notification.listId) {
        router.push({ path: `/list/${notification.listId}/tasks` })
      } else {
        const res = await request.getUserTask({
          listId: notification.listId,
          mainListId: notification.mainListId,
          taskId: notification.taskId
        })

        if (notification.noticeFlag === 'ADDTASK' || notification.noticeFlag === 'ASSIGNTASK') {
          store.commit('addUserTask', {
            id: new Date().valueOf() + notification.taskId,
            listId: notification.listId,
            taskId: notification.taskId,
            task: res
          })
        } else if (notification.noticeFlag === 'EDITTASK' || notification.noticeFlag === 'ADDFILE' || notification.noticeFlag === 'DELETEFILE') {
          store.commit('updateUserTask', {
            id: new Date().valueOf() + notification.taskId,
            listId: notification.listId,
            taskId: notification.taskId,
            task: res
          })
        }
      }
    }
  })

  if (!isShare) {
    const res = await request.getUserTask({
      listId: notification.listId,
      mainListId: notification.mainListId,
      taskId: notification.taskId
    })

    if (+route.params.listId !== notification.mainListId) {
      if (notification.noticeFlag === 'ADDTASK') {
        await store.dispatch('saveUserSyncTask', { flag: false, dbParams: { listId: notification.mainListId, taskId: notification.taskId, task: res } })
      } else if (notification.noticeFlag === 'EDITTASK' || notification.noticeFlag === 'ADDFILE' || notification.noticeFlag === 'DELETEFILE') {
        await store.dispatch('saveUserSyncUpdateTask', { flag: false, dbParams: { listId: notification.mainListId, taskId: notification.taskId, task: res } })
      }
      router.push({ path: `/list/${notification.mainListId}/tasks` })
    } else {
      if (notification.noticeFlag === 'ADDTASK') {
        store.dispatch('saveUserSyncTask', { flag: true, dbParams: { listId: notification.mainListId, taskId: notification.taskId, task: res } })
      } else if (notification.noticeFlag === 'EDITTASK' || notification.noticeFlag === 'ADDFILE' || notification.noticeFlag === 'DELETEFILE') {
        store.dispatch('saveUserSyncUpdateTask', { flag: true, dbParams: { listId: notification.mainListId, taskId: notification.taskId, task: res } })
      } 
    }
  }

  await request.deleteNotification(delParams)
  store.commit('delUserNotification', delParams)

  emit('cancel')
}

//* 删除通知信息
const handleDelNotification = async (noticeFlag, noticeTime) => {
  try {
    const params = { noticeFlag, noticeTime }
    await request.deleteNotification(params)
    store.commit('delUserNotification', params)
  } catch (error) {
    console.log(`${error}`)
  }
}
/* ------------------------------- */
</script>

<style lang="scss">
@import '@/assets/style/variables.scss';
.Notifications {
  &__notice {
    display: flex;
    flex-flow: column nowrap;
    padding-left: .08rem;
    padding-right: .12rem;
    padding-bottom: .12rem;
    border-bottom: .01rem solid rgb(230, 230, 230);
    margin-bottom: .09rem;

    &__noticeTips {
      display: flex;
      justify-content: space-between;
      margin-bottom: .05rem;

      .title {
        font-size: .15rem;
        font-weight: bold;
        color: $base-fontColor;
      }

      .time {
        font-size: .13rem;
        color: $lighter-fontColor;
      }
    }

    &__noticeInfo {
      font-size: .14rem;
      color: $base-fontColor;
      margin-bottom: .05rem;

      .shareList, .shareTask {
        color: #409EFF;
        margin-left: .05rem;
        position: relative;
        top: -.005rem;
      }
    }

    &__noticeHandle {
      display: flex;
      align-items: center;

      .handleBtn {
        min-height: .25rem;
        padding: .08rem .15rem .05rem .15rem;
      }
    }

    .delLink {
      font-size: .13rem;
      margin-left: .08rem;
    }

    .delLink:only-child {
      margin-left: 0rem;
    }
  }

  &__notice:last-child {
    border-bottom: none;
  }
}
</style>
