<template>
  <div class="col">
    <BordShow content="采购表" path="生产管理/采购/采购表" />
    <div class="greyBack">
      <informationCard :title="`订单-${props.data.orderCode}`" :control="props.control">
        <el-row v-if="purchaseData.id != null" :gutter="16" class="information-row">
          <el-col v-for="field in fields" :key="field.label" :span="10">
            <div class="field">
              <label class="field-label">{{ field.label }}</label>
              <div class="field-value">
                <span v-if="field.value == 'orderCode'">{{ props.data.orderCode }}</span>
                <span v-else-if="field.value == 'id'">{{ purchaseData[field.value] }}</span>
                <el-input v-else v-model="updatedFields[field.value]"
                  :placeholder="purchaseData[field.value] ? '' : '暂无数据'" class="field-input"></el-input>
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
    <el-footer class="footer" v-if="purchaseData.id != null">
      <el-button @click="onCancel">取消</el-button>
      <!-- <el-button v-if="scheduleData.id == null" type="primary" @click="onAddSubmit">新增</el-button> -->
      <el-button type="primary" @click="onUpdateSubmit">提交修改</el-button>
    </el-footer>
  </div>
  <el-dialog v-model="newDialogVisible" title="新增采购表">
    <el-form :model="updatedFields" label-width="80px">
      <el-form-item label="订单编号">
        <el-input v-model="updatedFields.orderCode" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item label="产品ID">
        <el-input v-model="updatedFields.productId" placeholder="请输入产品ID"></el-input>
      </el-form-item>
      <el-form-item label="材料类型">
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="onAddSubmit"> 确认新增</el-button>
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
import { changePurchasePlan, detailPurchasePlan, newPurchasePlan } from '@/apis/produceControl/purchase/purchasePlan';
import { messageBox } from '@/components/message/messageBox';
import useTabStore from '@/stores/modules/tabs';


const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
  data: { orderCode: string, purchaseId: number, orderId: number }
}>();
const newDialogVisible = ref(false);
const tabStore = useTabStore()
const purchaseData = ref<{ [key: string]: any }>({});
// updatedFields: 更新字段列表
const updatedFields = ref({})

const fields = ref([
  { label: '序号', key: 'id', type: 'number' },
  { label: '订单编号', key: 'orderCode', type: 'string' },
  { label: '产品ID', key: 'productId', type: 'number' },
  { label: '材料类型', key: 'materialType', type: 'string' },
  { label: '采购模具编号', key: 'mouldNumber' },
  { label: '图片链接', key: 'pictureUrl', type: 'string' },
  { label: '采购编码', key: 'purchaseCode' },
  { label: '采购数量', key: 'purchaseQuantity', type: 'integer' },
  { label: '采购重量', key: 'purchaseWeight', type: 'number' },
  { label: '单重', key: 'singleWeight', type: 'number' },
  { label: '规格', key: 'specification', type: 'string' },
  { label: '供应商', key: 'supplier' },
])


onMounted(() => {
  // 初始化获取采购表数据
  getPurchaseData();
  updatedFields.value = {
    orderCode: props.data.orderCode, // 保持订单编号不变
  };
});

// getPurchaseData: 获取采购表数据
const getPurchaseData = async () => {
  const res = await detailPurchasePlan(props.data.orderCode);
  console.log('获取采购表数据:', res);
  if (res.code == 200) {
    purchaseData.value = res.rows[0] || {};
    console.log('获取采购表数据成功:', purchaseData.value);
    // 更新 updatedFields 的值
    updatedFields.value = {
      ...purchaseData.value,
      orderCode: props.data.orderCode, // 保持订单编号不变
      // id: purchaseData.value.id , // 保持id不变
    };
    return purchaseData.value;
  } else {
    purchaseData.value = { id: 0, material: '未知', mouldNumber: '未知', picture: '11', pictureUrl: '11', purchaseCode: '未知', singleWeight: 0, specificationName: '未知', supplier: '未知', unitPrice: 0 };
    console.log('获取采购表数据失败:', purchaseData.value);
  }
}

console.log('purchaseData:', purchaseData.value);



// footer 按钮点击事件
const onCancel = () => {
  console.log('取消按钮点击');
  messageBox('success', null, '取消操作');
};

const onAdd = () => {
  newDialogVisible.value = true;
}
const onAddSubmit = async () => {
  const res = await newPurchasePlan(updatedFields.value);
  console.log('新增采购表请求结果:', res);
  if (res.code == 200) {
    console.log('新增采购表成功:', res.data);
    tabStore.addTab(`采购表${props.data.orderId}`)
    messageBox('success', null, '新增采购表成功');
  } else {
    messageBox('error', null, null, '新增采购表失败');
  }
};

const onUpdateSubmit = async () => {
  console.log('修改按钮点击');
  const res = await changePurchasePlan(updatedFields.value);
  console.log('修改采购表请求结果:00', res);
  if (res.code == 200) {
    console.log('修改采购表成功:', res.data);
    messageBox('success', null, '修改采购表成功');
  } else {
    messageBox('error', null, null, '修改采购表失败');
  }
};
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
