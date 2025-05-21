<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import informationCard from '../component/informationCard.vue'
import { onMounted, ref } from 'vue'
import {getOderDetail} from '@/apis/orders'
import DetailShow from '../component/detailShow.vue'

const props = defineProps<{ data: { id: number}}>()



</script>

<template>
  <div class="col">
    <BordShow content="业务订单详情页" path="业务中心/详情" />
    <DetailShow :id="props.data.id"></DetailShow>
  </div>
</template>

<style scoped lang="less"></style>
