import { defineStore } from 'pinia'
import { GetMenuInfo } from '@/apis/layout'
<<<<<<< HEAD
=======
// let data = await GetMenuInfo().then((res) => {
//   return res[0]
// })
>>>>>>> 121d266f0c387b7980f83e34d4898e9182c4467e

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
