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
      // 同时发起两个请求
      const [productResponse, materialResponse] = await Promise.all([
        getProductDetail(props.data.id),
        getMaterialList(props.data.id), 
      ])
      
      detail.value = productResponse.data
      materialData.value = materialResponse.data
    } catch (error) {
      console.error('获取数据失败：', error)
    }
  }
})
</script>

<template>
  <div class="col">
    <BordShow content="产品详情页" path="产品管理/详情" />
    <basicInfomation v-if="detail" :detail="detail" :materialData="materialData"/>
  </div>
</template>
