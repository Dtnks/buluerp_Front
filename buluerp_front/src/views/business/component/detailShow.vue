<template>
  <div class="detail-box">
    <div style="
        flex: 1;
        background-color: rgba(240, 242, 245, 1);
        padding: 20px 40px 0 40px;
        overflow-y: auto;
      ">
      <div class="main">
        <!-- 业务订单基本信息 -->
        <informationCard title="业务订单基本信息">
          <el-row :gutter="16" class="information-row">
            <el-col v-for="field in fields" :key="field.label" :span="6">
              <div class="field">
                <label class="field-label">{{ field.label }}</label>
                <div v-if="field.value" class="field-value">
                  {{ field.value }}
                </div>
                <div v-else class="field-value">
                  <el-input v-if="field.label == '客户姓名'" v-model="updateFields.customerName" placeholder="请输入" />
                  <el-input v-else-if="field.label == '备注'" v-model="updateFields.remark" placeholder="请输入" />
                  <el-date-picker v-else v-model="updateFields.deliveryTime" style="width: 200px" placeholder="请选择" />
                </div>
              </div>
            </el-col>
          </el-row>
        </informationCard>
        <!-- 订单详情 -->
        <informationCard title="订单详情">
          <el-table :data="orderProduct" style="width: 100%">
            <el-table-column label="产品编码" prop="id" />
            <el-table-column label="产品名称" prop="name" />
            <el-table-column label="创建时间" prop="createTime" />
            <el-table-column label="更新时间" prop="updateTime" />
            <el-table-column label="产品状态" prop="designStatus" />

          </el-table>
        </informationCard>
        <!-- 关联订单 -->
        <informationCard title="关联订单">
          <div class="related-orders-grid">
            <!-- 第一行：订单类型 -->
            <div class="related-orders-row">
              <div v-for="item in relatedOrdersTable" :key="item.type" class="related-orders-cell type-cell">
                {{ item.type }}
              </div>
            </div>
            <!-- 第二行：操作按钮 -->
            <div class="related-orders-row">
              <div v-for="(item, idx) in relatedOrdersTable" :key="item.type + '-action'"
                class="related-orders-cell action-cell">
                <el-button v-for="action in item.actions" :key="action.name" link type="primary" size="small"
                  @click="handleAction(action.method, item)">
                  {{ action.name }}
                </el-button>
              </div>
            </div>
          </div>
        </informationCard>
      </div>
    </div>
    <el-footer class="footer">
      <el-button @click="onBoxCancel">取消</el-button>
      <el-button type="primary" @click="onBoxSubmit">提交</el-button>
    </el-footer>

    <el-dialog v-model="DialogVisible" title="新增分包" width="800px">
      <CreateForm :data="newFormData" :Formvalue="newSubmit" ref="createFormRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
          <el-button type="info" @click="
            () => {
              DialogVisible = false
            }
          ">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import informationCard from './informationCard.vue'
import { computed, onMounted, ref } from 'vue'
import { getStatusText } from '../utils/statusMap'
import { getOrderDetail } from '../function/oders'
import { getOrdersList, putOrder } from '@/apis/orders'
import { parseTime } from '@/utils/ruoyi'
import { ElButton, ElInput, ElDatePicker, ElRow, ElCol, ElTable, ElTableColumn, ElFooter, ElDialog, dayjs, } from 'element-plus'
import ProductionSchedule from './productionSchedule.vue'
import { messageBox } from '@/components/message/messageBox'
import PurchaseInfo from './purchasePlan.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import useTabStore from '@/stores/modules/tabs'
import { getPackagingListByOrderId, newPackaging } from '@/apis/produceControl/produce/packaging'
import PackagingDetail from '@/views/PMcenter/produce/component/PackagingDetail.vue'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
// Props
const props = defineProps<{
  detail: any
  id: number
  orderCode: string
  addTab: (targetName: string, component: any, data?: any, control?: any) => void
  control: Array<object>
}>()
const tabStore = useTabStore()
const orderDetail = computed(() => props.detail)

onMounted(() => {
  console.log('订单详情组件加载', props.id)
  fetchOrderProduct(props.id)
})

// 订单状态
const statusText = ref(getStatusText(props.detail.status))

// 业务订单基本信息的字段信息
const fields = ref([
  { label: '订单ID', value: props.detail.id },
  { label: '创建时间', value: props.detail.createTime },
  { label: '订单状态', value: statusText.value },
  { label: '内部编号', value: props.detail.innerId },
  { label: '外部编号', value: props.detail.outerId },
  { label: '客户姓名', value: props.detail.customerName },
  { label: '交付日期', value: props.detail.deliveryTime },
  { label: '备注', value: props.detail.remark },
])

// 修改订单基本信息
const updateFields = ref({
  ...orderDetail.value,
  id: props.detail.id,
  deliveryTime: props.detail.deliveryTime || '',
  remark: props.detail.remark || '',
  customerName: props.detail.customerName || '',
})

// 订单详情-产品数据
const orderProduct = ref([])

// 获取订单产品数据
const fetchOrderProduct = async (orderId: number) => {
  try {
    const res = await getOrderDetail(orderId)
    console.log('订单产品数据:22222222', res.product)

    if (res.product) {
      orderProduct.value = Array.isArray(res.product) ? res.product : [res.product]
      console.log('orderProduct.value', orderProduct.value)
    }
  } catch (error) {
    console.error('获取订单产品数据失败:', error)
    messageBox('error', null, null, '获取订单产品数据失败, 请稍后再试')
  }
}

// // 关联订单数据和操作
// viewPuchaseOrder: 查看采购表
const viewPuchaseOrder = (row: any) => {
  console.log('查看采购表', row)
  props.addTab(
    `订单${props.orderCode} 外购`,
    PurchaseInfo,
    { orderCode: props.orderCode, purchaseId: orderDetail.value.purchaseId, orderId: props.id },
    props.control,
  )
}

// viewProductsSchedule: 查看布产表
const viewProductsSchedule = (row: any) => {
  console.log('查看布产表', row)
  props.addTab(
    `订单${props.orderCode} 布产`,
    ProductionSchedule,
    { orderCode: props.orderCode },
    props.control,
  )
}


// handleAction: 处理关联订单的操作
const handleAction = (method: Function, row: any) => {
  method(row)
}

const viewPackagingList = (row) => {
  getPackagingListByOrderId(props.orderCode).then((res) => {
    props.addTab(`订单${props.orderCode} 分包`, PackagingDetail, res.rows[0].id, props.control)
  })
}
const DialogVisible = ref(false)
const newFormData = ref([
  [
    {
      type: 'inputSelect',
      label: '产品ID',
      key: 'productId',
      width: 24,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/products/list', 'id'),
    },
  ],
  [
    { type: 'input', label: '生产线', key: 'productionLine', width: 12, rules: [requiredRule] },

    {
      type: 'timer',
      label: '发布日期',
      key: 'releaseDate',
      timerType: 'date',
      width: 12,
      rules: [requiredRule],
    },
  ],
  [
    { type: 'input', label: '本袋规格', key: 'bagSpecification', width: 8, rules: [requiredRule] },
    { type: 'input', label: '本袋重量', key: 'bagWeight', width: 8, rules: [positiveNumberRule] },
    {
      type: 'input',
      label: '本袋数量',
      key: 'packageQuantity',
      width: 8,
      rules: [positiveNumberRule],
    },
  ],
  [
    {
      type: 'select',
      label: '说明书',
      key: 'isManual',
      width: 8,
      options: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      rules: [requiredRule],
    },
    {
      type: 'select',
      label: '人偶',
      key: 'isMinifigure',
      width: 8,
      options: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      rules: [requiredRule],
    },
    {
      type: 'select',
      label: '起件器',
      key: 'isTool',
      width: 8,
      options: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'number',
      label: '本袋配件',
      key: 'packageAccessories',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'number',
      label: '配件种类',
      key: 'accessoryType',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'number',
      label: '配件数量',
      key: 'accessoryTotal',
      width: 8,
      rules: [positiveNumberRule],
    },
  ],
  [{ type: 'textarea', label: '备注', key: 'remark', width: 24 }],
])

const newSubmit = ref({
  productId: '',
  materialType: '',
  productNameCn: '',
  releaseDate: '',
  bagSpecification: '',
  bagWeight: '',
  packageQuantity: '',
  isManual: '',
  isMinifigure: '',
  isTool: '',
  packageAccessories: '',
  accessoryType: '',
  accessoryTotal: '',
  remark: '',
})
const createFormRef = ref()
const handleSubmit = () => {
  createFormRef.value.validateForm((valid) => {
    if (valid) {
      newSubmit.value.releaseDate = parseTime(newSubmit.value.releaseDate, '{y}-{m}-{d}')

      newPackaging({ ...newSubmit.value, orderCode: props.orderCode }).then((res) => {
        console.log(res)
        if (res.msg == '操作成功') {
          relatedOrdersTable.value[2].actions = [{ name: '查看', method: viewPackagingList }]
          ElMessage.success(res.msg)
          DialogVisible.value = false
        } else {
          ElMessage.error('操作失败')
          return
        }
      })
    }
  })
}
const addPackagingList = () => {
  DialogVisible.value = true
}

// 关联订单
const relatedOrdersTable = ref([
  {
    type: '采购表',
    actions: [{ name: '查看', method: viewPuchaseOrder }],
  },
  {
    type: '布产表',
    actions: [{ name: '查看', method: viewProductsSchedule }],
  },
  {
    type: '分包表',
    actions: [{ name: '查看', method: viewPackagingList }],
  },
])
getPackagingListByOrderId(props.orderCode).then((res) => {
  if (res.rows.length == 0) {
    relatedOrdersTable.value[2].actions = [{ name: '创建', method: addPackagingList }]
  } else {
    relatedOrdersTable.value[2].actions = [{ name: '查看', method: viewPackagingList }]
  }
})
// //  页脚按钮
// onBoxSubmit: 提交按钮
const onBoxSubmit = async () => {
  console.log('提交1111', updateFields.value)
  const submitData = { ...updateFields.value }
  if (submitData.deliveryTime instanceof Date) {
    submitData.deliveryTime = dayjs(submitData.deliveryTime).format('YYYY-MM-DD')
  }
  const res = await putOrder(submitData)
  console.log('提交订单数据:555', res)
  if (res.code == 200) {
    messageBox('success', null, '订单已成功提交')
    tabStore.freshTab('订单查询')
  } else {
    console.error('提交订单失败')
    console.log('提交订单失败:', res)

    messageBox('error', null, null, res.msg)
  }

  getOrdersList()
}

// onBoxCancel: 取消按钮
const onBoxCancel = () => {
  console.log('取消')
  messageBox('success', null, '已取消提交')
}
</script>

<style scoped lang="less">
.detail-box {
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

.information-row {
  padding-left: 4px;

  * {
    margin-right: 11px;
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

.add-row {
  margin-top: 4px;
  font-size: small;
  color: #424548;
}

.input-blank {
  width: 40px;
  border-bottom: 1px solid #000;
  outline: none;
  margin-left: 5px;
  margin-right: 5px;
  padding: 0;

  :deep(.el-input__wrapper) {
    box-shadow: none !important;
  }
}

.related-orders-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
}

.related-orders-row {
  display: flex;
  width: 100%;
}

.related-orders-cell {
  flex: 1;
  text-align: center;
  padding: 8px 0;
}

.type-cell {
  font-weight: bold;
  background: #fcfcfc;
  border-bottom: 1px solid #ebeef5;
}

.action-cell {
  background: #fff;
}
</style>
