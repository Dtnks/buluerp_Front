<script setup lang="ts">
import { ref } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import SearchForm from '../component/searchForm.vue'
import SearchList from '../component/searchList.vue'


const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
}>()

const searchParams = ref<Record<string, any>>({}) // 初始为空对象

const handleSearch = (params: Record<string, any>) => {

  const filteredParams = {
    productCode: params.productCode || null,
    productName: params.productName || null,
  }
  searchParams.value = filteredParams
}
</script>

<template>
  <div class="col">
    <BordShow content="产品查询列表" path="产品管理/查询" />
    <div class="bgd">
      <SearchForm @search="handleSearch" />
      <SearchList :queryParams="searchParams" :addTab="props.addTab" />
    </div>
  </div>
</template>

<style scoped>
.bgd {
  padding-left: 20px;
  padding-right: 6px;
}
</style>
