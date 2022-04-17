/*
 * @Author: 胡晨明
 * @Date: 2022-03-09 14:42:15
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-26 17:47:03
 * @Description: 任务(根据任务优先级)快速排序工具函数
 */
//* 优先级大小关系映射字典
const priorityDics = {
  high: 3,
  mid: 2,
  low: 1
}

//* 排序入口程序
function tasksSort (tasks) {
  return qsort(tasks, 0, tasks.length)
}

//* 排序主程序
function qsort (A, p, r) {
  r = r || A.length

  if (p < r - 1) {
    const q = divide(A, p, r)
    qsort(A, p, q)
    qsort(A, q + 1, r)
  }

  return A
}

/**
 * @description: 计算和拆分主要逻辑函数
 * @param {*} A 数组
 * @param {*} p 起始下标
 * @param {*} r 结束下标 + 1
 */
function divide (A, p, r) {
  // 基准点
  const pivot = A[r - 1].task.taskPriority?(priorityDics[A[r - 1].task.taskPriority]):0

  // i 初始化为 -1，也就是起始下标的前一个
  let i = p - 1

  // 循环
  for (let j = p; j < r - 1; j++) {
    // 如果比基准点大就 i++, 然后交换元素位置
    const prio = A[j].task.taskPriority?(priorityDics[A[j].task.taskPriority]):0
    if (prio >= pivot) {
      i++
      swap(A, i, j)
    }
  }

  // 最后将基准点插入到 i+1 的位置
  swap(A, i + 1, r - 1)
  // 返回最终指针 i 的位置
  return i + 1
}

//* 交换函数
function swap (A, i, j) {
  const t = A[i]
  A[i] = A[j]
  A[j] = t
}

export default tasksSort
