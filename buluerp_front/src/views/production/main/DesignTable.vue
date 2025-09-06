<script setup lang="ts">
import { ref } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import DesignForm from '../component/designForm.vue';
import DesignList from '../component/designList.vue';
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any, targetPath?: string) => void
}>()

const searchParams = ref<Record<string, any>>({}) // 初始为空对象

const handleSearch = (params: Record<string, any>) => {
  const filteredParams = {
    confirm: params.confirm || null,
    createUserId: params.createUserId || null,
    orderId: params.orderId || null,
    productId: params.productId || null,
  }
  searchParams.value = filteredParams
}

const handleCreated = () => {
  handleSearch(searchParams.value)
}
</script>
<template>
  <div class="col">
    <BordShow content="设计总表查询列表" path="设计管理/查询" />
    <div class="greyBack">
      <DesignForm @search="handleSearch" @created="handleCreated" />
      <DesignList :queryParams="searchParams" :addTab="props.addTab" />
    </div>
  </div>
</template>
