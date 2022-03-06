/*
 * @Author: 胡晨明
 * @Date: 2022-01-24 10:09:15
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-07 00:03:08
 * @Description: 任务定时通知配置文件
 */
import storage from './storage'
import { ElNotification } from 'element-plus'
import db from '@/store/db'
import request from '@/api/index'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import ObjectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(isBetween)
dayjs.extend(ObjectSupport)

let firstNotifyFlag = null  // 第一个计算到下一个小时的定时器标识
let everyHourNotifyFlag = null  // 循环每次到下一个小时的定时器标识
let hourTasksFlags = []     // 小时内的所有定时器标识集合

let todayTasks = [] // 今日任务集合
let todayDateStart = 0  // 今日起始时间戳
let todayDateEnd = 0    // 今日结束时间戳

async function tasksNotify () {
  const token = storage.getItem('userInfo') && storage.getItem('userInfo').token
  if (!token) {
    console.log('用户未登录, 不进行任务通知设定')
    return
  }

  todayDateStart = dayjs().startOf('day').valueOf()  // 获取今日起始时间戳
  todayDateEnd = dayjs().endOf('day').valueOf()      // 获取今日结束时间戳

  let tasks = await db.tasks.filter((value) => {
    return !value.task.doneFlag && !value.task.softDelFlag
  }).toArray()

  getTodayTasks()

  setTasksNotify('first')

  // 获取今日任务方法
  function getTodayTasks () {
    tasks.forEach(item => {
      const startTaskDate = item.task.startTaskDate && +item.task.startTaskDate
      const taskTime = (item.task.taskTime && +item.task.taskTime) || (item.task.taskDate && +item.task.taskDate)
      const startTime = startTaskDate || taskTime
      
      if (dayjs(startTime).isBetween(dayjs(todayDateStart), dayjs(todayDateEnd), null, '[]')) {
        todayTasks.push(item)
      }
    })

    console.log('todayTasks', todayTasks) //? 查看今日之任务
  }

  // 统一设置任务提醒
  async function setTasksNotify (flag) {
    const nowTime = dayjs().valueOf()
    const hourStart = dayjs().startOf('hour').valueOf()
    const hourEnd = dayjs().endOf('hour').valueOf()

    // 若过完一天，则重新计算起始和结束时间戳
    if (dayjs().startOf('day').valueOf() > todayDateEnd) {
      todayDateStart = dayjs().startOf('day').valueOf()
      todayDateEnd = dayjs().endOf('day').valueOf()
      tasks = await db.tasks.filter((value) => {
        return !value.task.doneFlag && !value.task.softDelFlag
      }).toArray()
      todayTasks = []
      getTodayTasks()
    }

    todayTasks.forEach(item => {
      setNotify(item.id, item.task, nowTime, hourStart, hourEnd)
    })

    if (flag === 'first') {
      const nextHour = dayjs().hour() + 1
      const toNextHour = dayjs({ hour: nextHour, minute: 0, second: 0, millisecond: 0 }).startOf('hour').valueOf()
      console.log(toNextHour - nowTime.valueOf()) //? 查看距离下一小时的间隔时间
      firstNotifyFlag = setTimeout(() => {
        hourTasksFlags = []
        setTasksNotify('second')
        everyHourNotifyFlag = setInterval(() => {
          hourTasksFlags = []
          setTasksNotify('routine')
        }, 3600000)
      }, toNextHour - nowTime.valueOf())
    }
  }
}

//* 为新添加任务增加定时器
export function setNewTaskNotify (id, task) {
  const startTaskDate = task.startTaskDate && +task.startTaskDate
  const taskTime = (task.taskTime && +task.taskTime) || (task.taskDate && +task.taskDate)
  const startTime = startTaskDate || taskTime
  
  if (dayjs(startTime).isBetween(dayjs(todayDateStart), dayjs(todayDateEnd), null, '[]')) {
    todayTasks.push({ id, task })
  }

  const nowTime = dayjs().valueOf()
  const hourStart = dayjs().startOf('hour').valueOf()
  const hourEnd = dayjs().endOf('hour').valueOf()

  setNotify(id, task, nowTime, hourStart, hourEnd)
}

//* 更改任务时间判断是否需设定定时器
export function resetTaskNotify (id, task) {
  console.log('id: ', id)     //? 查看修改任务 ID
  console.log('task: ', task) //? 查看修改任务

  const nowTime = dayjs().valueOf()
  const hourStart = dayjs().startOf('hour').valueOf()
  const hourEnd = dayjs().endOf('hour').valueOf()

  const startTaskDate = task.startTaskDate && +task.startTaskDate
  const taskTime = (task.taskTime && +task.taskTime) || (task.taskDate && +task.taskDate)
  const startTime = startTaskDate || taskTime

  let hourFlagIndex
  hourTasksFlags.forEach((item, index) => {
    if (item.id === id) {
      clearTimeout(item.notifyFlag)
      hourFlagIndex = index
    }
  })

  if (hourFlagIndex) {
    hourTasksFlags.splice(hourFlagIndex, 1)
  }

  if (dayjs(startTime).isBetween(dayjs(todayDateStart), dayjs(todayDateEnd), null, '[]')) {
    todayTasks.forEach((item, index) => {
      if (item.id === id) {
        todayTasks[index] =  { id, task }
      }
    })

    setNotify(id, task, nowTime, hourStart, hourEnd)
  } else {
    const index = todayTasks.findIndex(item => item.id === id)
    todayTasks.splice(index, 1)
  }
}

//* 清除指定任务定时器
export function clearNotifyFlag (id) {
  hourTasksFlags.forEach(item => {
    if (item.id === id) {
      clearTimeout(item.notifyFlag)
    }
  })
}

//* 清除定时器
export function clearNotifyFlags () {
  if (firstNotifyFlag) {
    clearTimeout(firstNotifyFlag)
  }

  if (everyHourNotifyFlag) {
    clearInterval(everyHourNotifyFlag)
  }

  if (hourTasksFlags.length > 0) {
    hourTasksFlags.forEach(item => {
      if (item) {
        clearTimeout(item.notifyFlag)
      }
    })
  }
}

//* 设置定时器
function setNotify (id, task, nowTime, hourStart, hourEnd) {
  const startTaskDate = task.startTaskDate && +task.startTaskDate
  const taskTime = (task.taskTime && +task.taskTime) || (task.taskDate && +task.taskDate)
  let startTime = startTaskDate || taskTime
  const taskNotify = task.notify
  const userNotify = storage.getItem('userNotify') || {}

  let countdown = 0
  let notifyFlag

  if (taskNotify !== '0') {
    startTime = (dayjs(startTime).minute(dayjs(startTime).minute() - (+taskNotify))).valueOf()
  }

  if (dayjs(startTime).isBetween(dayjs(hourStart), dayjs(hourEnd), null, '[]')) {
    if (dayjs(startTime).minute() >= dayjs(nowTime).minute()) {
      countdown = startTime - nowTime

      notifyFlag = setTimeout(async () => {
        //* 任务通知逻辑
        if (userNotify.webNotify) {
          // 网页通知
          ElNotification({
            title: 'Any.do网页通知',
            message: `${task.taskInfo} 已到任务设定时间, 请及时处理`,
            position: 'bottom-right',
            type: 'warning',
            duration: 0
          })
        } else if (userNotify.mailNotify) {
          // 邮箱通知
          const userMail = storage.getItem('userInfo').userMail
          const userName = storage.getItem('userInfo').userName
          await request.userTaskMailNotify({ userName, userMail, taskInfo: task.taskInfo })
        }
      }, countdown)

      hourTasksFlags.push({ id, notifyFlag })
    }
  }
}

export default tasksNotify