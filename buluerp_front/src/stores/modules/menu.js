import { defineStore } from 'pinia'
import { GetMenuInfo } from '@/apis/layout'

const useMenuState = defineStore('menu', {
  state: () => ({
    menu: {},
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
