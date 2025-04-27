<script setup lang="ts">
const props = defineProps({ isCollapse: { type: Boolean } })
import { User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
const activeIndex = ref('1')
const path = router.currentRoute.value.fullPath
if (path == '/orders/query' || path == '/orders/detail') {
  activeIndex.value = '1-1'
} else if (path == '/orders/show') {
  activeIndex.value = '1-2'
} else if (path == '/production/query' || path == '/production/detail') {
  activeIndex.value = '2-1'
} else if (path == '/personCenter') {
  activeIndex.value = '0'
}
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
    <div class="row back">
      <img id="logo" src="@/assets/img/logo.png" />
      <div style="color: white; font-size: 25px; white-space: nowrap; overflow: hidden">布鲁科</div>
    </div>
    <el-menu-item index="0" route="/admin">
      <el-icon><img src="@/assets/icon/u21.png" class="icon" /></el-icon>
      <span>授权管理</span>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title
        ><el-icon><User /></el-icon> <span>用户中心</span></template
      >
      <el-menu-item index="1-1" route="/personCenter/information">我的信息</el-menu-item>
      <el-menu-item index="1-2" route="/personCenter/custom">客户查询</el-menu-item>
      <el-menu-item index="1-3" route="/personCenter/manufacturers">厂商查询</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><img src="@/assets/icon/u9.png" class="icon" /></el-icon>
        <span>业务中心</span>
      </template>
      <el-menu-item index="2-1" route="/business/query">订单查询</el-menu-item>
      <el-menu-item index="2-2" route="/business/show">看板</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="3">
      <template #title
        ><el-icon><img src="@/assets/icon/u25.png" class="icon" /></el-icon>
        <span>产品中心</span></template
      >
      <el-menu-item index="3-1" route="/production/query">产品查询</el-menu-item>
      <el-menu-item index="3-2" route="/production/material">物料资料表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title
        ><el-icon><img src="@/assets/icon/u29.png" class="icon" /></el-icon>
        <span>生产管理中心</span></template
      >
      <el-sub-menu index="4-1">
        <template #title><span>采购</span></template>
        <el-menu-item index="4-1-1" route="/PMcenter/procurement/plan">采购计划</el-menu-item>
        <el-menu-item index="4-1-2" route="/PMcenter/procurement/list">采购单</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4-2">
        <template #title><span>库存</span></template>
        <el-menu-item index="4-2-1" route="/PMcenter/inventory/list">出入库单</el-menu-item>
        <el-menu-item index="4-2-2" route="/PMcenter/inventory/query">库存查询</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4-3">
        <template #title><span>生产</span></template>
        <el-menu-item index="4-3-1" route="/PMcenter/produce">布包表</el-menu-item>
        <el-menu-item index="4-3-2" route="/PMcenter/produce">分包表</el-menu-item>
        <el-menu-item index="4-3-2" route="/PMcenter/produce">排产表</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu>
</template>
<style scoped>
#layout {
  height: 100vh;
  overflow-y: scroll;
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
  height: 72px;
  align-items: center;
}
#logo {
  height: 50px;
  width: 50px;
  object-fit: contain;
  object-position: center;
  margin: 6px 15px 6px 15px;
}
.el-menu--collapse {
  width: 80px !important;
}
</style>
