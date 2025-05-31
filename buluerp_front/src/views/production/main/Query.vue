<script setup lang="ts">
import { ref } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import SearchForm from '../component/searchForm.vue'
import SearchList from '../component/searchList.vue'

const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
}>()

const searchParams = ref<Record<string, any>>({}) // 初始为空对象

const handleSearch = (params: Record<string, any>) => {
  console.log('父组件收到搜索参数', params)
  const filteredParams = {
    id: params.productCode || null,
    name: params.productName || null,
    designStatus: params.productStatus || null,
    createUsername: params.creatorName || null,
    createTimeFrom: params.createDate?.[0] || null,
    createTimeTo: params.createDate?.[1] || null,
    otherSearch: params.otherSearch || null,
  }
  searchParams.value = filteredParams
  console.log('父组件发送搜索参数', searchParams.value)
}

const handleCreated = () => {
  handleSearch(searchParams.value)
}
</script>

<template>
  <div class="col">
    <BordShow content="产品查询列表" path="产品管理/查询" />
    <div class="greyBack">
      <SearchForm @search="handleSearch" @created="handleCreated" :control="control"  />
      <SearchList :queryParams="searchParams" :addTab="props.addTab" :control="control" />
    </div>
  </div>
</template>
