<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import informationCard from '../component/informationCard.vue'
import { onMounted, ref } from 'vue'
import DetailShow from '../component/detailShow.vue'
import { getOrderDetail } from '../apis/oders'
import { dialogEmits } from 'element-plus'

const props = defineProps<{
  data: { id: number };
}>();

// 数据
const detail = ref<any>()
const basicData = ref<any[]>([])

onMounted(async () => {
  // getDetail()
   console.log('Detail.vue -props.data.id', props.data.id);
  if (props.data.id) {
    // console.log('Detail.vue -props.data.id', props.data.id);
    const res = await getOrderDetail(props.data.id)
    console.log('Detail.vue -getOderDetail-res', res);
    detail.value = res
    console.log('Detail.vue -detail', detail.value);
    // console.log('Detail.vue -detail.values', detail.value.values);
  }else {
    console.log('找不到订单ID');
  }
})

</script>

<template>
  <div class="col">
    <BordShow content="业务订单详情页" path="业务中心/详情" />
    <!-- <DetailShow :id="props.data.id" :innerId="props.innerId" :customerName="props.customerName" :status="props.status" :createdTime="props.createdTime"></DetailShow> -->
    <DetailShow :id="props.data.id" v-if="detail" :detail="detail" :basicData="basicData" />
  </div>
</template>

<style scoped lang="less"></style>
`
