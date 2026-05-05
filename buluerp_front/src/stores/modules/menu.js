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
        this.$state.menu = getChildren(res[0])
      })
    },
  },
})
const controlMsg = ['新增', '修改', '删除']
const getChildren = (menu) => {
  if (controlMsg.includes(menu.children[0].label)) {
    menu.children = generateChildren(menu.children)
    return menu
  }
  menu.children.forEach((ele) => {
    if (ele.children) {
      getChildren(ele)
    } else if (!(ele.label in controlMsg)) {
      ele.children = generateChildren([])
    }
  })
  return menu
}

const generateChildren = (subMenu) => {
  const newMenu = []
  const labels = subMenu.map((ele) => ele.label)
  for (let i = 0; i < 3; i++) {
    newMenu.push({
      label: controlMsg[i],
      path: '/',
      disabled: labels.includes(controlMsg[i]) ? false : true,
    })
  }
  return newMenu
}
export default useMenuState
