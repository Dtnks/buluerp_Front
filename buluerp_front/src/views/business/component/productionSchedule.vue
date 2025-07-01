<template>
  <div class="col">
    <BordShow content="布产表" path="生产管理/生产/布产表" />
    <div class="greyBack">
      <informationCard :title="`订单-${props.data.orderCode}`" :control="props.control">
        <el-row v-if="scheduleData.id != null" :gutter="16" class="information-row">
          <el-col v-for="field in fields" :key="field.label" :span="10">
            <div class="field">
              <label class="field-label">{{ field.label }}</label>
              <div class="field-value">
                <span v-if="field.value == 'orderCode'">{{ props.data.orderCode }}</span>
                <span v-else-if="field.value == 'id'">{{ scheduleData[field.value] }}</span>
                <el-input v-else v-model="updatedFields[field.value]"
                  :placeholder="scheduleData[field.value] ? '' : '暂无数据'" class="field-input"></el-input>
              </div>
            </div>
          </el-col>
        </el-row>
        <div v-else class="no-data">
          <span class="no-data-text">暂无数据</span>
          <el-button @click="onAdd">点击新增</el-button>
        </div>
      </informationCard>
    </div>
    <el-footer class="footer" v-if="scheduleData.id != null">
      <el-button @click="onCancel">取消</el-button>
      <!-- <el-button v-if="scheduleData.id == null" type="primary" @click="onAddSubmit">新增</el-button> -->
      <el-button type="primary" @click="onUpdateSubmit">提交修改</el-button>
    </el-footer>
  </div>
  <el-dialog v-model="newDialogVisible" title="新增布产表" width="500px" center>
    <el-form ref="formRef" :model="updatedFields" label-width="80px">
      <el-form-item label="订单编号">
        <el-input v-model="updatedFields.orderCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="排产ID">
        <el-input v-model="updatedFields.arrangeId"></el-input>
      </el-form-item>
      <el-form-item label="产品ID">
        <el-input v-model="updatedFields.productId"></el-input>
      </el-form-item>
      <el-form-item label="模具编码">
        <el-input v-model="updatedFields.mouldCode"></el-input>
      </el-form-item>
      <el-form-item label="腔数PCS">
        <el-input v-model="updatedFields.cavityCount"></el-input>
      </el-form-item>
      <el-form-item label="颜色编码">
        <el-input v-model="updatedFields.colorCode"></el-input>
      </el-form-item>
      <el-form-item label="色粉需求KG">
        <el-input v-model="updatedFields.colorPowderNeeded"></el-input>
      </el-form-item>
      <el-form-item label="客户">
        <el-input v-model="updatedFields.customer"></el-input>
      </el-form-item>
      <el-form-item label="生产周期">
        <el-input v-model="updatedFields.cycleTime"></el-input>
      </el-form-item>
      <el-form-item label="库存">
        <el-input v-model="updatedFields.inventory"></el-input>
      </el-form-item>
      <el-form-item label="物料ID表">
        <el-input v-model="updatedFields.materialIds"></el-input>
      </el-form-item>
      <el-form-item label="物料类型">
        <el-input v-model="updatedFields.materialType"></el-input>
      </el-form-item>
      <el-form-item label="模具状态">
        <el-input v-model="updatedFields.mouldCondition"></el-input>
      </el-form-item>
      <el-form-item label="模具厂家">
        <el-input v-model="updatedFields.mouldManufacturer"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onAddSubmit"> 确认新增 </el-button>
        <el-button type="info" @click="() => { newDialogVisible = false }"> 取消 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BordShow from '@/components/board/SecBoard.vue'
import { ElRow, ElCol, ElFooter, ElButton, ElInput, ElDialog, ElFormItem, ElForm } from 'element-plus';
import informationCard from './informationCard.vue';
import { getProdunctionSchedeuleByOrderCode, newSchedule } from '@/apis/produceControl/produce/schedule';
// import useProductionSchedule from '../function/productionSchedule';
const updatedFields = ref({})
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
  data: { orderCode: number }
}>();
const newDialogVisible = ref(false);
const scheduleData = ref<{ [value: string]: any }>({});
const fields = ref([
  { value: 'id', label: 'ID', },
  { value: 'orderCode', label: '订单编号' },
  { value: 'cavityCount', label: '腔数PCS' },
  { value: 'colorCode', label: '颜色编码' },
  { value: 'colorPowderNeeded', label: '色粉需求KG', },
  { value: 'creationTime', label: '创建时间', type: 'date' },
  { value: 'customer', label: '客户', },
  { value: 'cycleTime', label: '生产周期', },
  { value: 'inventory', label: '库存', },
  { value: 'materialIds', label: '物料ID列表', },
  { value: 'materialType', label: '物料类型', },
  { value: 'mouldCondition', label: '模具状态', },
  { value: 'mouldManufacturer', label: '模具厂家', },
  { value: 'operator', label: '操作人', },
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
  const res = await getProdunctionSchedeuleByOrderCode(props.data.orderCode);
  console.log('获取采购表数据:', res);
  if (res.code == 200) {
    scheduleData.value = res.rows[0] || {};
    console.log('获取采购表数据成功:', scheduleData.value);
    // 更新 updatedFields 的值
    updatedFields.value = {
      ...scheduleData.value,
      orderCode: props.data.orderCode, // 保持订单编号不变
      id: scheduleData.value.id, // 保持id不变
    };
    return scheduleData.value;
  } else {
    // scheduleData.value = { id: 0, material: '未知', mouldNumber: '未知', picture: '11', pictureUrl: '11', purchaseCode: '未知', singleWeight: 0, specificationName: '未知', supplier: '未知', unitPrice: 0 };
    updatedFields.value = scheduleData.value;
    console.log('获取采购表数据失败:', scheduleData.value);
  }
}
// footer
const onCancel = () => {

}

const onAdd = () => {
  newDialogVisible.value = true;
  // updatedFields.value = {
  //   orderCode: props.data.orderCode, // 保持订单编号不变
  //   cavityCount: '',
  //   colorCode: '',
  //   colorPowderNeeded: '',
  //   customer: '',
  //   cycleTime: '',
  //   inventory: '',
  //   materialIds: '',
  //   materialType: '',
  //   mouldCondition: '',
  //   mouldManufacturer: ''
  // };
  console.log('新增布产表数据：', updatedFields.value);
}
const onAddSubmit = async () => {
  console.log('新增布产表数据88888', updatedFields.value);
  const res = await newSchedule(updatedFields.value);
  console.log('新增布产表请求结果:', res);
  if (res.code == 200) {
    console.log('新增布产表成功:', res);
  } else {
    console.log('新增布产表失败:', res);
  }
  newDialogVisible.value = false;
  getscheduleData();
}

const onUpdateSubmit = () => {
}
</script>

<style scoped lang="less">
.col {
  display: flex;
  flex-direction: column;

  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 280px;

    .no-data-text {
      margin-bottom: 10px;
      font-size: 16px;
      color: #999;
    }
  }

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
