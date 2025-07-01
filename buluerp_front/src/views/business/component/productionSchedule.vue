<template>
  <div class="col">
    <BordShow content="布产表" path="生产管理/生产/布产表" />
    <div class="greyBack">
      <informationCard :title="`订单-${props.data.orderCode}`" :control="props.control">
        <el-row :gutter="16" class="information-row">
          <el-col v-for="field in fields" :key="field.label" :span="10">
            <div class="field">
              <label class="field-label">{{ field.label }}</label>
              <div v-if="scheduleData[field.value] != null" class="field-value">
                <span v-if="field.value == 'orderCode'">{{ props.data.orderCode }}</span>
                <span v-else-if="field.value == 'id'">{{ scheduleData[field.value] }}</span>
                <el-input v-else v-model="updatedFields[field.value]" class="field-input"></el-input>
              </div>
              <div v-else class="field-value">
                <span v-if="field.value == 'orderCode'">{{ props.data.orderCode }}</span>
                <span v-else-if="field.key == 'id'">暂无数据</span>
                <el-input v-else v-model="updatedFields[field.value]" placeholder="暂无数据" class="field-input"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
      </informationCard>
    </div>
        <el-footer class="footer">
      <el-button @click="onCancel">取消</el-button>

      <el-button v-if="scheduleData.id == null" type="primary" @click="onAddSubmit">新增</el-button>
      <el-button v-else type="primary" @click="onUpdateSubmit">修改</el-button>


    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BordShow from '@/components/board/SecBoard.vue'
import { ElRow, ElCol, ElFooter, ElButton, ElInput } from 'element-plus';
import informationCard from './informationCard.vue';
import { getProdunctionSchedeuleByOrderCode } from '@/apis/produceControl/produce/schedule';
import useProductionSchedule from '../function/productionSchedule';
const updatedFields = ref({})
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
  data: { orderCode: number }
}>();

const scheduleData = ref<{ [value: string]: any }>({});
const fields = ref([
  { value: 'id', label: 'ID',  },
  {value: 'codeOrder', label:'订单编号'},
  { value: 'cavityCount', label: '腔数PCS' },
  { value: 'colorCode', label: '颜色编码' },
  { value: 'colorPowderNeeded', label: '色粉需求KG',  },
  { value: 'creationTime', label: '创建时间', type: 'date' },
  { value: 'customer', label: '客户',  },
  { value: 'cycleTime', label: '生产周期',  },
  
  { value: 'inventory', label: '库存',  },
  { value: 'materialIds', label: '物料ID列表',  },
  { value: 'materialType', label: '物料类型',  },
  { value: 'mouldCondition', label: '模具状态',  },
  { value: 'mouldManufacturer', label: '模具厂家',  },
  { value: 'operator', label: '操作人',  },
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
  // 初始化获取采购表数据
  getscheduleData();
  // updatedFields.value = {
  //   orderCode: props.data.orderCode, // 保持订单编号不变
  // };
});

// getscheduleData: 获取采购表数据
const getscheduleData = async () => {
  const res = await detailPurchasePlan(props.data.orderCode);
  console.log('获取采购表数据:', res);
  if (res.code == 200) {
    scheduleData.value = res.rows[0] || {};
    console.log('获取采购表数据成功:', scheduleData.value);
    // 更新 updatedFields 的值
    updatedFields.value = {
      ...scheduleData.value,
      orderCode: props.data.orderCode, // 保持订单编号不变
      // id: scheduleData.value.id , // 保持id不变
    };
    return scheduleData.value;  
  } else {
    scheduleData.value = { id: 0, material: '未知', mouldNumber: '未知', picture: '11', pictureUrl: '11', purchaseCode: '未知', singleWeight: 0, specificationName: '未知', supplier: '未知', unitPrice: 0 };
    console.log('获取采购表数据失败:', scheduleData.value);
  }
}
// footer
const onCancel = () => {

}
const onAddSubmit = () => {

}

const onUpdateSubmit = () => {
}
</script>

<style scoped lang="less">
.col {
  display: flex;
  flex-direction: column;

  .footer {
    display: flex;
    justify-content: flex-end;
    padding: 13px;
    background-color: #fbfbfb;
    border-top: 1px solid #ebeef5;
    box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.1);
  }
}

.field {
  margin-bottom: 14px;

  .field-value {
    margin-top: 6px;
    font-size: small;
    color: #707070;
  }
}
</style>
