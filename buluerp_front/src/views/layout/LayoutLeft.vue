<script setup lang="ts">
const props = defineProps({ isCollapse: { type: Boolean } })
</script>
<template>
  <el-menu
    id="layout"
    active-text-color="#fff"
    :collapse="isCollapse"
    background-color="rgba(0, 21, 41, 1)"
    class="el-menu-vertical-demo"
    default-active="2"
    text-color="#fff"
  >
    <div class="col back"><img id="logo" src="../../assets/icon/logo.png" /></div>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><img src="../../assets/icon/u9.png" class="icon" /></el-icon>
        <span>业务中心</span>
      </template>
      <el-menu-item index="1-1">查询/详情</el-menu-item>
      <el-menu-item index="1-2">看板</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title
        ><el-icon><img src="../../assets/icon/u15.png" class="icon" /></el-icon>
        <span>产品管理</span></template
      >
      <el-menu-item index="2-1">查询/详情</el-menu-item>
      <el-menu-item index="2-2">物料</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3">
      <el-icon><img src="../../assets/icon/u21.png" class="icon" /></el-icon>
      <span>待定</span>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><img src="../../assets/icon/u25.png" class="icon" /></el-icon>
      <span>待定</span>
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon><img src="../../assets/icon/u29.png" class="icon" /></el-icon>
      <span>待定</span>
    </el-menu-item>
    <el-menu-item index="6">
      <el-icon><img src="../../assets/icon/u33.png" class="icon" /></el-icon>
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
