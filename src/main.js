import { createApp } from 'vue'
import router from './router/index'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/style/index.scss'

const app = createApp(App)

app.use(router).use(ElementPlus, {
    size: 'medium',
    zIndex: 3000,
}).mount('#app')
