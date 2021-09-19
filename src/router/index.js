/*
 * @Author: 胡晨明
 * @Date: 2021-08-15 21:12:02
 * @LastEditTime: 2021-09-18 17:22:43
 * @LastEditors: Please set LastEditors
 * @Description: 前端路由配置
 * @FilePath: \bloge:\Vue_store\manager-fe\src\router\index.js
 */
import {
    createRouter,
    createWebHashHistory
  } from 'vue-router'
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
      component: () => import('../views/Login&Register/Login.vue')
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
    if (router.hasRoute(to.name)) {
      next()
    } else {
      next('/404')
    }
  })
  
  export default router