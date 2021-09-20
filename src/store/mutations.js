import storage from '../utils/storage'

export default {
  saveUserInfo(state, payload) {
    state.userInfo = payload
    storage.setItem('userInfo', payload)
  }
}