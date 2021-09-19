/*
 * @Author: 胡晨明
 * @Date: 2021-09-15 23:18:40
 * @LastEditTime: 2021-09-18 14:33:17
 * @LastEditors: Please set LastEditors
 * @Description: 环境配置封装
 * @FilePath: \study_javascripts(红宝书)e:\毕设项目\Anydo-app\config\config.js
 */
/**
 * @description: 环境配置封装
 */
 const env =
 import.meta.env.MODE || 'prod'
const EnvConfig = {
 dev: {
   baseApi: '/api',
   mockApi: 'https://www.fastmock.site/mock/5ad0955a6aa193e3fc9133217cc1c963/api'
 },
 test: {
   baseApi: '/test.futurefe.com/api',
   mockApi: 'https://www.fastmock.site/mock/5ad0955a6aa193e3fc9133217cc1c963/api'
 },
 prod: {
   baseApi: '/api',
   mockApi: ''
 }
}
export default {
 env: env,
 namespace: 'anydo',
 ...EnvConfig[env]
}