<!--
 * @Author: 胡晨明
 * @Date: 2022-02-13 20:59:58
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-16 17:04:48
 * @Description: 用户搜索组件
-->
<template>
  <div class="Search">
    <div class="Search__searchBar">
      <div class="Search__searchBar__inputAndSelect">
        <el-input class="searchInput"
          v-model="searchInfo"
          @change="handleSearch"
        />
        <el-select class="searchMode" v-model="searchMode">
          <el-option label="清单" value="list"></el-option>
          <el-option label="任务" value="task"></el-option>
        </el-select>
      </div>
      <div class="Search__searchBar__filterSelect" v-if="searchMode === 'task'">
        <el-select
          class="filterDate"
          v-model="filterDatas.filterDate"
          @change="handleSearch"
        >
          <el-option label="所有日期" value="all"></el-option>
          <el-option label="今天" value="today"></el-option>
          <el-option label="本周" value="week"></el-option>
          <el-option label="本月" value="month"></el-option>
        </el-select>
        <el-select
          class="filterList"
          v-model="filterDatas.filterList"
          @change="handleSearch"
        >
          <el-option label="所有清单" value="all"></el-option>
          <el-option
            v-for="list in userLists"
            :key="list.listId"
            :label="list.listName"
            :value="list.listId"
          ></el-option>
        </el-select>
        <el-select
          class="filterStatus"
          v-model="filterDatas.filterStatus"
          @change="handleSearch"
        >
          <el-option label="所有状态" value="all"></el-option>
          <el-option label="已完成" value="done"></el-option>
          <el-option label="未完成" value="doing"></el-option>
        </el-select>
        <el-select
          class="filterPriority"
          v-model="filterDatas.filterPriority"
          @change="handleSearch"
        >
          <el-option label="所有优先级" value="all"></el-option>
          <el-option label="高" value="high"></el-option>
          <el-option label="中" value="mid"></el-option>
          <el-option label="低" value="low"></el-option>
        </el-select>
        <el-select
          class="filterAssign"
          v-model="filterDatas.filterAssign"
          @change="handleSearch"
        >
          <el-option label="所有指派人" value="all"></el-option>
          <el-option label="指派给我" value="assignMe"></el-option>
        </el-select>
      </div>
    </div>
    <el-scrollbar v-if="searchResLists.length > 0">
      <div class="Search__searchLists">
        <div
          v-for="(item, index) in searchResLists"
          :key="index"
          class="searchRes"
          @click="() => { handleView(item) }"
        >
          <template v-if="item.listName">
            <span>{{item.listFlag}}</span>
            <span>{{item.listName}}</span>
          </template>
          <template v-else>
            <span>{{item.taskInfo}}</span>
          </template>
        </div>
      </div>
    </el-scrollbar>
    <div class="Search__searchFlag" v-else>
      <img class="img" src="../../assets/images/搜索.png" alt="搜索标志">
      <span class="tip">搜索清单、任务</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import _ from 'lodash'
import request from '../../api/index'

const router = useRouter()

const store = useStore()

// 清单列表
const userLists = store.state.lists.userLists

const emit = defineEmits(['cancel'])

// 搜索内容
const searchInfo = ref('')

// 搜索模式
const searchMode = ref('list')

// 筛选数据对象
const filterDatas = reactive({
  filterDate: 'all',
  filterList: 'all',
  filterStatus: 'all',
  filterPriority: 'all',
  filterAssign: 'all'
})

// 搜索结果列表数据
const searchResLists = ref([])

//* 用户搜索逻辑
const handleSearch = async () => {
  try {
    if (!searchInfo.value && searchMode.value === 'list') {
      searchResLists.value.splice(0, searchResLists.value.length)
      return
    }
    
    if (searchMode.value === 'list') {
      const params = { listName: searchInfo.value }

      const lists = await request.searchUserLists(params)

      searchResLists.value.splice(0, searchResLists.value.length)
      searchResLists.value.push(...lists)
    } else {
      const copyFilterDatas = _.cloneDeep(filterDatas)
      for (let key in copyFilterDatas) {
        if (copyFilterDatas[key] === 'all') {
          copyFilterDatas[key] = ''
        }
      }
      const params = {
        taskInfo: searchInfo.value,
        ...copyFilterDatas
      }
      const tasks = await request.searchUserTask(params)
      searchResLists.value.splice(0, searchResLists.value.length)
      searchResLists.value.push(...tasks)
    }
  } catch (error) {
    console.log(`${error}`)
  }
}

//* 点击对应清单、任务数据进行跳转
const handleView = (data) => {
  if (data.listName) {
    router.push({ path: `/list/${data.listId}/tasks` })
    emit('cancel')
  } else {
    router.push({ path: `/list/${data.listId}/tasks/${data.taskId}` })
    emit('cancel')
  }
}

// 获取清单列表
;(async () => {
  try {
    // 只有本地没有用户清单时再去后端请求
    if (userLists.length === 0) {
      let res = await request.getUserLists()
      store.commit('saveUserLists', res.allLists)
    }

    const listsRes = await request.getShareLists()
    if (listsRes && listsRes.length > 0) {
      store.commit('saveUserShareLists', listsRes)
    }
  } catch (error) {
    console.log(`${error}`)
  }
})()
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Search {
  display: flex;
  flex-flow: column nowrap;
  height: 3.5rem;

  &__searchBar {
    &__inputAndSelect {
      display: flex;

      .searchInput, .searchMode {
        border-radius: .05rem;
        background: rgb(244,244,244);
      }

      .searchInput {
        margin-right: .1rem;
      }

      .searchMode {
        width: 1rem;
      }
    }

    &__filterSelect {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      margin-top: .08rem;

      .el-select {
        border-radius: .05rem;
        background: rgb(244,244,244);
        width: 1.05rem;

        .el-input__inner {
          padding-left: .08rem;
          font-size: .12rem;
        }
      }
    }
  }

  &__searchLists {
    flex: 1;
    margin-top: .1rem;

    .searchRes {
      padding: .1rem .05rem;
      border-bottom: rgba(204, 204, 204, 0.514) .005rem solid;
      cursor: pointer;
    }

    .searchRes:hover {
      background: rgb(244,244,244);
    }
  }

  &__searchFlag {
    flex: 1;
    margin-top: .3rem;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    .img {
      width: 1.8rem;
    }

    .tip {
      font-size: .15rem;
      color: $lighter-fontColor;
      padding-left: .05rem;
    }
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .Search {
    &__searchBar {
      &__filterSelect {
        .el-select {
          width: .88rem;
        }
      }
    }
  }
}
</style>
