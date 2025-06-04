<script setup lang="ts">
import LayoutLeft from '@/views/layout/main/LayoutLeft.vue'
import LayoutTop from '@/views/layout/main/LayoutTop.vue'
import { ref } from 'vue'
import type { TabPaneName } from 'element-plus'
import BusinessQuery from '../business/main/Query.vue'

const editableTabsValue = ref('')
const editableTabs = ref([])

const addTab = (targetName: string, component, data, control = null) => {
  if (editableTabs.value.filter((item) => item.title == targetName).length > 0) {
    editableTabsValue.value = targetName
    return
  }
  editableTabs.value.push({
    title: targetName,
    name: targetName,
    component: component,
    data: data,
    control: control,
  })
  editableTabsValue.value = targetName
}

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
    <LayoutLeft :isCollapse="isCollapse" :addTab="addTab" />
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
            <component
              :is="item.component"
              :addTab="addTab"
              :data="item.data"
              :control="item.control"
            ></component>
          </KeepAlive>
        </el-tab-pane>
      </el-tabs>
    </div>
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

