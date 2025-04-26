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
    <div class="col back"><img id="logo" src="@/assets/icon/logo.png" /></div>
    <el-menu-item index="0" route="/personCenter">
      <el-icon><User /></el-icon>
      <span>个人中心</span>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><img src="@/assets/icon/u9.png" class="icon" /></el-icon>
        <span>订单中心</span>
      </template>
      <el-menu-item index="1-1" route="/orders/customQuery">客户订单</el-menu-item>
      <el-menu-item index="1-1" route="/orders/ProdQuery">产品订单</el-menu-item>
      <el-menu-item index="1-2" route="/orders/show">看板</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title
        ><el-icon><img src="@/assets/icon/u15.png" class="icon" /></el-icon>
        <span>设计部</span></template
      >
      <el-menu-item index="2-1" route="/production/query">设计总表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3" route="/admin">
      <template #title
        ><el-icon><img src="@/assets/icon/u21.png" class="icon" /></el-icon>
        <span>授权管理</span></template
      >
      <el-menu-item index="3-1" route="/admin/manage">管理</el-menu-item>
      <el-menu-item index="3-2" route="/admin/authorization">授权</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4" route="/admin">
      <template #title
        ><el-icon><img src="@/assets/icon/u25.png" class="icon" /></el-icon>
        <span>PMC</span></template
      >
      <el-menu-item index="4-1" route="/admin/manage">布产表</el-menu-item>
      <el-menu-item index="4-2" route="/admin/authorization">分包表</el-menu-item>
      <el-menu-item index="4-3" route="/admin/manage">外购表</el-menu-item>
      <el-menu-item index="4-4" route="/admin/authorization">外购资料表</el-menu-item>
      <el-menu-item index="4-5" route="/admin/manage">物料资料表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5" route="/admin">
      <template #title
        ><el-icon><img src="@/assets/icon/u29.png" class="icon" /></el-icon>
        <span>仓库</span></template
      >
      <el-menu-item index="5-1" route="/admin/manage">胶件库存表</el-menu-item>
      <el-menu-item index="5-2" route="/admin/authorization">成品库存表</el-menu-item>
      <el-menu-item index="5-1" route="/admin/manage">料包库存</el-menu-item>
      <el-menu-item index="5-2" route="/admin/authorization">胶件参数表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="6" route="/admin">
      <template #title
        ><el-icon><img src="@/assets/icon/u21.png" class="icon" /></el-icon>
        <span>注塑部</span></template
      >
      <el-menu-item index="6-1" route="/admin/manage">排产表</el-menu-item>
      <el-menu-item index="6-2" route="/admin/authorization">产品用料表</el-menu-item>
      <el-menu-item index="6-3" route="/admin/manage">物料收发表</el-menu-item>
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
}
#logo {
  height: 60px;
  width: 10vw;
  object-fit: contain;
  object-position: center;
  margin: 6px 15px 6px 15px;
}
</style>
