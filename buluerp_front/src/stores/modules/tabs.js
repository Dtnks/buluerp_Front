import { defineStore } from 'pinia'

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
          console.log('fresh')
          this.$state.orderFreshFn()
        }
        return targetName
      }
      if(targetPath){
        this.$state.path2Label[targetPath] = targetName
      }
      this.$state.editableTabs.push({
        title: targetName,
        name: targetName,
        component: component,
        data: data,
        key: targetName,
      })
      this.$state.editableTabsValue = targetName
    },
    removeTab(targetName, currentName) {
      if (targetName == 'all') {
        this.$state.editableTabs = []
      }
      const tabs = this.$state.editableTabs
      let activeName = currentName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.$state.editableTabs = tabs.filter((tab) => tab.name !== targetName)
      return activeName
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
