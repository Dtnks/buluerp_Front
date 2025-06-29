<script setup lang="ts">
import LayoutLeft from '@/views/layout/main/LayoutLeft.vue'
import LayoutTop from '@/views/layout/main/LayoutTop.vue'
import { ref } from 'vue'
import type { TabPaneName } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'
import useTabStore from '@/stores/modules/tabs'
const editableTabsValue = ref('')
const store = useTabStore()
const addTab = (targetName: string, component, data, control = null) => {
  editableTabsValue.value = store.addTab(targetName, component, data, control)
}

const removeTab = (targetName: TabPaneName) => {
  editableTabsValue.value = store.removeTab(targetName, editableTabsValue.value)
}
const isCollapse = ref(false)
const reverse = ref('')
const handleHiddenMenu = () => {
  isCollapse.value = !isCollapse.value
  reverse.value = reverse.value == '' ? 'flipped-image' : ''
}
</script>
<template>
  <div class="row">
    <LayoutLeft :isCollapse="isCollapse" :addTab="addTab" />
    <div class="col" style="flex: 1; height: 100vh; overflow-y: scroll">
      <LayoutTop :handleHiddenMenu="handleHiddenMenu" :reverse="reverse" :addTab="addTab" />
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="demo-tabs"
        closable
        editable
        @tab-remove="removeTab"
      >
        <template #add-icon>
          <el-icon @click="store.removeTab('all')"><CircleClose /></el-icon>
        </template>
        <el-tab-pane
          class="col"
          v-for="item in store.editableTabs"
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
              :key="item.key"
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
