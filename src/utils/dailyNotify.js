/*
 * @Author: 胡晨明
 * @Date: 2022-03-13 15:38:19
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-14 18:38:23
 * @Description: 每日提醒定时通知配置文件
 */
import storage from './storage'
import { ElNotification } from 'element-plus'
import dayjs from 'dayjs'
import CustomParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
dayjs.extend(CustomParseFormat)

let dailyData

let firstNotifyFlag = null  // 第一个计算到下一个小时的定时器标识
let everyHourNotifyFlag = null  // 循环每次到下一个小时的定时器标识
let hourDailyFlag = null

let todayDateStart = 0  // 今日起始时间戳
let todayDateEnd = 0    // 今日结束时间戳

async function dailyNotify (daily) {
  if (everyHourNotifyFlag) {
    return
  }

  if (firstNotifyFlag) {
    clearTimeout(firstNotifyFlag)
    firstNotifyFlag = null
  }

  if (hourDailyFlag) {
    clearTimeout(hourDailyFlag)
    hourDailyFlag = null
  }

  dailyData = daily

  const token = storage.getItem('userInfo') && storage.getItem('userInfo').token
  if (!token) {
    console.log('用户未登录, 不进行每日通知设定')
    return
  }

  todayDateStart = dayjs().startOf('day').valueOf()  // 获取今日起始时间戳
  todayDateEnd = dayjs().endOf('day').valueOf()      // 获取今日结束时间戳

  setDailyNotify('first')

  async function setDailyNotify (flag) {
    const nowTime = dayjs().valueOf()
    const hourStart = dayjs().startOf('hour').valueOf()
    const hourEnd = dayjs().endOf('hour').valueOf()

    // 若过完一天，则重新计算起始和结束时间戳
    if (dayjs().startOf('day').valueOf() > todayDateEnd) {
      todayDateStart = dayjs().startOf('day').valueOf()
      todayDateEnd = dayjs().endOf('day').valueOf()
    }

    setNotify(dailyData, nowTime, hourStart, hourEnd)

    if (flag === 'first') {
      const nextHour = dayjs().hour() + 1
      const toNextHour = dayjs({ hour: nextHour, minute: 0, second: 0, millisecond: 0 }).startOf('hour').valueOf()
      console.log(toNextHour - nowTime.valueOf()) //? 查看距离下一小时的间隔时间
      firstNotifyFlag = setTimeout(() => {
        setDailyNotify('second')
        everyHourNotifyFlag = setInterval(() => {
          setDailyNotify('routine')
        }, 3600000)
      }, toNextHour - nowTime.valueOf())
    }
  }
}

//* 设置定时器
function setNotify (daily, nowTime, hourStart, hourEnd) {
  const nowTimeFormat = dayjs(nowTime).format('YYYY-MM-DD')

  const pa = daily.PA

  const dailyTime = dayjs(`${nowTimeFormat} ${daily.time} ${pa}`, 'YYYY-MM-DD hh:mm A').valueOf()
  console.log('dailyTime: ', dailyTime)

  let countdown = 0
  console.log(`dayjs(dailyTime).isBetween(dayjs(hourStart), dayjs(hourEnd), null, '[]'): `, dayjs(dailyTime).isBetween(dayjs(hourStart), dayjs(hourEnd), null, '[]'));
  if (dayjs(dailyTime).isBetween(dayjs(hourStart), dayjs(hourEnd), null, '[]')) {
    if (dayjs(dailyTime).minute() >= dayjs(nowTime).minute()) {
      countdown = dailyTime - nowTime

      hourDailyFlag = setTimeout(() => {
        // 每日通知逻辑
        ElNotification({
          title: 'Any.do每日通知',
          message: `明日复明日, 明日何其多。请抓紧完成今日的任务哟~`,
          type: 'success',
          duration: 0
        })
      }, countdown)
    }
  }
}

//* 清除所有定时器
export function clearDailyNotifyFlags () {
  if (firstNotifyFlag) {
    clearTimeout(firstNotifyFlag)
  }

  if (everyHourNotifyFlag) {
    clearInterval(everyHourNotifyFlag)
  }

  if (hourDailyFlag) {
    clearTimeout(hourDailyFlag)
  }
}

export default dailyNotify