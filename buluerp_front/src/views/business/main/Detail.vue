<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import informationCard from '../component/informationCard.vue'
import { onMounted, ref } from 'vue'
import DetailShow from '../component/detailShow.vue'
import { getOrderDetail } from '../function/oders'
import { dialogEmits } from 'element-plus'
import { messageBox } from '../../../components/message/messageBox'

const props = defineProps<{
  data: { id: number }
  control: Array<object>
}>()
console.log(props.control)
// 数据
const detail = ref<any>()
const basicData = ref<any[]>([])

onMounted(async () => {
  if (props.data.id) {
    const res = await getOrderDetail(props.data.id)
    detail.value = res
  } else {
    console.log('找不到订单ID')
    messageBox('找不到订单ID', 'error')
  }
})
</script>

<template>
  <div class="col">
    <BordShow content="业务订单详情页" path="业务中心/详情" />
    <DetailShow
      :id="props.data.id"
      v-if="detail"
      :detail="detail"
      :basicData="basicData"
      :control="control"
    />
  </div>
</template>

<style scoped lang="less"></style>
`
