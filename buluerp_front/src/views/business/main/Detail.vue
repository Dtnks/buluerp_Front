<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import { onMounted, ref } from 'vue'
import DetailShow from '../component/detailShow.vue'
import { getOrderDetail, getOderProducts } from '../function/oders'
import { messageBox } from '../../../components/message/messageBox'

const props = defineProps<{
  data: { id: number }
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
}>();

// 数据
const detail = ref<any>()
const basicData = ref<any[]>([])
const orderProduct = ref<any[]>([])

onMounted(async () => {
  if (props.data.id) {
    const detailRes = await getOrderDetail(props.data.id)
    detail.value = detailRes
    const productsRes = await getOderProducts(props.data.id)
    orderProduct.value = productsRes
    console.log('1231323242424');

  } else {
    console.log('找不到订单ID');
    messageBox('找不到订单ID', 'error')
  }
})

</script>

<template>
  <div class="col">
    <BordShow content="业务订单详情页" path="业务中心/详情" />
    <DetailShow :id="props.data.id" v-if="detail" :detail="detail" :basicData="basicData" :addTab="addTab"  :control="control" />
  </div>
</template>

<style scoped lang="less"></style>
`
