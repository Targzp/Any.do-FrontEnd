/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:12:02
 * @LastEditTime: 2022-02-09 09:30:52
 * @LastEditors: 胡晨明
 * @Description: 前端路由配置
 * @FilePath: \bloge:\Vue_store\manager-fe\src\router\index.js
 */
import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import storage from '../utils/storage'
import { ElMessage } from 'element-plus'
import Home from '../views/Home/Home.vue'
  
const routes = [
  {
    name: 'Home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
    redirect: '/list/0/tasks',
    children: [
      {
        name: 'List',
        path: 'list',
        meta: {
          title: '清单'
        },
        component: () => import('../views/List/List.vue'),
        children: [
          {
            name: 'Tasks',
            path: ':listId/tasks',
            meta: {
              title: '清单任务'
            },
            component: () => import('../views/List/Tasks.vue'),
            children: [
              {
                name: 'TaskDetail',
                path: ':listId2?/:taskId',
                meta: {
                  title: '任务描述'
                },
                component: () => import('../views/List/TaskDetail.vue')
              }
            ]
          }
        ]
      },
      {
        name: 'Calendar',
        path: 'calendar',
        meta: {
          title: '日历'
        },
        component: () => import('../views/Calendar/Calendar.vue')
      },
      {
        name: 'Focus',
        path: 'focus',
        meta: {
          title: '专注'
        },
        component: () => import('../views/Focus/Focus.vue')
      },
      {
        name: 'Habit',
        path: 'habit',
        meta: {
          title: '习惯打卡'
        },
        component: () => import('../views/Habit/Habit.vue')
      },
      {
        name: 'Chat',
        path: 'chat',
        meta: {
          title: '群聊'
        },
        component: () => import('../views/Chat/Chat.vue')
      }
    ]
  },
  {
    name: 'Login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('../views/Login&Register/Login.vue'),
    beforeEnter: (to, from, next) => {
      const userInfo = storage.getItem('userInfo')
      userInfo && Object.keys(userInfo).length ? next({ name: 'Home' }) : next()
    }
  },
  {
    name: 'Setting',
    path: '/setting',
    meta: {
      title: '设置'
    },
    component: () => import('../views/Setting/Setting.vue'),
    redirect: {
      name: 'Profile'
    },
    children: [
      {
        name: 'Profile',
        path: 'profile',
        meta: {
          title: '个人信息'
        },
        component: () => import('../views/Setting/Profile.vue'),
      },
      {
        name: 'UpdatePassword',
        path: 'updatepassword',
        meta: {
          title: '更改密码'
        },
        component: () => import('../views/Setting/UpdatePassword.vue'),
      },
      {
        name: 'BindMail',
        path: 'bindmail',
        meta: {
          title: '绑定邮箱'
        },
        component: () => import('../views/Setting/BindMail.vue'),
      }
    ]
  },
  {
    name: 'CustomSetting',
    path: '/customSetting',
    meta: {
      title: '自定义功能设置'
    },
    component: () => import('../views/CustomSetting/CustomSetting.vue'),
  },
  {
    name: '404',
    path: '/404',
    meta: {
      title: '页面不存在'
    },
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
  
// 导航守卫
router.beforeEach((to, from, next) => {
  const { name } = to
  const userInfo = storage.getItem('userInfo')
  // 检查路由是否存在
  if (router.hasRoute(name)) {
    const isLogin = (name === 'Login')
    if ((userInfo && Object.keys(userInfo).length) || isLogin) {
      next()
    } else {
      ElMessage.warning('请先登录')
      next('/login')
    }
  } else {
    next('/404')
  }
})
  
export default router