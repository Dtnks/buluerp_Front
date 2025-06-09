<script setup lang="ts">
const props = defineProps({
  isCollapse: { type: Boolean },
  addTab: { type: Function },
})
import useMenuState from '@/stores/modules/menu.js'
import { ref, onMounted } from 'vue'
import { Grid, Memo, CircleCheck, User, Menu } from '@element-plus/icons-vue'
const menuStore = useMenuState()
const menuOptions = ref([])
onMounted(async () => {
  await menuStore.refreshMenu()
  console.log('menuStore.menu.children:', menuStore.menu.children)
  menuOptions.value = menuStore.menu.children
})

import UserInformation from '@/views/person/main/Information.vue'
import CustomQuery from '@/views/person/main/Custom.vue'
import Manufacturers from '@/views/person/main/Manufacturers.vue'
import BusinessShow from '@/views/business/main/Show.vue'
import BusinessQuery from '@/views/business/main/Query.vue'
import ProQuery from '@/views/production/main/Query.vue'
import ProMaterial from '@/views/production/main/Material.vue'
import DesignTable from '@/views/production/main/DesignTable.vue'
import Admin from '@/views/admin/Admin.vue'
import Role from '@/views/admin/Role.vue'
import PMInventoryList from '@/views/PMcenter/inventory/main/List.vue'
import PMInventoryQuery from '@/views/PMcenter/inventory/main/Query.vue'
import PMProcurementQuery from '@/views/PMcenter/procurement/main/List.vue'
import PMProcurementPlan from '@/views/PMcenter/procurement/main/Plan.vue'
import PMProduceArrange from '@/views/PMcenter/produce/main/Arrange.vue'
import PMProduceSchedule from '@/views/PMcenter/produce/main/Schedule.vue'
import PMProducePackaging from '@/views/PMcenter/produce/main/Packaging.vue'
const ComponentsGroup = {
  UserInformation,
  CustomQuery,
  Manufacturers,
  BusinessShow,
  BusinessQuery,
  ProQuery,
  ProMaterial,
  DesignTable,
  Admin,
  Role,
  PMInventoryList,
  PMInventoryQuery,
  PMProcurementQuery,
  PMProcurementPlan,
  PMProduceArrange,
  PMProduceSchedule,
  PMProducePackaging,
}
const IconGroup = { Grid, Memo, CircleCheck, User, Menu }
</script>
<template>
  <el-menu
    id="layout"
    :collapse="isCollapse"
    background-color="rgba(0, 21, 41, 1)"
    text-color="#fff"
    :collapse-transition="false"
  >
    <div class="row back">
      <img id="logo" src="@/assets/img/logo.png" />
      <div style="color: white; font-size: 25px; white-space: nowrap">布鲁科</div>
    </div>
    <div v-for="item in menuOptions" :key="item.id">
      <el-sub-menu :index="item.id" v-if="!item.disabled">
        <template #title
          ><el-icon><component :is="IconGroup[item.path]"></component></el-icon
          ><span v-if="!isCollapse">{{ item.label }}</span></template
        >
        <div v-for="subItem in item.children" :key="subItem.id">
          <el-menu-item
            :index="subItem.id"
            @click="addTab(subItem.label, ComponentsGroup[subItem.path], null, subItem.children)"
            v-if="!subItem.disabled && subItem.path != '/'"
          >
            {{ subItem.label }}
          </el-menu-item>
          <el-sub-menu :index="subItem.id" v-else-if="!subItem.disabled">
            <template #title
              ><span>{{ subItem.label }}</span></template
            >
            <el-menu-item
              v-for="subSubItem in subItem.children"
              :key="subSubItem.id"
              :index="subSubItem.id"
              @click="
                addTab(
                  subSubItem.label,
                  ComponentsGroup[subSubItem.path],
                  null,
                  subSubItem.children,
                )
              "
              >{{ subSubItem.label }}</el-menu-item
            >
          </el-sub-menu>
        </div>
      </el-sub-menu>
    </div>
  </el-menu>
</template>
<style scoped>
#layout {
  height: 100vh;
  overflow-y: scroll;
  scrollbar-width: none;
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
  width: 70px !important;
}
.el-menu-item.is-active {
  background-color: inherit !important;
  border-bottom-color: transparent;
}
</style>
