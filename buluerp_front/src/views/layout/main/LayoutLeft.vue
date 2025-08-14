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
  menuOptions.value = menuStore.menu.children
})

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
            @click="
              addTab(subItem.label, subItem.path, null,subItem.path, subItem.children)
            "
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
                  subSubItem.path,
                  null,
                  subSubItem.path,
                  subSubItem.children,
                )
              "
              >
                {{ subSubItem.label }}
              </el-menu-item
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
a{
  color: #fff !important;
  text-decoration: none !important;
  width: 100%;
}
</style>
