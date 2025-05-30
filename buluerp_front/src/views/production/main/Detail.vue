<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import basicInfomation from '../component/basicInfomation.vue'
import { getProductDetail } from '@/apis/products.js'
import { getMaterialList } from '@/apis/materials.js'

const props = defineProps<{ data: any; control: Array<object> }>()

const detail = ref(props.data)
</script>

<template>
  <div class="col">
    <BordShow content="产品详情页" path="产品管理/详情" />
    <basicInfomation
      v-if="detail"
      :detail="detail"
      :materialData="materialData"
      :control="control"
    />
  </div>
</template>
