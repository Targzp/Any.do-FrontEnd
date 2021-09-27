/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:12:02
 * @LastEditTime: 2021-09-24 11:35:20
 * @LastEditors: Please set LastEditors
 * @Description: 前端路由配置
 * @FilePath: \bloge:\Vue_store\manager-fe\src\router\index.js
 */
import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import storage from '../utils/storage'
import { ElMessage } from 'element-plus'
import Home from '../views/Home.vue'
  
const routes = [{
    name: 'Home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: Home,
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
      userInfo ? next({ name: 'Home' }) : next()
    }
  },
  {
    name: 'Setting',
    path: '/setting',
    meta: {
      title: '登录'
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
    const isLogin = (name === 'Login');
    if (userInfo || isLogin) {
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