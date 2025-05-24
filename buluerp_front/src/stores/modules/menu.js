import { defineStore } from 'pinia'
import { GetMenuInfo } from '@/apis/layout'
let data = await GetMenuInfo().then((res) => {
  return res[0]
})

const useMenuState = defineStore('menu', {
  state: () => ({
    menu: data,
  }),
  actions: {
    // 获取字典
    async refreshMenu() {
      await GetMenuInfo().then((res) => {
        this.$state.menu = res[0]
      })
    },
  },
})

export default useMenuState
