<!--
 * @Author: 胡晨明
 * @Date: 2021-10-12 16:12:01
 * @LastEditTime: 2021-11-11 14:50:45
 * @LastEditors: Please set LastEditors
 * @Description: 清单任务组件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\views\List\Tasks.vue
-->
<template>
  <div class="Tasks">
    <div class="Tasks__list">
      <!-- 清单任务头部区域 -->
      <div class="Tasks__list__header">
        <div>
          <span class="Tasks__list__header__shrink"><i class="el-icon-s-fold"></i></span>
          <span class="Tasks__list__header__title">📦 购物清单</span>
        </div>
        <span class="iconfont Tasks__list__header__other">&#xe618;</span>
      </div>
      <!-- 任务增加区域 -->
      <div class="Tasks__list__addTask">
        <!-- 新任务输入框 -->
        <el-input
          v-model="newTask.taskName"
          class="Tasks__list__addTask__inputTask"
          placeholder='添加任`务至 "📦 购物清单"'
        >
          <template #suffix>
            <div class="Tasks__list__addTask__taskIcons">
              <span
                class="iconfont Tasks__list__addTask__taskSettingIcon"
                @click="handleShowTaskSetting"
              >&#xe61c;</span>
              <span
                class="iconfont Tasks__list__addTask__taskPriorityIcon"
                @click="handleShowTaskPriority"
              >&#xe61d;</span>
            </div>
          </template>
        </el-input>
        <!-- 新增任务通用设置模态框 -->
        <div
          v-show="showTaskSetting"
          class="Tasks__list__addTask__taskSetting"
        >
          <v-date-picker
            v-model="date"
            trim-weeks
            class="Tasks__list__addTask__taskCalendar"
          />
          <div>TimePicker</div>
          <div>Notify</div>
          <div>Button</div>
        </div>
        <!-- 新增任务优先级设置模态框 -->
        <div
          v-show="showTaskPriority"
          class="Tasks__list__addTask__taskPriority"
        >
          <span class="Tasks__list__addTask__taskPriority__title">优先级</span>
          <div class="Tasks__list__addTask__taskPriority__icons">
            <span
              class="iconfont Tasks__list__addTask__taskPriority__icon1"
              title="高"
            >&#xe675;</span>
            <span
              class="iconfont Tasks__list__addTask__taskPriority__icon2"
              title="中"
            >&#xe674;</span>
            <span
              class="iconfont Tasks__list__addTask__taskPriority__icon3"
              title="低"
            >&#xe673;</span>
          </div>
        </div>
        <!-- 新增任务添加按钮 -->
        <el-button
          class="Tasks__list__addTask__addBtn"
        >添加</el-button>
      </div>
    </div>
    <!-- 任务细节展示区域 -->
    <div class="Tasks__detail">
      <div class="Tasks__detail__initial">Tasks__detail__initial</div>
      <router-view></router-view>
    </div>
    <!-- Modal 区域。随设定任务日期打开 -->
    <div
      v-show="showTaskSetting || showTaskPriority"
      class="Tasks__modal"
      @click="handleCloseTaskSettings"
    ></div>
  </div>
</template>

<script setup>
// 新增任务数据
const newTask = reactive({})

// 新增任务日历默认日期
const date = ref(new Date('03/02/2020'))

// 新增任务设置展开/关闭状态变量
const showTaskSetting = ref(false)

// 新增任务设置展开
const handleShowTaskSetting = () => {
  showTaskSetting.value = !showTaskSetting.value
}

// 新增任务优先级设置展开/关闭状态变量
const showTaskPriority = ref(false)

// 新增任务优先级展开
const handleShowTaskPriority = () => {
  showTaskPriority.value = !showTaskPriority.value
}

// 模态检测关闭任务通用设定还是优先级设定
const handleCloseTaskSettings = () => {
  if (showTaskSetting.value) {
    handleShowTaskSetting()
  } else {
    handleShowTaskPriority()
  }
}
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Tasks {
  display: flex;
  height: 100%;
  position: relative;

  &__list {
    flex: 3 1 auto;
    margin: .15rem 0;
    padding: 0 .15rem;
    border-right: .01rem solid rgba(223, 223, 223, 0.644);

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: .23rem;
      color: $base-fontColor;

      &__shrink {
        margin-right: .1rem;
        cursor: pointer;
        color: $icon-color;
      }
    }

    &__addTask {
      display: flex;
      align-items: center;
      margin-top: .1rem;
      position: relative;

      &__taskIcons {
        display: flex;
        align-items: center;
        margin-right: .05rem;
      }

      &__taskSettingIcon {
        font-size: .18rem;
        margin-right: .12rem;
      }

      &__taskSetting {
        position: absolute;
        top: .36rem;
        right: .05rem;
        z-index: 1;
        background-color: $base-bgColor;
        border-radius: .05rem;
        box-shadow: 0 0 .15rem .02rem rgba(196, 196, 196, 0.39);
      }

      &__taskPriorityIcon {
        font-size: .22rem;
      }

      &__taskPriority {
        padding: .08rem .1rem;
        box-sizing: border-box;
        position: absolute;
        top: .36rem;
        right: .05rem;
        z-index: 1;
        background-color: $base-bgColor;
        border-radius: .05rem;
        box-shadow: 0 0 .15rem .02rem rgba(196, 196, 196, 0.39);

        &__title {
          display: inline-block;
          color: $lighter-fontColor;
          font-size: .13rem;
          margin-bottom: .05rem;
        }

        &__icons {
          font-size: .26rem;
          display: flex;
          justify-content: center;
        }

        &__icon1 {
          color: #f25555;
          margin-right: .15rem;
        }

        &__icon2 {
          color: #ffbb44;
          margin-right: .15rem;
        }

        &__icon3 {
          color: #0888ff;
        }
      }

      &__taskCalendar {
        border: none;
        border-radius: .01rem;

        .vc-popover-content {   /* 内部年份选择器样式修改 */
          border-radius: .01rem;
        }
      }

      .el-input__inner {
        background-color: rgba(253, 253, 253, 0.315);
      }

      .el-input__inner::placeholder {
        color: $placeholder-color;
      }

      &__addBtn {
        border-radius: 0rem;
        background-color: rgba(255, 255, 255, 0.178);
      }

      &__addBtn:hover {
        background-color: rgba(255, 255, 255, 0.473);
      }

      &__addBtn:focus {
        background-color: rgba(255, 255, 255, 0.473);
      }
    }
  }

  &__detail {
    flex: 2 1 auto;
  }

  &__modal {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>