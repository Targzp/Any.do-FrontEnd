/*
 * @Author: your name
 * @Date: 2021-09-17 21:00:19
 * @LastEditTime: 2021-10-03 23:59:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\src\main.js
 */
import { createApp } from 'vue'
import router from './router/index'
import store from './store/index'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './assets/style/index.scss'

const app = createApp(App)
app.use(ElementPlus, { size: 'small', zIndex: 3000, locale: zhCn })
app.use(router).use(store).mount('#app')
