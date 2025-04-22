<script setup lang="ts">
const props = defineProps({ isCollapse: { type: Boolean } })
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const activeIndex = ref('1')
const path = router.currentRoute.value.fullPath
if (path == '/business/query' || path == '/business/detail') {
  activeIndex.value = '1-1'
} else if (path == '/business/show') {
  activeIndex.value = '1-2'
} else if (path == '/production/query' || path == '/production/detail') {
  activeIndex.value = '2-1'
}
console.log(activeIndex.value, router.currentRoute.value)
</script>
<template>
  <el-menu
    id="layout"
    active-text-color="#fff"
    :collapse="isCollapse"
    background-color="rgba(0, 21, 41, 1)"
    class="el-menu-vertical-demo"
    :default-active="activeIndex"
    text-color="#fff"
    router
  >
    <div class="col back"><img id="logo" src="@/assets/icon/logo.png" /></div>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><img src="@/assets/icon/u9.png" class="icon" /></el-icon>
        <span>业务中心</span>
      </template>
      <el-menu-item index="1-1" route="/business/query">查询/详情</el-menu-item>
      <el-menu-item index="1-2" route="/business/show">看板</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title
        ><el-icon><img src="@/assets/icon/u15.png" class="icon" /></el-icon>
        <span>产品管理</span></template
      >
      <el-menu-item index="2-1" route="/production/query">查询/详情</el-menu-item>
      <el-menu-item index="2-2" route="/production/show">物料</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3">
      <el-icon><img src="@/assets/icon/u21.png" class="icon" /></el-icon>
      <span>待定</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><img src="@/assets/icon/u25.png" class="icon" /></el-icon>
      <span>待定</span>
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon><img src="@/assets/icon/u29.png" class="icon" /></el-icon>
      <span>待定</span>
    </el-menu-item>
    <el-menu-item index="6">
      <el-icon><img src="@/assets/icon/u33.png" class="icon" /></el-icon>
      <span>待定</span>
    </el-menu-item>
  </el-menu>
</template>
<style scoped>
#layout {
  height: 100vh;
}
.el-menu-item:hover {
  outline: 0 !important;
  background: #1890ff !important;
}
.el-menu-item.is-active {
  color: #fff !important;
  background: #1890ff !important;
}
.icon {
  width: 16px;
  height: 16px;
}
.back {
  background-color: rgba(0, 40, 77, 1);
  overflow: hidden;
}
#logo {
  height: 60px;
  width: 10vw;
  object-fit: contain;
  object-position: center;
  margin: 6px 15px 6px 15px;
}
</style>
