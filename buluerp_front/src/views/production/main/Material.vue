<script setup lang="ts">
import { ref } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import MaterialForm from '../component/materialForm.vue';
import MaterialList from '../component/materialList.vue';
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any,targetPath?:string) => void
}>()

const searchParams = ref<Record<string, any>>({}) // 初始为空对象

const handleSearch = (params: Record<string, any>) => {
  console.log('父组件收到搜索参数', params)
  const filteredParams = {
    mouldNumber: params.mouldNumber || null,
    mouldManufacturer: params.mouldManufacturer || null,
    purchased: params.purchased || null,
  }
  searchParams.value = filteredParams
  console.log('父组件发送搜索参数', searchParams.value)
}

const handleCreated = () => {
  handleSearch(searchParams.value)
}
</script>
<template>
  <div>
    <BordShow content="物料查询列表" path="物料管理/物料" />
    <div class="greyBack">
      <MaterialForm @search="handleSearch" @created="handleCreated"/>
      <MaterialList :queryParams="searchParams" :addTab="props.addTab"/>
    </div>
  </div>
</template>
