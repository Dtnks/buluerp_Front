<script setup lang="ts">
import LayoutLeft from '@/views/layout/main/LayoutLeft.vue'
import LayoutTop from '@/views/layout/main/LayoutTop.vue'
import { ref } from 'vue'
import type { TabPaneName } from 'element-plus'
import { GetMenuInfo } from '@/apis/layout'
import BusinessQuery from '../business/main/Query.vue'
import { getMenu } from '@/apis/system/menu'

const editableTabsValue = ref('订单看板')
const editableTabs = ref([])
const menuOptions = ref([])
const addTab = (targetName: string, component, data = null) => {
  if (editableTabs.value.filter((item) => item.title == targetName).length > 0) {
    editableTabsValue.value = targetName
    return
  }
  editableTabs.value.push({
    title: targetName,
    name: targetName,
    component: component,
    data: data,
  })
  editableTabsValue.value = targetName
}
const getEachPath = (ele) => {
  if (ele.id) {
    getMenu(ele.id).then((res) => {
      ele.path = res.data.path
    })
  }
  if (Array.isArray(ele.children) && ele.children.length > 1) {
    ele.children.forEach(getEachPath)
  }
}
GetMenuInfo().then((res) => {
  res.forEach((ele) => getEachPath(ele))
  menuOptions.value = res[0]
  console.log(menuOptions.value)
})
const removeTab = (targetName: TabPaneName) => {
  const tabs = editableTabs.value
  let activeName = editableTabsValue.value
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
  editableTabsValue.value = activeName
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName)
}
const isCollapse = ref(false)
const handleHiddenMenu = () => {
  isCollapse.value = !isCollapse.value
}
</script>
<template>
  <div class="row">
    <LayoutLeft :isCollapse="isCollapse" :addTab="addTab" :menuOptions="menuOptions" />
    <div class="col" style="flex: 1; height: 100vh; overflow-y: scroll">
      <LayoutTop :handleHiddenMenu="handleHiddenMenu"></LayoutTop>
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="demo-tabs"
        closable
        @tab-remove="removeTab"
      >
        <el-tab-pane
          class="col"
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <KeepAlive>
            <component :is="item.component" :addTab="addTab" :data="item.data"></component>
          </KeepAlive>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template>
      <BusinessQuery :addTab="addTab" />
    </template>
  </div>
</template>

<style scoped>
.el-tabs {
  flex: 1;
}
.el-tab-pane {
  height: 100%;
}
</style>
