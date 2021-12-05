/*
 * @Author: 胡晨明
 * @Date: 2021-09-15 23:08:44
 * @LastEditTime: 2021-11-07 19:53:47
 * @LastEditors: Please set LastEditors
 * @Description: Vite 配置文件
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\vite.config.js
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// eslint-disable-next-line no-undef
const { resolve } = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8989,
    proxy: {
      '/api': {
        target: "http://localhost:3000"
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      imports: 'vue',
    }),
  ],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': resolve(__dirname, 'src')
    }
  }
})
