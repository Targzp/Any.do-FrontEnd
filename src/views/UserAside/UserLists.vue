<!--
 * @Author: 胡晨明
 * @Date: 2021-10-26 17:00:23
 * @LastEditTime: 2021-12-27 13:51:54
 * @LastEditors: 胡晨明
 * @Description: 用户清单界面组件
 * @FilePath: \Node.js_storee:\毕设项目\Anydo-app\src\views\UserAside\UserLists.vue
-->
<template>
    <div class="UserLists">
        <listsColumn v-model:showList="showList" title="清单">
            <template v-slot:addition>
                <div>
                  <span
                    class="iconfont UserLists__manage"
                    @click.stop="handleManageListOpen"
                  >
                    &#xe605;
                  </span>
                  <span
                    class="iconfont UserLists__add"
                    @click.stop="handleAddListOpen"
                  >
                    &#xe600;
                  </span>
                </div>
            </template>
            <template v-slot:content>
              <draggable
                v-show="showList"
                :list="userLists"
                @start="dragging = true" 
                @end="dragging = false"
                item-key="listId"
              >
                <template #item="{element}">
                  <div 
                    class="UserLists__everyList"
                    @click="() => handleListClick(element.listId)"
                  >
                    <div>
                        <span class="UserLists__pattern">{{element.listFlag}}</span>
                        <span class="UserLists__listName">{{element.listName}}</span>
                    </div> 
                  </div>
                </template>
              </draggable>
            </template>
        </listsColumn>
        <!-- 添加清单模态框 -->
        <el-dialog
            title="添加清单"
            :width="400"
            top="10%"
            v-model="addListTrigger"
            :append-to-body="true"
            :destroy-on-close="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
        >
            <el-form
                :model="addListData"
                ref="addListForm"
                :rules="addListRules"
                :hide-required-asterisk="true"
            >
                <el-form-item prop="listName" class="UserLists__inputBox">
                    <el-input
                        v-model="addListData.listName"
                        class="inputName"
                        placeholder="名称"
                    ></el-input>
                    <span
                        class="iconfont inputEmoji"
                        @click="emojiTrigger = !emojiTrigger"
                    >
                        <span v-if="!addListData.listFlag">&#xe6f6;</span>
                        <span
                            class="inputEmoji selectedEmoji"
                            v-else
                        >{{addListData.listFlag}}</span>
                    </span>
                </el-form-item>
                <div>
                    <el-form-item label-width="0px" class="UserLists__addListSubmit">
                        <el-button 
                            class="closeBtn"
                            @click="handleAddListFromResetAndClose"
                        >关闭</el-button>
                        <el-button
                            type="primary"
                            @click="handleAddListSubmit"
                        >提交</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <VuemojiPicker
                class="UserLists__emoji"
                v-show="emojiTrigger"
                :pickerStyle="VuemojiPickerStyle"
                @emojiClick="handleEmojiClick"
            />
        </el-dialog>
        <!-- 管理清单模态框 -->
        <el-dialog
            title="管理清单"
            :width="400"
            top="5%"
            v-model="manageListTrigger"
            :append-to-body="true"
            :destroy-on-close="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
        >
            <div class="UserLists__manageList">
                <div class="UserLists__manageList__listContainer">
                  <el-scrollbar>
                    <div
                        class="UserLists__manageList__listItem"
                        v-for="(list, index) in userLists"
                        :key="list.listId"
                    >
                        <span class="UserLists__pattern">{{list.listFlag}}</span>
                        <el-input
                          style="width: 80%"
                          ref="inputName"
                          class="UserLists__editListName"
                          v-if="listNameTrigger === list.listId"
                          v-model="editListData.listName"
                          @blur="() => handleEditListName(list, index)"
                        />
                        <span
                          class="UserLists__listName"
                          v-else
                        >{{list.listName}}</span>
                        <div class="UserLists__manageList__manage">
                          <span
                            class="iconfont edit"
                            @click="() => handleEditList(list)"
                            title="编辑"
                          >&#xe602;</span>
                          <span
                            class="iconfont delete"
                            @click="() => handleDeleteList(list, index)"
                            title="删除"
                          >&#xe62f;</span>
                        </div>
                    </div>
                  </el-scrollbar>
                </div>
                <div class="UserLists__manageList__closeManageList">
                  <el-button
                    type="primary"
                    class="closeBtn"
                    @click="manageListTrigger = false"
                  >关闭</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import draggable from 'vuedraggable'
import request from '../../api/index'
import listsColumn from '../../components/listsColumn.vue'
import { VuemojiPicker } from 'vuemoji-picker'
import VuemojiPickerStyle from '../../utils/emojiStyle'
import { ElMessage } from 'element-plus'

// 状态管理仓库
const store = useStore()
// 路由
const router = useRouter()

// 清单列表
const userLists = store.state.lists.userLists

// 清单拖拽标记
const dragging = ref(true)

// 清单显示状态
const showList = ref(true)

// 获取清单列表
;(async () => {
  // 只有本地没有用户清单时再去后端请求
  if (userLists.length === 0) {
    try {
      let res = await request.getUserLists()
      store.commit('saveUserLists', res.allLists)
    } catch (error) {
      console.log(`${error}`)
    }
  }
})()

// 点击相应清单查看清单任务详情
const handleListClick = (listId) => {
  router.push({ path: `/list/${listId}/tasks` })
}

// 添加清单弹框开关状态
const addListTrigger = ref(false)

// emoji 表情栏开关状态
const emojiTrigger = ref(false)

// 打开添加清单弹框
const handleAddListOpen = () => {
  addListTrigger.value = true
}

// 添加清单表单数据对象
const addListData = reactive({
  listName: '',
  listFlag: ''
})

// 添加清单表单对象
const addListForm = ref(null)

// 添加清单表单校验对象
const addListRules = {
  listName: [
    {
      required: true,
      message: '请输入清单名称'
    }
  ]
}

// 选择表情逻辑
const handleEmojiClick = (detail) => {
  const emojiUnicode = detail.emoji.unicode
  addListData.listFlag = emojiUnicode
}

// 添加清单表单重置并且关闭
const handleAddListFromResetAndClose = () => {
  addListForm.value.resetFields()
  addListData.listFlag = ''
  addListTrigger.value = false
}

// 添加清单提交逻辑
const handleAddListSubmit = () => {
  addListForm.value.validate(async (valid) => {
    if (valid) {
      try {
        let res = await request.postUserAddList(addListData)
        store.commit('addUserList', res)
        ElMessage.success('添加成功')
        handleAddListFromResetAndClose()
      } catch (error) {
        console.log(`${error}`)
      }
    }
  })
}

// 管理清单弹框开关状态
const manageListTrigger = ref(false)

// 打开管理清单弹框
const handleManageListOpen = () => {
  manageListTrigger.value = true
}

// 清单标题纯显示/可输入状态
const listNameTrigger = ref(0)

// 清单编辑目标对象
const editListData = reactive({
  index: 0,
  listId: 0,
  listName: ''
})

// 清单编辑输入框对象
const inputName = ref(null)

// 清单进行编辑
const handleEditList = async (list) => {
  listNameTrigger.value = list.listId
  editListData.listName = list.listName
  await nextTick()  // 在更改了一些数据以等待 DOM 更新后立即使用更新的 DOM
  inputName.value.focus()
}

// 清单名编辑完成
const handleEditListName = async (list, index) => {
  if (list.listName !== editListData.listName) {
    try {
      editListData.listId = list.listId
      editListData.index = index
      await request.postUserEditList(editListData)
      store.commit('editUserList', editListData)
      ElMessage.success('更改成功')
    } catch (error) {
      console.log(`${error}`)
    }
  }
  listNameTrigger.value = 0
}

// 清单删除
const handleDeleteList = async (list, index) => {
  try {
    await request.postUserDeleteList({ listId: list.listId })
    store.commit('deleteUserList', index)
    if (userLists.length === 0) {
      router.push({ path: `/list/0/tasks` })
    }
    ElMessage.success('删除成功')
  } catch (error) {
    console.log(`${error}`)
  }
}
</script>

<style lang="scss">
@import "../../assets/style/variables.scss";
.UserLists {
    padding: .15rem 0;
    margin: 0 .05rem;
    border-bottom: .01rem solid $devider-color;

    &__manage {
        font-size: .2rem;
    }

    &__add {
        font-size: .15rem;
        position: relative;
        bottom: .01rem;
    }
    
    &__everyList > div{
        padding: .1rem;
        cursor: pointer;
    }

    &__pattern {
        margin-right: .05rem;
    }

    &__listName {
        color: $base-fontColor;
    }

    &__editListName {
      width: 80%;

      .el-input__inner {
        padding: 0;
      }
    }

    .el-dialog {
        position: relative;
    }

    &__inputBox {
        position: relative;

        .inputEmoji {
            position: absolute;
            left: .08rem;
            font-size: .25rem;
            color: rgb(212, 212, 212);
        }

        .selectedEmoji {
            left: .02rem;
            font-size: .18rem;
        }

        .el-input__inner {
            padding-left: .4rem;
            box-sizing: border-box;
            background-color: #F2F6FC;
        }

        .el-input__inner::placeholder {
            color: rgba(150, 150, 150, 0.658);
        }
    }

    &__emoji {
        position: absolute;
        left: .2rem;
        top: .95rem;
    }

    &__addListSubmit {
        text-align: right;

        .closeBtn {
            border: 1px solid rgba(218, 218, 218, 0.61);
        }
    }

    &__manageList {
      &__listContainer {
        height: 3.5rem;
        overflow: auto;
      }

      &__listItem {
          position: relative;
          line-height: 50px;
          margin: 0 .1rem;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(204, 204, 204, 0.329);
      }

      &__listItem:last-child {
          border-bottom: none;
      }

      &__manage {
          position: absolute;
          top: .03rem;
          right: .05rem;

          .edit, .delete {
              font-size: .16rem;
              color: rgb(192, 192, 192);
          }

          .edit {
              margin-right: .12rem;
          }
      }

      &__closeManageList {
        margin: .1rem 0 .05rem 0;
        text-align: center;
      }
    }
}
</style>