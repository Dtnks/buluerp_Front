<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import informationCard from '../component/informationCard.vue'
import { onMounted, ref } from 'vue'
import {getOderDetail} from '@/apis/orders.js'
import DetailShow from '../component/detailShow.vue'

const props = defineProps<{ data: { id: number}}>()

// 数据
const detail = ref<any[]>([])
const basicData = ref<any[]>([])

onMounted(() => {
  // getDetail()
})

<<<<<<< HEAD
=======

>>>>>>> 94d902e78fdc79ea6d45b57d589e64b71fb676d6
</script>

<template>
  <div class="col">
    <BordShow content="业务订单详情页" path="业务中心/详情" />
    <DetailShow :id="props.data.id"></DetailShow>
     <!-- <DetailShow /> -->
  </div>
</template>

<style scoped lang="less"></style>
