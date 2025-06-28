<template>
  <div class="col">
    <BordShow content="外购表" path="生产管理/采购/外购表" />
    <div class="greyBack">
      <informationCard :title="`订单-${props.data.orderCode}`" :control="props.control">
        <el-row :gutter="16" class="information-row">
          <el-col v-for="field in fields" :key="field.label" :span="10">
            <div class="field">
              <label class="field-label">{{ field.label }}</label>
              <div v-if="purchaseData.value" class="field-value">
                {{ purchaseData.value }}
              </div>
              <div v-else class="field-value">
                <span class="field-placeholder">暂无数据</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </informationCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BordShow from '@/components/board/SecBoard.vue'
import { ElRow, ElCol } from 'element-plus';
import informationCard from './informationCard.vue';
import { getOrderDetail } from '../function/oders';
import { getPurchaseInfo } from '@/apis/produceControl/purchase/purchaseInfo';


const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
  data: { orderCode: number, purchaseId: number }
}>();

const purchaseData = ref({});

const fields = ref([
  { label: '序号', key: 'id' },
  { label: '材料', key: 'material' },
  { label: '外购模具编号', key: 'mouldNumber' },
  { label: '图片文件', key: 'picture', type: 'file' },
  { label: '图片链接', key: 'pictureUrl' },
  { label: '外购编码', key: 'purchaseCode' },
  { label: '单重', key: 'singleWeight', type: 'number' },
  { label: '规格名称', key: 'specificationName' },
  { label: '供应商', key: 'supplier' },
  { label: '单价', key: 'unitPrice', type: 'number' },
])

onMounted(() => {
  // 初始化获取外购表数据
  getPurchaseData();
});

// getPurchaseData: 获取外购表数据
const getPurchaseData = async () => {
  const res = await getPurchaseInfo(props.data.purchaseId);
  console.log('获取外购表数据:', res);
  if( res.code == 200) {
    purchaseData.value = res.data || {};
  }
}

</script>

<style scoped>
.field {
  margin-bottom: 14px;

  .field-value {
    margin-top: 6px;
    font-size: small;
    color: #707070;
  }
}
</style>
