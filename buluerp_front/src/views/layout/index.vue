<script setup lang="ts">
import LayoutLeft from '@/views/layout/main/LayoutLeft.vue'
import LayoutTop from '@/views/layout/main/LayoutTop.vue'
import { ref } from 'vue'
import LoadingComponent from '@/components/Loading.vue'
// import type { TabPaneName } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'
import useTabStore from '@/stores/modules/tabs'
import router from '@/router'
import BlankComponent from '@/router/BlankComponent.vue'
// const editableTabsValue = ref('')
const store = useTabStore()
// const addTab = (targetName: string, component, data,targetPath?:string) => {
//   editableTabsValue.value = store.addTab(targetName, component, data,targetPath)
// }

// const removeTab = (targetName: TabPaneName) => {
//   editableTabsValue.value = store.removeTab(targetName, editableTabsValue.value)
// }
const isCollapse = ref(false)
const reverse = ref('')
const handleHiddenMenu = () => {
  isCollapse.value = !isCollapse.value
  reverse.value = reverse.value == '' ? 'flipped-image' : ''
}
import { defineAsyncComponent } from 'vue'

const ComponentsGroup = {
  UserInformation: () => import('@/views/person/main/Information.vue'),
  CustomQuery: () => import('@/views/person/main/Custom.vue'),
  Manufacturers: () => import('@/views/person/main/Manufacturers.vue'),
  BusinessShow: () => import('@/views/business/main/Show.vue'),
  BusinessQuery: () => import('@/views/business/main/Query.vue'),
  BusinessDetail: () => import('@/views/business/main/Detail.vue'),
  ProductionSchedule: () => import('@/views/business/component/productionSchedule.vue'),
  PurchaseInfo: () => import('@/views/business/component/purchasePlan.vue'),
  ProQuery: () => import('@/views/production/main/Query.vue'),
  ProductDetail: () => import('@/views/production/main/Detail.vue'),
  ProMaterial: () => import('@/views/production/main/Material.vue'),
  ProMaterialType: () => import('@/views/production/main/MaterialType.vue'),
  DesignTable: () => import('@/views/production/main/DesignTable.vue'),
  Admin: () => import('@/views/admin/Admin.vue'),
  Audit: () => import('@/views/admin/Audit.vue'),
  Role: () => import('@/views/admin/Role.vue'),
  Log: () => import('@/views/admin/Log.vue'),
  AuditPage: () => import('@/views/Audit/Audit.vue'),
  PMInventoryList: () => import('@/views/PMcenter/inventory/main/List.vue'),
  PMInventoryQuery: () => import('@/views/PMcenter/inventory/main/Query.vue'),
  PMProcurementQuery: () => import('@/views/PMcenter/procurement/main/List.vue'),
  PMProcurementPlan: () => import('@/views/PMcenter/procurement/main/Plan.vue'),
  PMProcurementOut: () => import('@/views/PMcenter/procurement/main/Outpurchase.vue'),
  PMProduceArrange: () => import('@/views/PMcenter/produce/main/Arrange.vue'),
  PMProduceSchedule: () => import('@/views/PMcenter/produce/main/Schedule.vue'),
  PMProducePackaging: () => import('@/views/PMcenter/produce/main/Packaging.vue'),
  PMProducePackagingDetail: () => import('@/views/PMcenter/produce/component/PackagingDetail.vue'),
}
const LazyComponentsGroup = new Proxy(
  {},
  {
    get(target, prop) {
      if (!target[prop] && ComponentsGroup[prop]) {
        target[prop] = defineAsyncComponent({
          loader: ComponentsGroup[prop],
          loadingComponent: LoadingComponent,
        })
      }
      return target[prop]
    },
  },
)

</script>
<template>
  <div class="row">
    <LayoutLeft :isCollapse="isCollapse" :addTab="store.addTab" />
    <div class="col" style="flex: 1; height: 100vh; overflow-y: scroll">
      <LayoutTop :handleHiddenMenu="handleHiddenMenu" :reverse="reverse" :addTab="store.addTab" />
      <el-tabs
        v-model="store.editableTabsValue"
        type="card"
        class="demo-tabs"
        closable
        editable
        @tab-remove="store.removeTab"
        @tab-click="(item)=>{
          router.push({name:item.props.name})}"
      >
        <template #add-icon>
          <el-icon @click="store.removeTab('all')"><CircleClose /></el-icon>
        </template>
        
          <router-view>
          <el-tab-pane
            class="col"
            v-for="item in store.editableTabs"
            :key="item.name"
            :label="item.title"
            :name="item.targetPath"
          >
            <keep-alive>
              <component
                :is="LazyComponentsGroup[item.component]"
                :addTab="store.addTab"
                :data="item.data"
                :key="item.key"
              ></component>
            </keep-alive>
          </el-tab-pane>
        </router-view>
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
