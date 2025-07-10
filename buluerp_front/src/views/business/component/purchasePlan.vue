<template>
  <div class="col">
    <BordShow content="采购表" path="生产管理/采购/采购表" />
    <div class="greyBack">
      <informationCard
        v-if="!isLoading"
        :title="`订单-${props.data.orderCode}`"
        :control="props.control"
      >
        <el-row v-if="purchaseData && purchaseData.id != null" :gutter="16" class="information-row">
          <el-col
            v-for="field in fields"
            :key="field.label"
            :span="10"
            v-show="purchaseData[field.value] != null"
          >
            <div class="field">
              <label class="field-label">{{ field.label }}</label>
              <div class="field-value">
                <span v-if="field.value == 'orderCode'">{{ props.data.orderCode }}</span>
                <el-image
                  v-else-if="field.value == 'pictureUrl' && purchaseData[field.value]"
                  :src="getFullImageUrl(purchaseData[field.value])"
                ></el-image>
                <span v-else>{{ purchaseData[field.value] }}</span>
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
    <el-footer class="footer" v-if="purchaseData && purchaseData.id != null">
      <el-button @click="onCancel">解绑</el-button>
      <el-button type="primary" @click="onUpdate">点击修改</el-button>
    </el-footer>
  </div>
  <el-dialog v-model="newDialogVisible" title="新增采购表">
    <CreateForm :data="newFormData" :Formvalue="updatedFields"></CreateForm>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="purchaseData.id == null" type="primary" @click="onAddSubmit">
          确认新增
        </el-button>
        <el-button v-else type="primary" @click="onUpdateSubmit"> 确认修改 </el-button>
        <el-button
          type="info"
          @click="
            () => {
              newDialogVisible = false
            }
          "
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
import { ElRow, ElCol, ElFooter, ElButton, ElDialog, ElImage } from 'element-plus'
import informationCard from './informationCard.vue'
import {
  changePurchasePlan,
  deletePurchasePlan,
  detailPurchasePlan,
  newPurchasePlan,
} from '@/apis/produceControl/purchase/purchasePlan'
import { messageBox } from '@/components/message/messageBox'
import useTabStore from '@/stores/modules/tabs'
import { getFullImageUrl } from '@/utils/image/getUrl'

const isLoading = ref(true)
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
  data: { orderCode: string; purchaseId: number; orderId: number }
}>()
const newDialogVisible = ref(false)
const tabStore = useTabStore()
const purchaseData = ref<{ [key: string]: any }>({})
// updatedFields: 更新字段列表
const updatedFields = ref({})

const newFormData = ref([
  [
    {
      type: 'input',
      label: '采购重量',
      key: 'purchaseWeight',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'number',
      label: '采购数量',
      key: 'purchaseQuantity',
      width: 8,
      rules: [positiveNumberRule],
    },
    { type: 'input', label: '单重', key: 'singleWeight', width: 8, rules: [positiveNumberRule] },
  ],
  [
    { type: 'input', label: '颜色编号', key: 'colorCode', width: 12, rules: [requiredRule] },
    { type: 'input', label: '料别', key: 'materialType', width: 12, rules: [requiredRule] },
  ],
  [
    {
      type: 'timer',
      label: '预交时间',
      key: 'deliveryDate',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },
    {
      type: 'timer',
      label: '交货时间',
      key: 'deliveryTime',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'timer',
      label: '下单时间',
      key: 'orderTime',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },
    { type: 'input', label: '供应商', key: 'supplier', width: 12, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '模具编号', key: 'mouldNumber', width: 12, rules: [requiredRule] },
    { type: 'input', label: '规格', key: 'specification', width: 12, rules: [requiredRule] },
  ],
  [
    {
      type: 'inputSelect',
      label: '订单Id',
      key: 'orderCode',
      width: 12,
      rules: [requiredRule],
      remoteFunc: searchFunc('system/orders/list', 'innerId'),
      options: [],
      loading: false,
    },
    {
      type: 'inputSelect',
      label: '产品ID',
      key: 'productId',
      width: 12,
      rules: [requiredRule],
      remoteFunc: searchFunc('system/products/list', 'id'),
      options: [],
      loading: false,
    },
  ],
  [
    { type: 'textarea', label: '客户备注', key: 'remarks', width: 24, rules: [] }, // 备注字段不做必填校验
  ],
  [{ type: 'image', label: '样例图', key: 'picture', width: 12 }],
])

const fields = ref([
  { label: '订单编号', value: 'orderCode' },
  { label: '采购表ID', value: 'id' },
  { label: '产品ID', value: 'productId' },
  { label: '采购重量', value: 'purchaseWeight' },
  { label: '采购数量', value: 'purchaseQuantity' },
  { label: '单重', value: 'singleWeight' },
  { label: '颜色编号', value: 'colorCode' },
  { label: '料别', value: 'materialType' },
  { label: '预交时间', value: 'deliveryDate' },
  { label: '交货时间', value: 'deliveryTime' },
  { label: '下单时间', value: 'orderTime' },
  { label: '供应商', value: 'supplier' },
  { label: '模具编号', value: 'mouldNumber' },
  { label: '规格', value: 'specificationName' },
  { label: '客户备注', value: 'remarks' },
  { label: '样例图', value: 'pictureUrl' },
])

onMounted(async () => {
  await getPurchaseData() // 初始化获取采购表数据
  isLoading.value = false // 数据加载完成
})

// getPurchaseData: 获取采购表数据
const getPurchaseData = async () => {
  const res = await detailPurchasePlan(props.data.orderCode)
  if (res.code == 200) {
    purchaseData.value = res.rows[0] || {}
    updatedFields.value = {
      ...purchaseData.value,
      orderCode: props.data.orderCode,
      id: purchaseData.value.id,
    }
    console.log('获取采购表数据:', purchaseData.value)

    return purchaseData.value
  } else {
    updatedFields.value = purchaseData.value
  }
}

// footer 按钮点击事件
const onCancel = () => {
  messageBox(
    'warning',
    async () => {
      const res = await deletePurchasePlan([purchaseData.value.id])

      messageBox('success', null, '解绑成功')
      purchaseData.value = { id: null } // 清空采购数据
    },
    '解绑成功',
    '解绑失败',
    '确定要解绑当前 订单吗？',
  )
}

const onAdd = () => {
  newDialogVisible.value = true
}
const onAddSubmit = async () => {
  const res = await newPurchasePlan(updatedFields.value)

  messageBox('success', null, '新增采购表成功')
  getPurchaseData() // 刷新采购表数据
  tabStore.freshTab('审核')

  newDialogVisible.value = false
}

const onUpdate = () => {
  newDialogVisible.value = true
}

const onUpdateSubmit = async () => {
  const res = await changePurchasePlan(updatedFields.value)

  purchaseData.value = { ...purchaseData.value, ...updatedFields.value } // 更新本地数据
  messageBox('success', null, '修改采购表成功')
  tabStore.freshTab('审核')

  newDialogVisible.value = false
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
    height: 350px;

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
