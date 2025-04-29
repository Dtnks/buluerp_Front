<script setup lang="ts">
const props = defineProps({ isCollapse: { type: Boolean }, addTab: { type: Function } })
import { User } from '@element-plus/icons-vue'
import UserInformation from '@/views/person/main/Information.vue'
import CustomQuery from '@/views/person/main/Custom.vue'
import Manufacturers from '@/views/person/main/Manufacturers.vue'
import BusinessShow from '@/views/business/main/Show.vue'
import BusinessQuery from '@/views/business/main/Query.vue'
import ProQuery from '@/views/production/main/Query.vue'
import ProMaterial from '@/views/production/main/Material.vue'
import Admin from '@/views/admin/index.vue'
</script>
<template>
  <el-menu
    id="layout"
    active-text-color="#fff"
    :collapse="isCollapse"
    background-color="rgba(0, 21, 41, 1)"
    class="el-menu-vertical-demo"
    text-color="#fff"
  >
    <div class="row back">
      <img id="logo" src="@/assets/img/logo.png" />
      <div style="color: white; font-size: 25px; white-space: nowrap; overflow: hidden">布鲁科</div>
    </div>
    <el-menu-item @click="addTab('授权管理', Admin)">
      <el-icon><img src="@/assets/icon/u21.png" class="icon" /></el-icon>
      <span>授权管理</span>
    </el-menu-item>
    <el-sub-menu index="1">
      <template #title
        ><el-icon><User /></el-icon> <span>用户中心</span></template
      >
      <el-menu-item @click="addTab('我的信息', UserInformation)">我的信息</el-menu-item>
      <el-menu-item @click="addTab('客户信息', CustomQuery)">客户查询</el-menu-item>
      <el-menu-item @click="addTab('厂商信息', Manufacturers)">厂商查询</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><img src="@/assets/icon/u9.png" class="icon" /></el-icon>
        <span>业务中心</span>
      </template>
      <el-menu-item @click="addTab('订单查询', BusinessQuery)">订单查询</el-menu-item>
      <el-menu-item @click="addTab('订单看板', BusinessShow)">看板</el-menu-item>
    </el-sub-menu>

    <el-sub-menu>
      <template #title
        ><el-icon><img src="@/assets/icon/u25.png" class="icon" /></el-icon>
        <span>产品中心</span></template
      >
      <el-menu-item @click="addTab('产品订单', ProQuery)">产品查询</el-menu-item>
      <el-menu-item @click="addTab('物料资料表', ProMaterial)">物料资料表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title
        ><el-icon><img src="@/assets/icon/u29.png" class="icon" /></el-icon>
        <span>生产管理中心</span></template
      >
      <el-sub-menu index="4-1">
        <template #title><span>采购</span></template>
        <el-menu-item index="4-1-1">采购计划</el-menu-item>
        <el-menu-item index="4-1-2">采购单</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4-2">
        <template #title><span>库存</span></template>
        <el-menu-item index="4-2-1">出入库单</el-menu-item>
        <el-menu-item index="4-2-2">库存查询</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="4-3">
        <template #title><span>生产</span></template>
        <el-menu-item index="4-3-1">布包表</el-menu-item>
        <el-menu-item index="4-3-2">分包表</el-menu-item>
        <el-menu-item index="4-3-2">排产表</el-menu-item>
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
.el-menu-item.is-active {
  background-color: inherit !important;
  border-bottom-color: transparent;
}
</style>
