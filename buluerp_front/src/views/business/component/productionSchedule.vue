<template>
  <div class="col">
    <BordShow content="布产表" path="生产管理/生产/布产表" />
    <div class="greyBack">
      <informationCard :title="`订单-${props.data.orderCode}`" :control="props.control">
        <el-row :gutter="16" class="information-row">
          <el-col v-for="field in fields" :key="field.label" :span="10">
            <div class="field">
              <label class="field-label">{{ field.label }}</label>
              <div v-if="scheduleData.value" class="field-value">
                {{ scheduleData.value }}
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
import { getProdunctionSchedeuleByOrderCode } from '@/apis/produceControl/produce/schedule';
import useProductionSchedule from '../function/productionSchedule';

const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
  data: { orderCode: number }
}>();

const scheduleData = ref({});
const fields = ref([
  { value: 'cavityCount', label: '腔数PCS' },
  { value: 'colorCode', label: '颜色编码' },
  { value: 'colorPowderNeeded', label: '色粉需求KG', type: 'text' },
  { value: 'creationTime', label: '创建时间', type: 'date' },
  { value: 'customer', label: '客户', type: 'text' },
  { value: 'cycleTime', label: '生产周期', type: 'text' },
  { value: 'id', label: 'ID', type: 'text' },
  { value: 'inventory', label: '库存', type: 'text' },
  { value: 'materialIds', label: '物料ID列表', type: 'text' },
  { value: 'materialType', label: '物料类型', type: 'text' },
  { value: 'mouldCondition', label: '模具状态', type: 'text' },
  { value: 'mouldManufacturer', label: '模具厂家', type: 'text' },
  { value: 'operator', label: '操作人', type: 'text' },
  { value: 'picture', label: '图片', type: 'image' },
])

// const fields = ref({});

const getFields = async () => {
  const res = await getProdunctionSchedeuleByOrderCode(props.data.orderCode)
  if (res.code === 200) {
    scheduleData.value = res.data;
    console.log('获取包装信息成功:', fields.value);

  } else {
    scheduleData.value = {};
  }
  console.log(res, '获取布产表数据axsa');

}

onMounted(() => {
  getFields();
});


</script>

<style scoped lang="less">
.field {
  margin-bottom: 14px;

  .field-value {
    margin-top: 6px;
    font-size: small;
    color: #707070;
  }
}
</style>
