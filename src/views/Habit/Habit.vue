<!--
 * @Author: 胡晨明
 * @Date: 2022-02-10 17:48:11
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-02 10:53:21
 * @Description: 习惯打卡页面组件
-->
<template>
  <div :class="['Habit', isHide?'Habit--spread':'']">
    <!-- 习惯打卡顶部区域 -->
    <div class="Habit__header">
      <span
        class="Habit__header__shrink"
        @click="handleHideAside"
      ><i class="el-icon-s-fold"></i></span>
      <div class="Habit__header__handleBtns">
        <el-button
          plain
          round
          size="small"
          @click="handleViewInsHabits"
        >坚持中</el-button>
        <el-button
          plain
          round
          size="small"
          @click="handleViewDoneHabits"
        >已归档</el-button>
      </div>
      <div class="Habit__header__add">
        <span
          class="iconfont Habit__header__add__icon1"
          @click="handleRefreshHabits"
        >&#xe68c;
        </span>
        <span
          class="iconfont Habit__header__add__icon2"
          @click="handleOpenAddHabit"
        >&#xe600;</span>
      </div>
      <!-- 新建习惯打卡模态框 -->
      <el-dialog
        v-model="addHabitTrigger"
        title="添加习惯"
        :width="350"
        :append-to-body="true"
        :destroy-on-close="true"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <div class="Habit__addHabit">
          <div class="item Habit__addHabit__habitName">
            <span class="itemLabel">习惯名称 :</span>
            <el-input v-model="newHabitData.habitName" placeholder="每天进步一点点"/>
          </div>
          <div class="item Habit__addHabit__habitFre">
            <span class="itemLabel">频率 :</span>
            <div class="Habit__addHabit__habitFre__freInput">
              <span>每</span>
              <el-input v-model.number="newHabitData.habitFre"/>
              <span>天</span>
            </div>
          </div>
          <div class="item Habit__addHabit__habitIns">
            <span class="itemLabel">坚持天数 :</span>
            <div class="Habit__addHabit__habitIns__insInput">
              <el-input v-model.number="newHabitData.habitIns"/>
              <span>天</span>
            </div>
          </div>
          <div class="item Habit__addHabit__habitNotify">
            <span class="itemLabel Habit__addHabit__habitNotify__label">提醒时间 :</span>
            <div class="Habit__addHabit__habitNotify__notifyTime">
              <el-time-picker
                v-model="newHabitData.notifyTime"
                placeholder="提醒时间"
                class="notifyTimeSetting"
                :format="'HH:mm'"
                :disabled="disableNotifyTime"
              >
              </el-time-picker>
              <el-checkbox
                class="Habit__addHabit__habitNotify__notNotify"
                @change="handleDisableNotifyTime"
              >不设置提醒时间</el-checkbox>
            </div>
          </div>
          <div class="Habit__addHabit__btns">
            <el-button
              type="info"
              plain
              @click="handleCloseAddHabit"
            >取消</el-button>
            <el-button
              type="primary"
              plain
              @click="handleConfirmAdd"
            >确认</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 习惯打卡列表区域 -->
    <div class="Habit__main">
      <div
        class="Habit__main__flag"
        v-if="!loading && ((mode && habitsData.length === 0) || (!mode && doneHabitsData.length === 0))"
      >
        <span class="iconfont Habit__main__flag__icon">&#xe60a;</span>
        <span class="Habit__main__flag__tips">来一起养成习惯吧!</span>
      </div>
      <el-scrollbar>
        <!-- 坚持中打卡数据列表 -->
        <div
          class="Habit__main__habits"
          v-if="mode && habitsData.length > 0"
        >
          <div
            class="Habit__main__habits__item"
            v-for="(habit, index) in habitsData"
            :key="habit.habitId"
          >
            <div class="habitInfo">
              <span>{{habit.habitName}}</span>
              <span>共坚持了{{habit.insistDays || 0}}天</span>
            </div>
            <div class="habitHandle">
              <el-button
                @click="() => { handleClockInOut(habit, index) }"
              >
                <span 
                  class="iconfont star"
                  v-if="habit.insistTimeRecords && habit.insistTimeRecords.length > 0 && dayjs(habit.insistTimeRecords[habit.insistTimeRecords.length - 1]).isToday()"
                >&#xe870;</span>
                <span v-else>打卡</span>
              </el-button>
              <el-dropdown trigger="click">
                <span class="iconfont">&#xe618;</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="() => { handleViewHabitStatistics(habit) }"
                    >概览</el-dropdown-item>
                    <el-dropdown-item
                      @click="() => { handleEditHabit(habit, 'edit') }"
                    >编辑</el-dropdown-item>
                    <el-dropdown-item
                      @click="() => { handleDeleteHabit(habit, index) }"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <el-dialog
            v-model="habitDataTrigger"
            title="打卡数据概览"
            :width="350"
            :append-to-body="true"
            :destroy-on-close="true"
            :show-close="false"
          >
            <div class="Habit__itemStatistics">
              <div class="item">
                <span class="item__num">{{habitStatisticsData.habitClockTotal}}</span>
                <span class="item__tip">总打卡</span>
              </div>
              <div class="item">
                <span class="item__num">{{habitStatisticsData.habitHighContinuity}}</span>
                <span class="item__tip">最高连续</span>
              </div>
              <div class="item">
                <span class="item__num">{{habitStatisticsData.habitCurrentContinuity}}</span>
                <span class="item__tip">当前连续</span>
              </div>
              <div class="item">
                <span class="item__num">{{habitStatisticsData.toDoneDays}}</span>
                <span class="item__tip">距离达成</span>
              </div>
            </div>
          </el-dialog>
        </div>
        <!-- 已归档打卡数据列表 -->
        <div
          class="Habit__main__doneHabits"
          v-if="!mode && doneHabitsData.length > 0"
        >
          <div
            class="Habit__main__doneHabits__item"
            v-for="(doneHabit, index) in doneHabitsData"
            :key="doneHabit.id"
          >
            <div class="doneHabitInfo">
              <span>{{doneHabit.habitName}}</span>
              <div class="doneHabitInfo__right">
                <span class="doneHabitInfo__right__time">归档时间: {{dayjs(+doneHabit.doneTime).format('YYYY-MM-DD')}}</span>
                <el-link
                  type="danger" 
                  :underline="false"
                  @click="() => { handleDeleteDoneHabit(doneHabit, index) }"
                >删除</el-link>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElLoading } from 'element-plus'
import request from '../../api/index'
import _ from 'lodash'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import habitsNotify, {
  setNewHabitNotify,
  resetHabitNotify,
  clearNotifyFlag,
  clearHabitsNotifyFlags
} from '@/utils/habitsNotify'
dayjs.extend(isToday)

const store = useStore()

const isHide = computed(() => {
  return store.state.aside.isHide
})

const handleHideAside = () => {
  store.commit('changeIsHide')
}

// 列表 loading 状态
const loadingInstance = ref(null)
const loading = ref(false)

// 打卡数据模式切换标记
// true 为坚持中 false 为已归档
const mode = ref(true)

// 习惯打卡数据集合
const habitsData = ref([])

//* 查看坚持中打卡列表
const handleViewInsHabits = () => {
  mode.value = true
}

// 添加习惯数据对象
const newHabitData = reactive({})

// 添加习惯模态框显示标记
const addHabitTrigger = ref(false)

//* 打开添加习惯模态框
const handleOpenAddHabit = (flag = 'add') => {
  if (flag !== 'edit') {
    // 清空属性
    for (let key in newHabitData) {
      delete newHabitData[key]
    }

    const options = {
      habitName: '',  // 习惯名称
      habitFre: 1,    // 习惯频率
      habitIns: '',   // 习惯坚持天数
      notifyTime: '',  // 提醒时间
      insistDays: 0,  // 当前已坚持天数
    }

    Object.assign(newHabitData, options)
  }

  addHabitTrigger.value = true
}

//* 关闭添加习惯模态框
const handleCloseAddHabit = () => {
  newHabitData.habitName = ''
  newHabitData.habitFre = 1
  newHabitData.habitIns = ''
  newHabitData.notifyTime = ''
  disableNotifyTime.value = false
  addHabitTrigger.value = false
}

// 提醒时间禁用标记
const disableNotifyTime = ref(false)

//* 禁用提醒时间逻辑
const handleDisableNotifyTime = (val) => {
  newHabitData.notifyTime = ''
  disableNotifyTime.value = val
}

//* 确认添加习惯逻辑
const handleConfirmAdd = async () => {
  const habitData = _.cloneDeep(newHabitData)
  let resHabitData = null

  if (!habitData.habitName) {
    ElMessage.warning('请输入习惯名称')
  } else if (!habitData.habitFre) {
    ElMessage.warning('请输入频率')
  } else if (!habitData.habitIns) {
    ElMessage.warning('请输入坚持天数')
  }

  if (habitData.notifyTime) {
    habitData.notifyTime = dayjs(habitData.notifyTime).second(0).valueOf()
  }

  try {
    if (habitData.clockFlag) {
      delete habitData.clockFlag
    }

    // 如果有 habitId 说明是编辑操作
    if (habitData.habitId) {
      resHabitData = await request.editUserHabitData({ habitData })

      habitsData.value.forEach((item, index) => {
        if (item.habitId === habitData.habitId) {
          // 如果设定坚持天数小于等于已坚持天数，则习惯达成
          if (habitData.habitIns <= habitData.insistDays) {
            habitsData.value.splice(index, 1)
            ElMessage.success('习惯达成!')
            return
          } else {
            habitsData.value[index] = resHabitData
          }
        }
      })

      resetHabitNotify(resHabitData.habitId, resHabitData)  // 为编辑后的打卡数据设定提醒定时器
    } else {
      resHabitData = await request.addUserHabitData({ habitData })
      habitsData.value.push(resHabitData)

      setNewHabitNotify(resHabitData.habitId, resHabitData) // 为新打卡数据设定提醒定时器
    }
  } catch (error) {
    console.log(`${error}`)
  }

  // 如果 mode 为已归档，跳转至 坚持中
  if (!mode.value) {
    mode.value = true
  }

  handleCloseAddHabit()
}

//* 确认/取消打卡逻辑
const handleClockInOut = async (habit, index) => {
  let clockFlag
  if (habit.insistTimeRecords && habit.insistTimeRecords.length > 0 && dayjs(habit.insistTimeRecords[habit.insistTimeRecords.length - 1]).isToday()) {
    clockFlag = true
  } else {
    clockFlag = habit.clockFlag
  }

  if (habit.insistDays > 0) {
    if (!clockFlag) {
      habit.insistDays++
    } else {
      habit.insistDays--
    }
  } else {
    if (!clockFlag) {
      habit.insistDays = 1
    }
  }

  try {
    let newInsistTime = ''
    if (habit.insistTimeRecords && habit.insistTimeRecords.length > 0) {
      newInsistTime = habit.insistTimeRecords[habit.insistTimeRecords.length - 1]
    }
    const params = {
      habitId: habit.habitId,
      habitIns: habit.habitIns,
      insistDays: habit.insistDays,
      clockValue: !clockFlag,
      insistTime: !clockFlag?'':newInsistTime
    }
    const resHabit = await request.clockUserHabit(params)

    habitsData.value.forEach((item, index) => {
      if (item.habitId === resHabit.habitId) {
        habitsData.value[index] = resHabit
        habitsData.value[index].clockFlag = !habit.clockFlag

        if (habitsData.value[index].clockFlag) {
          clearNotifyFlag(resHabit.habitId)
        } else {
          setNewHabitNotify(resHabit.habitId, resHabit)
        }
      }
    })
    
    if (habit.insistDays === habit.habitIns) {
      habitsData.value.splice(index, 1)
      clearNotifyFlag(resHabit.habitId)
      ElMessage.success('习惯达成!')
      return
    }

    if (!clockFlag) {
      ElMessage.success('打卡成功! 奖励你一颗小星星~')
    }
  } catch (error) {
    console.log(`${error}`)
  }
}

//* 编辑打卡数据
const handleEditHabit = (habit, flag) => {
  Object.assign(newHabitData, habit)

  if (newHabitData.notifyTime) {
    newHabitData.notifyTime = new Date(newHabitData.notifyTime)
  }

  handleOpenAddHabit(flag)
}

//* 删除打卡数据
const handleDeleteHabit = async (habit, index) => {
  try {
    await request.deleteUserHabitData({ habitId: habit.habitId })
    habitsData.value.splice(index, 1)
    clearNotifyFlag(habit.habitId)
  } catch (error) {
    console.log(`${error}`)
  }

  ElMessage.success('删除成功')
}

// 打卡数据概览模态框显示标记
const habitDataTrigger = ref(false)

// 打卡数据对象
const habitStatisticsData = reactive({})

//* 查看打卡数据概览
const handleViewHabitStatistics = async (habit) => {
  try {
    const res = await request.getUserHabitStatistics({ habitId: habit.habitId })
    if (res) {
      Object.assign(habitStatisticsData, res)
    }
  } catch (error) {
    console.log(`${error}`)
  }
  habitDataTrigger.value = true
}

// 已归档习惯打卡数据集合
const doneHabitsData = ref([])

//* 查看已归档打卡数据列表
const handleViewDoneHabits = async () => {
  try {
    loadingInstance.value = ElLoading.service({
      target: document.querySelector('.Habit__main'),
      fullscreen: false,
      background: 'rgba(255, 255, 255, 0)'
    })
    loading.value = true

    const res = await request.getUserDoneHabitsData()
    
    if (res && res.length > 0) {
      doneHabitsData.value.splice(0, doneHabitsData.value.length)
      doneHabitsData.value.push(...res)
    }

    nextTick(() => {
      loadingInstance.value.close()
      loading.value = false
    })
  } catch (error) {
    console.log(`${error}`)
  }

  mode.value = false
}

//* 删除已归档打卡数据
const handleDeleteDoneHabit = async (doneHabit, index) => {
  try {
    await request.deleteUserHabitData({ habitId: doneHabit.habitId })
    doneHabitsData.value.splice(index, 1)
  } catch (error) {
    console.log(`${error}`)
  }

  ElMessage.success('删除成功')
}

//* 刷新习惯打卡数据（坚持中或已归档）
const handleRefreshHabits = async () => {
  try {
    loadingInstance.value = ElLoading.service({
      target: document.querySelector('.Habit__main'),
      fullscreen: false,
      background: 'rgba(255, 255, 255, 0)'
    })
    loading.value = true
    if (mode) {
      clearHabitsNotifyFlags()

      const res = await request.getUserHabitsData()

      if (res && res.length > 0) {
        const notifyHabitsData = []
        habitsData.value.splice(0, habitsData.value.length)

        habitsData.value.push(...res)

        habitsData.value.forEach(item => {
          if (item.insistTimeRecords && item.insistTimeRecords.length > 0 && dayjs(item.insistTimeRecords[item.insistTimeRecords.length - 1]).isToday()) {
            return
          }

          notifyHabitsData.push(item)
        })
        habitsNotify(notifyHabitsData)  // 给当前未打卡的习惯设定提醒定时器
      }
    } else {
      const res = await request.getUserDoneHabitsData()
    
      if (res && res.length > 0) {
        doneHabitsData.value.splice(0, doneHabitsData.value.length)
        doneHabitsData.value.push(...res)
      }
    }

    nextTick(() => {
      loadingInstance.value.close()
      loading.value = false
    })
  } catch (error) {
    console.log(`${error}`)
  }
}

onMounted(async () => {
  loadingInstance.value = ElLoading.service({
    target: document.querySelector('.Habit__main'),
    fullscreen: false,
    background: 'rgba(255, 255, 255, 0)'
  })
  loading.value = true

  try {
    const res = await request.getUserHabitsData()

    if (res && res.length > 0) {
      const notifyHabitsData = []
      habitsData.value.push(...res)

      habitsData.value.forEach(item => {
        if (item.insistTimeRecords && item.insistTimeRecords.length > 0 && dayjs(item.insistTimeRecords[item.insistTimeRecords.length - 1]).isToday()) {
          return
        }

        notifyHabitsData.push(item)
      })

      habitsNotify(notifyHabitsData)  // 给当前未打卡的习惯设定提醒定时器
    }

    nextTick(() => {
      loadingInstance.value.close()
      loading.value = false
    })
  } catch (error) {
    console.log(`${error}`)
  }
})
</script>

<style lang="scss">
@import '../../assets/style/variables.scss';
.Habit {
  height: 100%;
  font-size: .16rem;
  display: flex;
  flex-flow: column nowrap;
  background: rgba(255, 255, 255, 0.2);
  border-radius: .02rem;
  transition: all .5s ease;

  &--spread {
    margin-left: -2.7rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .1rem;
    position: relative;
    z-index: 10;

    &__shrink {
      font-size: .23rem;
      cursor: pointer;
      color: $icon-color;
    }

    &__add {
      display: flex;
      align-items: center;
      &__icon1 {
        font-size: .19rem;
        margin-right: .1rem;
      }

      &__icon2 {
        font-size: .17rem;
      }
    }
  }

  &__addHabit {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    .item {
      width: 2.7rem;
      display: flex;
      align-items: center;
    }

    &__habitFre {
      margin-top: .1rem;
      flex: 1;

      &__freInput {
        flex: 1;
        display: flex;
        align-items: center;

        .el-input {
          margin: 0 .05rem;
        }
      }
    }

    &__habitIns {
      margin-top: .1rem;
      flex: 1;

      &__insInput {
        flex: 1;
        display: flex;
        align-items: center;

        .el-input {
          margin: 0 .05rem 0 0;
        }
      }
    }

    &__habitNotify {
      margin-top: .1rem;
      flex: 1;

      &__label {
        align-self: flex-start;
        padding-top: .05rem;
      }

      &__notifyTime {
        flex: 1;
        display: flex;
        flex-flow: column;
        justify-content: center;

        .el-input, .el-input__inner, .el-input__icon {
          height: .3rem !important;
          line-height: .3rem !important;
          border-radius: .05rem !important;
        }

        .el-input {
          width: 1.92rem;
        }

        .el-input__inner {
          padding-left: .3rem !important;
        }

        .el-input__icon {
          color: #ccc;
        }
      }

      &__notNotify {
        .el-checkbox__label {
          font-size: .13rem;
        }
      }
    }

    &__btns {
      margin-top: .1rem;
      margin-bottom: .1rem;
    }


    .itemLabel {
      width: .65rem;
      text-align: right;
      margin-right: .1rem;
    }

    .el-input {
      border: 1px solid #ccc;
      border-radius: .05rem;
      flex: 1;
      height: .28rem;
      line-height: .28rem;
    }

    .el-input__inner {
      background-color: rgba(253, 253, 253, 0.315);
      padding: .05rem;
      height: .23rem;
      line-height: .23rem;
    }

    .el-input__inner::placeholder {
      color: $placeholder-color;
    }
  }

  &__main {
    flex: 1;
    position: relative;
    z-index: 10;

    &__flag {
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      margin-top: 1.3rem;

      &__icon {
        color: rgba(241, 241, 241, 0.877);
        font-size: 1.4rem;
      }

      &__tips {
        margin-top: .15rem;
        font-size: .14rem;
        color: $base-fontColor;
      }
    }

    &__habits {
      flex: 1;

      &__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 .1rem .1rem .1rem;

        .habitInfo {
          flex: 1;
          height: .36rem;
          padding: 0 .1rem;
          margin-right: .08rem;
          font-size: .14rem;
          color: $base-fontColor;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all .5s ease;

          span:last-child {
            font-size: .12rem;
            color: $lighter-fontColor;
          }
        }

        .habitInfo:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .habitHandle {
          display: flex;
          align-items: center;
          .star {
            font-size: .2rem;
            color: rgb(242,203,81);
          }

          .el-button {
            width: .55rem;
            height: .36rem;
            margin-right: .05rem;

            span {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }

    &__doneHabits {
      flex: 1;

      &__item {
        margin: 0 .1rem .1rem .1rem;

        .doneHabitInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: .36rem;
          padding: 0 .1rem;
          font-size: .14rem;
          background-color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          color: $base-fontColor;
          transition: all .5s ease;

          &__right {
            display: flex;
            align-items: center;

            &__time {
              font-size: .12rem;
              color: $lighter-fontColor;
            }

            .el-link {
              margin-left: .1rem;
              font-size: .12rem;
            }
          }
        }

        .doneHabitInfo:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  &__itemStatistics {
    margin-bottom: .15rem;
    display: flex;
    justify-content: space-between;
    color: $base-fontColor;

    .item {
      display: flex;
      flex-flow: column nowrap;
      align-items: center;

      &__num {
        font-size: .2rem;
        font-weight: bold;
      }

      &__tip {
        font-size: .13rem;
        color: $lighter-fontColor;
      }
    }
  }
}

@media screen and (max-width: 1100px) {
  /* 设置主界面响应式 */
  .Habit {
    &--spread {
      margin-left: 0;
    }
  }
}
</style>
