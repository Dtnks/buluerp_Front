import { defineStore } from 'pinia'

const useTabStore = defineStore('tabs', {
  state: () => ({
    editableTabs: [],
  }),
  actions: {
    // 获取字典
    addTab(targetName, component, data, control = null) {
      if (this.$state.editableTabs.filter((item) => item.title == targetName).length > 0) {
        return targetName
      }
      this.$state.editableTabs.push({
        title: targetName,
        name: targetName,
        component: component,
        data: data,
        control: control,
        key: targetName,
      })
      return targetName
    },
    removeTab(targetName, currentName) {
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
  },
})

export default useTabStore
