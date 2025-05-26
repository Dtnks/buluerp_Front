<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import basicInfomation from '../component/basicInfomation.vue'
import { getProductDetail } from '@/apis/products.js'
import { getMaterialList } from '@/apis/materials.js'

// 接收父组件传来的 id
const props = defineProps<{ data: { id: number } }>()

// 详情数据
const detail = ref<any>(null)
const materialData = ref<any[]>([])

onMounted(async () => {
  if (props.data?.id) {
    try {
      const productResponse = await getProductDetail(props.data.id)
      detail.value = productResponse.data

      const materialIds = productResponse.data.materialIds || []

      const materialPromises = materialIds.map((id) => getMaterialList({ id }))

      const materialResponses = await Promise.all(materialPromises)

      materialData.value = materialResponses.map((res) => res.data)
    } catch (error) {
      console.error('获取数据失败：', error)
    }
  }
})
</script>

<template>
  <div class="col">
    <BordShow content="产品详情页" path="产品管理/详情" />
    <basicInfomation v-if="detail" :detail="detail" :materialData="materialData" />
  </div>
</template>
