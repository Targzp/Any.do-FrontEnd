<!--
 * @Author: 胡晨明
 * @Date: 2022-02-12 19:00:10
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-28 14:03:35
 * @Description: file content
-->
<template>
  <div :class="['Chat', isHide?'Chat--spread':'']">
    <!-- 群聊主要区域 -->
    <div class="Chat__main">
      <!-- 主要区域顶部区域 -->
      <div class="Chat__main__header">
        <span
          class="Chat__main__header__shrink"
          @click="handleHideAside"
        ><i class="el-icon-s-fold"></i></span>
        <span class="Chat__main__header__listTip">当前共享清单</span>
        <el-select class="Chat__main__header__shareLists" v-model.number="shareListsInfo">
          <template
            v-for="list in userLists"
            :key="list.listId"
          >
            <el-option
            v-if="list.listShare || (list.listShareIds && list.listShareIds.length > 0)"
            :label="list.listName"
            :value="list.listId"></el-option>
          </template>
        </el-select>
      </div>
      <!-- 主要区域聊天数据区域 -->
      <el-scrollbar>
        <div class="Chat__main__chatDatas">
          <template
            v-for="chatData in chatDatas"
            :key="chatData.chatTime"
          >
            <div
              v-if="chatData.listId === shareListsInfo || chatData.mainListId === shareListsInfo"
              :class="['Chat__main__chatDatas__chatData', chatData.userName === userName?'Chat__main__chatDatas__chatData--right':'']"
            >
              <div class="chatTitle">
                <span>{{chatData.userName}}</span>
                <span>{{dayjs(chatData.chatTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
              </div>
              <div
                :class="['chatContent', chatData.userName === userName?'chatContent--right':'']"
              >{{chatData.chatContent}}</div>
            </div>
          </template>
        </div>
      </el-scrollbar>
      <!-- 主要区域发送信息区域 -->
      <div class="Chat__main__chatInput">
        <el-input
          v-model="sendInfo"
          type="textarea"
          :autosize="{ minRows: 8 }"
          resize="none"
        ></el-input>
        <el-button
          class="Chat__main__chatInput__sendBtn"
          @click="handleSend"
        >发送</el-button>
      </div>
    </div>
    <!-- 群聊侧边成员栏区域 -->
    <div class="Chat__aside">
      <!-- 侧边顶部区域 -->
      <div class="Chat__aside__header">
        <span>成员列表</span>
      </div>
      <!-- 侧边成员列表区域 -->
      <div class="Chat__aside__membersList">
        <div
          class="Chat__aside__membersList__member"
          v-for="member in membersList"
          :key="member.userId"
        >
          <div class="userInfo">
            <span>{{member.userName}}</span>
            <span>{{member.userMail}}</span>
          </div>
          <!-- <span :class="['iconfont', 'icon', member.online?'icon--online':'icon--offline']">&#xe660;</span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import dayjs from 'dayjs'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import storage from '@/utils/storage'
import request from '../../api/index'

const store = useStore()

const isHide = computed(() => {
  return store.state.aside.isHide
})

const handleHideAside = () => {
  store.commit('changeIsHide')
}

// 当前登录用户数据
const { _id, userName, userMail } = storage.getItem('userInfo')

// 共享清单成员列表集合
const membersList = ref([
  {
    userId: _id,
    userName,
    userMail,
  }
])

// 获取清单列表
const userLists = store.state.lists.userLists

// 所选共享清单 ID
const shareListsInfo = computed(() => {
  for (let list of userLists) {
    if (list.listShare || (list.listShareIds && list.listShareIds.length > 0)) {
      return list.listId
    }
  }
})

//* 根据共享清单 ID 变化获取共享清单成员信息
watch(() => shareListsInfo.value, async (val) => {
  try {
    const res = await request.getShareUsers({ listId: val })
    if (res && res.length > 0) {
      membersList.value.splice(1, membersList.value.length)
      res.forEach(item => {
        if (item.userName !== userName) {
          const member = {
            userId: item._id,
            userName: item.userName,
            userMail: item.userMail
          }

          membersList.value.push(member)
        }
      })
    }
  } catch (error) {
    console.log(`${error}`)
  }
}, { immediate: true })

// 聊天数据
const chatDatas = store.state.chat.chatDatas

// 发送数据
const sendInfo = ref('')

//* 发送信息逻辑
const handleSend = async () => {
  if (!sendInfo.value) {
    ElMessage.warning('请输入聊天内容')
    return
  }
  try {
    const params = {
      listId: shareListsInfo.value,
      userName,
      chatContent: sendInfo.value,
      chatTime: new Date().valueOf()
    }

    await request.sendChatData(params)
    sendInfo.value = ''
  } catch (error) {
    console.log(`${error}`)
  }
}
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Chat {
  height: 100%;
  font-size: .16rem;
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: .02rem;
  transition: all .5s ease;

  &--spread {
    margin-left: -2.7rem;
  }

  &__main {
    flex: 2;
    box-shadow: 1px 0px 1px -1px rgb(255, 255, 255);
    display: flex;
    flex-flow: column nowrap;

    &__header {
      display: flex;
      align-items: center;
      height: .45rem;
      padding: .1rem;
      background: rgba(255, 255, 255, 0.1);
      box-sizing: border-box;
      position: relative;
      z-index: 10;

      &__shrink {
        font-size: .23rem;
        cursor: pointer;
        color: $icon-color;
      }

      &__listTip {
        font-size: .15rem;
        font-weight: bold;
        margin-left: .1rem;
        position: relative;
        color: $base-fontColor;
      }

      &__shareLists {
        margin-left: .1rem;
        width: 1rem;

        .el-input {
          height: .3rem;
          line-height: .3rem;
        }

        .el-input__inner {
          height: .3rem;
          padding-left: .08rem;
        }

        .el-input__icon {
          line-height: .3rem;
        }
      }
    }

    &__chatDatas {
      flex: 1;
      display: flex;
      flex-flow: column;

      &__chatData {
        margin: .1rem .1rem .1rem .15rem;

        .chatTitle {
          display: flex;
          align-items: center;
          span:first-child {
            font-size: .14rem;
            color: $base-fontColor;
            margin-right: .08rem;
          }

          span:last-child {
            font-size: .12rem;
            color: rgba(240, 240, 240, 0.925);
          }
        }

        .chatContent {
          margin-top: .05rem;
          width: fit-content;
          padding: .1rem;
          font-size: .13rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: .1rem;

          &--right {
            margin-right: 0;
            margin-left: auto;
          }
        }

        &--right {
          align-self: flex-end;
        }
      }
    }

    &__chatInput {
      height: 1.8rem;
      position: relative;
      z-index: 10;

      &__sendBtn {
        position: absolute;
        right: .15rem;
        bottom: .15rem;
        width: .8rem;
      }

      .el-textarea__inner {
        padding-top: .1rem;
        border: none;
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__aside {
    flex: 1;
    display: flex;
    flex-flow: column nowrap;

    &__header {
      display: flex;
      align-items: center;
      padding-left: .1rem;
      height: .45rem;
      font-size: .15rem;
      font-weight: bold;
      color: $base-fontColor;
      background: rgba(255, 255, 255, 0.1);
    }

    &__membersList {
      flex: 1;
      padding: .1rem;

      &__member {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .06rem;

        .userInfo {
          span:first-child {
            font-size: .14rem;
            color: $base-fontColor;
            margin-right: .03rem;
          }

          span:last-child {
            font-size: .12rem;
            color: $lighter-fontColor;
          }
        }

        .icon {
          font-size: .12rem;
          position: relative;
          top: .04rem;

          &--online {
            color: #61e978;
          }

          &--offline {
            color: #c7c7c7;
          }
        }
      } 
    }
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .Chat {
    &--spread {
      margin-left: 0;
    }
  }
}
</style>