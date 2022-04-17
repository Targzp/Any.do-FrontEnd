/*
 * @Author: 胡晨明
 * @Date: 2022-03-15 10:35:46
 * @LastEditors: 胡晨明
 * @LastEditTime: 2022-03-15 10:35:47
 * @Description: 按钮 loading 状态 Effect
 */
import { ref, reactive } from 'vue'

export const useBtnLoading = () => {
  // 通用 loading 状态
  const loading = ref(false)

  // 新增指定按钮 loading 状态
  let id = 0  // 指定按钮自增 id
  const addAptBtnLoading = (desc = '无描述') => {
    const aptLoading = reactive({
      id: id++,
      desc,
      status: false
    })
    return aptLoading
  }

  return {
    loading,
    addAptBtnLoading
  }
}