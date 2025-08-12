import { defineStore } from 'pinia'
import router from '@/router'
function addDynamicRoute(name) {
  const route = {
    path: `/${name}`, // 路径需唯一，可用 name 作为路径
    name,
    component: () => import('@/views/empty/empty.vue'),
  }
  router.addRoute('Main',route); // 动态添加
}
const useTabStore = defineStore('tabs', {
  state: () => ({
    editableTabs: [],
    orderFreshFn:undefined,
    editableTabsValue: '',
    path2Label:{}
  }),
  actions: {
    // 获取字典
    addTab(targetName, component, data, targetPath) {
      if (this.$state.editableTabs.filter((item) => item.title == targetName).length > 0) {
        if(targetName=='订单查询' && this.$state.orderFreshFn){
          this.$state.orderFreshFn()
        }
        return
      }
      if(targetPath){
        this.$state.path2Label[targetPath] = targetName
      }
      if(targetPath){
        addDynamicRoute(targetPath)
      }
      this.$state.editableTabs.push({
        title: targetName,
        name: targetPath,
        component: component,
        data: data,
        targetPath:targetPath,
        key: targetName,
      })
      router.push({path:targetPath})
      this.$state.editableTabsValue = targetPath
    },
    removeTab(targetName) {
      if (targetName == 'all') {
        this.$state.editableTabs = []
        this.$state.editableTabsValue = ''
        this.$state.path2Label = {}
        return
      }
      const tabs = this.$state.editableTabs
      let activeName = this.$state.editableTabsValue
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              this.$state.editableTabsValue = nextTab.targetPath
            }
          }
        })
      }
      delete this.$state.path2Label[targetName]
      this.$state.editableTabs = tabs.filter((tab) => tab.name !== targetName)
    },
    freshTab(targetName) {
      const tabs = this.$state.editableTabs
      tabs.forEach((tab) => {
        if (tab.name === targetName) {
          tab.key += 1
        }
      })
    },
    changeTabName(targetName, newName) {
      const tabs = this.$state.editableTabs
      tabs.forEach((tab) => {
        if (tab.name === targetName) {
          tab.title = newName
        }
      })
    },
    deleteTab() {
      this.$state.editableTabs = []
    },
    addOrderFresh(freshFn) {
      this.$state.orderFreshFn = freshFn
    },
    setEditValue(value) {
      this.$state.editableTabsValue = value
    }
  },
})

export default useTabStore
