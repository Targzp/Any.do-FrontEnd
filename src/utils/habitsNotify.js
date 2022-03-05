/*
 * @Author: 胡晨明
 * @Date: 2022-02-24 23:21:05
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-02-26 17:32:15
 * @Description: 打卡定时通知配置文件
 *
 */
import { ElNotification } from 'element-plus'
// import request from '@/api/index'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

let firstNotifyFlag = null  // 第一个计算到下一个小时的定时器标识
let everyHourNotifyFlag = null  // 循环每次到下一个小时的定时器标识
let hourHabitsFlags = []     // 小时内的所有定时器标识集合

async function habitsNotify (habitsData) {
  setHabitsNotify('first')

  //* 统一设置习惯打卡提醒
  async function setHabitsNotify (flag) {
    const nowTime = dayjs().valueOf()
    const hourStart = dayjs().startOf('hour').valueOf()
    const hourEnd = dayjs().endOf('hour').valueOf()

    habitsData.forEach(item => {
      setNotify(item.habitId, item, nowTime, hourStart, hourEnd)
    })

    if (flag === 'first') {
      const nextHour = dayjs().hour() + 1
      const toNextHour = dayjs({ hour: nextHour, minute: 0, second: 0, millisecond: 0 }).startOf('hour').valueOf()

      firstNotifyFlag = setTimeout(() => {
        hourHabitsFlags = []
        setHabitsNotify('second')
        everyHourNotifyFlag = setInterval(() => {
          hourHabitsFlags = []
          setHabitsNotify('routine')
        }, 3600000)
      }, toNextHour - nowTime.valueOf())
    }
  }
}

//* 设置定时器
function setNotify (id, habit, nowTime, hourStart, hourEnd) {
  const startTime = habit.notifyTime

  let countdown = 0   // 定时计算量
  let notifyFlag      // 单个习惯打卡数据定时提醒标识

  if (dayjs(startTime).isBetween(dayjs(hourStart), dayjs(hourEnd), null, '[]')) {
    if (dayjs(startTime).minute() >= dayjs(nowTime).minute()) {
      countdown = startTime - nowTime

      notifyFlag = setTimeout(async () => {
        // 习惯打卡通知逻辑
        ElNotification({
          title: 'Any.do网页通知',
          message: `${habit.habitName} 已到打卡设定时间, 请按时打卡吧`,
          position: 'bottom-right',
          type: 'warning',
          duration: 0
        })

        //TODO 邮箱通知暂时不做
      }, countdown)

      hourHabitsFlags.push({ id, notifyFlag })
    }
  }
}

//* 为新添加习惯打卡增加定时器
export function setNewHabitNotify (id, habit) {
  const nowTime = dayjs().valueOf()
  const hourStart = dayjs().startOf('hour').valueOf()
  const hourEnd = dayjs().endOf('hour').valueOf()

  setNotify(id, habit, nowTime, hourStart, hourEnd)
}

//* 更改习惯打卡提醒时间判断是否需设定定时器
export function resetHabitNotify (id, habit) {
  const nowTime = dayjs().valueOf()
  const hourStart = dayjs().startOf('hour').valueOf()
  const hourEnd = dayjs().endOf('hour').valueOf()

  let hourFlagIndex
  hourHabitsFlags.forEach((item, index) => {
    if (item.id === id) {
      clearTimeout(item.notifyFlag)
      hourFlagIndex = index
    }
  })

  if (hourFlagIndex) {
    hourHabitsFlags.splice(hourFlagIndex, 1)
  }

  setNotify(id, habit, nowTime, hourStart, hourEnd)
}

//* 清除指定习惯打卡数据定时器
export function clearNotifyFlag (id) {
  hourHabitsFlags.forEach(item => {
    if (item.id === id) {
      clearTimeout(item.notifyFlag)
    }
  })
}

//* 清除所有定时器
export function clearHabitsNotifyFlags () {
  if (firstNotifyFlag) {
    clearTimeout(firstNotifyFlag)
  }

  if (everyHourNotifyFlag) {
    clearInterval(everyHourNotifyFlag)
  }

  if (hourHabitsFlags.length > 0) {
    hourHabitsFlags.forEach(item => {
      if (item) {
        clearTimeout(item.notifyFlag)
      }
    })
  }
}

export default habitsNotify