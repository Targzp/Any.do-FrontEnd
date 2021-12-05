/*
 * @Author: 胡晨明
 * @Date: 2021-12-02 10:50:29
 * @LastEditTime: 2021-12-02 22:52:09
 * @LastEditors: Please set LastEditors
 * @Description: indexedDB 数据库（主要存储用户任务数据）
 * @FilePath: \Anydo-app\src\store\db\index.js
 */
import Dexie from 'dexie'

const db = new Dexie('userDatabase')

db.version(1).stores({
  tasks: '++id, listId, taskId, [listId+taskId]'
})

export default db