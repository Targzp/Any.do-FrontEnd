<!--
 * @Author: 胡晨明
 * @Date: 2022-01-28 14:25:53
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-28 22:14:28
 * @Description: 清单共享组件
-->
<template>
  <div class="ListsShare">
    <!-- 搜索框区域 -->
    <div class="ListsShare__searchBox">
      <el-input
        class="input"
        v-model="userInfo"
        placeholder="输入电子邮件或名字, 按回车键进行搜索"
        @change="handleSearchInput"
        @input="handleCheckNull"
      />
      <div
        class="ListsShare__searchBox__searchRes"
        v-if="resultFlag && usersRes.length > 0"
      >
        <div
          v-for="user in usersRes"
          :key="user._id"
          class="res"
          @click="() => handleAddUser(user)"
        >
          {{user.userName}}
        </div>
      </div>
    </div>
    <!-- 待邀请确认显示区域 -->
    <div
      class="ListsShare__membersBox"
      v-if="undeterMembers.length > 0"
    >
      <div class="ListsShare__membersBox__title">待邀请成员</div>
      <el-scrollbar height="80px">
        <div
          class="ListsShare__membersBox__memberBox"
          v-for="(member, index) in undeterMembers"
          :key="member._id"
        >
          <div class="memberInfo">
            <div class="memberName">{{member.userName}}</div>
            <div class="memberMail">{{member.userMail}}</div>
          </div>
          <el-link
            type="danger"
            :underline="false"
            class="remove"
            @click="() => handleRemoveUndeterMember(index)"
          >移除</el-link>
        </div>
      </el-scrollbar>
    </div>
    <!-- 成员显示区域 -->
    <div
      class="ListsShare__membersBox"
      v-if="members.length > 0"
    >
      <div class="ListsShare__membersBox__title">当前成员</div>
      <el-scrollbar height="100px">
        <div
          class="ListsShare__membersBox__memberBox"
          v-for="(member, index) in members"
          :key="member._id"
        >
          <div class="memberInfo">
            <div class="memberName">{{member.userName}}</div>
            <div class="memberMail">{{member.userMail}}</div>
          </div>
          <el-link
            type="danger"
            :underline="false"
            class="remove"
            v-if="member._id !== user._id"
            @click="() => { handleRemoveMember(member._id, index) }"
          >移除</el-link>
        </div>
      </el-scrollbar>
    </div>
    <!-- 用户操作区域 -->
    <div class="ListsShare__userHandle">
      <el-button
        type="info"
        plain
        class="handleBtn"
        @click="handleCancel"
      >取消</el-button>
      <el-button
        type="primary"
        class="handleBtn"
        @click="handleInviteUsers"
      >确认</el-button>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useStore } from 'vuex'
import request from '../../api/index'
import { ElMessage } from 'element-plus'
import storage from '@/utils/storage'

const store = useStore()

const props = defineProps({
  listId: {
    type: Number
  }
})
const emit = defineEmits(['handleCancel'])

//! 组件通用状态
/* ------------------------- */
// 当前所登录用户
const user = reactive({})
/* ------------------------- */

//! 用户搜索逻辑区域
/* ------------------------- */
// 用户输入用户数据
const userInfo = ref('')

// 搜索结果显示框 显示标记
const resultFlag = ref(false)

// 搜索结果
const usersRes = ref([])

//* 用户输入时进行搜索
const handleSearchInput = async (val) => {
  if (!val) {
    return
  }

  const params = { userInfo: val }

  try {
    const res = await request.searchUser(params)
    if (!_.isEmpty(res)) {
      resultFlag.value = true
      usersRes.value[0] = res
    } else {
      ElMessage.error('未找到相应用户')
    }
  } catch (error) {
    console.log(`${error}`)
  }
}

//* 用户输入检测是否为空
const handleCheckNull = (val) => {
  if (!val) {
    resultFlag.value = false
  }
}
/* ------------------------- */

//! 共享清单成员逻辑区域
/* ------------------------- */
//* 清单共享成员列表
const members = ref([])

//* 清单共享待邀请成员列表
const undeterMembers = ref([])

//* 将所搜索用户添加至待邀请确认成员列表
const handleAddUser = (user) => {
  // 检测所邀请用户是否已在待邀请列表或已加入列表中
  for (let item of undeterMembers.value) {
    if (item.userName === user.userName) {
      ElMessage.error('该成员已加入待邀请成员列表中')
      return
    }
  }
  for (let item of members.value) {
    if (item.userName === user.userName) {
      ElMessage.error('该成员已加入清单')
      return
    }
  }

  undeterMembers.value.push(user)
  resultFlag.value = false
  userInfo.value = ''
}

//* 移除待邀请确认成员
const handleRemoveUndeterMember = (index) => {
  undeterMembers.value.splice(index, 1)
}

//* 移除已邀请成员
const handleRemoveMember = async (id, index) => {
  try {
    const delParams = { userId: id, listId: props.listId }
    await request.deleteShareUser(delParams)
    store.commit('editUserListShare', { listId: props.listId, listShare: false })
    const noticeParams = { userName: user.userName,  userId: id, listId: props.listId }
    await request.sendRemoveUserNotice(noticeParams)
    members.value.splice(index, 1)
    ElMessage.success('移除用户成功')
  } catch (error) {
    console.log(`${error}`)
  }
}
/* ------------------------- */

//! 用户底部操作逻辑区域
/* ------------------------- */
//* 取消
const handleCancel = () => {
  emit('handleCancel')
}

//* 用户提交所邀请成员数据信息
const handleInviteUsers = async () => {
  const params = { userName: user.userName, listId: props.listId, inviteMembers: _.cloneDeep(undeterMembers.value) }

  try {
    if (undeterMembers.value.length > 0) {
      await request.sendInviteNotice(params)
      ElMessage.success('发送邀请成功, 请等待对方回复')
      handleCancel()
    } else {
      ElMessage.warning('未指定邀请用户')
    }
  } catch (error) {
    console.log(`${error}`)
  }
}
/* ------------------------- */

;(async () => {
  const userInfo = storage.getItem('userInfo')
  const currentUser = _.pick(userInfo, ['_id', 'userName', 'userMail'])
  Object.assign(user, currentUser)
  members.value.push(currentUser)

  const res = await request.getShareUsers({ listId: props.listId })

  if (res.length > 0) {
    res.forEach(item => {
      if (item._id !== user._id) {
        members.value.push(item)
      }
    })
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.ListsShare {
  &__searchBox {
    position: relative;
    .input {
      border-radius: .05rem;
      background: rgb(244,244,244);

      .el-input__inner::placeholder {
        color: rgb(211,211,211);
      }
    }

    &__searchRes {
      box-sizing: border-box;
      position: absolute;
      top: .36rem;
      left: .008rem;
      width: 100%;
      border-radius: 0 0 .1rem .1rem;
      background-color: #fff;
      box-shadow: 0rem 0.01rem .02rem .015rem rgba(194, 194, 194, 0.479);

      .res {
        color: $base-fontColor;
        padding: .1rem 0 .1rem .1rem;
        cursor: pointer;
      }

      .res:last-child {
        border-radius: 0 0 .1rem .1rem;
      }

      .res:hover {
        background-color: rgba(218, 218, 218, 0.5);
      }
    }
  }

  &__membersBox {
    margin-top: .15rem;

    &__title {
      margin-bottom: .05rem;
      font-size: .16rem;
      color: $base-fontColor;
    }

    &__memberBox {
      padding: 0 0 .12rem .01em;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .memberInfo {
        margin-left: .05rem;
        .memberName {
          margin-bottom: .05rem;
        }

        .memberMail {
          font-size: .12rem;
          color: $lighter-fontColor;
        }
      }

      .remove {
        margin-right: .1rem;
      }
    }
  }

  &__userHandle {
    display: flex;
    justify-content: center;
    margin-top: .15rem;
    margin-bottom: .1rem;

    .handleBtn {
      width: 1.2rem;
    }
  }
}
</style>
