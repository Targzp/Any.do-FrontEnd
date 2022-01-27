/*
 * @Author: 胡晨明
 * @Date: 2022-01-19 20:47:03
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-01-23 21:50:34
 * @Description: websocket 封装
 */
import config from "../config"
import handleWebSokcetMessage from "./websocketHandleFunction"
import storage from './storage'
import Cookies from './cookies'

export default {
  ws: {},
  useWebSocket: function () {
    const token = storage.getItem('userInfo') && storage.getItem('userInfo').token
    const sid = Cookies.getCookie('anydo.sid')
    if (!token) {
      console.log('用户未登录, websocket禁止连接')
      return
    }

    this.ws = new WebSocket(config.WS_ADDRESS)

    const init = () => {
      bindEvent()
    }

    const bindEvent = () => {
      this.ws.addEventListener('open', handleOpen, false)
      this.ws.addEventListener('close', handleClose, false)
      this.ws.addEventListener('error', handleError, false)
      this.ws.addEventListener('message', handleWebSokcetMessage, false)
    }

    const handleOpen = (e) => {
      console.log('WebSocket open', e)
      this.ws.send(JSON.stringify({
        flag: 'connect',
        sid,
        token
      }))
    }

    function handleClose(e) {
      console.log('WebSocket close', e)
    }

    function handleError(e) {
      console.log('WebSocket error', e)
    }

    init()
  },
  //* 关闭 webSocket 连接
  closeWebSocket: function () {
    this.ws.close()
    console.log('websocket关闭成功')
  }
}