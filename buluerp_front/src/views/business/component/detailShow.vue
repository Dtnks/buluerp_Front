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
                  <el-input v-if="field.label == '客户姓名：'" v-model="updateFields.customerName" placeholder="请输入" />
                  <el-input v-else-if="field.label == '备注：'" v-model="updateFields.remark" placeholder="请输入" />
                  <el-date-picker v-else-if="field.label == '交付日期：'" v-model="updateFields.deliveryTime"
                    style="width: 200px" placeholder="请选择" />
                  <el-date-picker v-else-if="field.label == '交付截止日期：'" v-model="updateFields.deliveryDeadline"
                    style="width: 200px" placeholder="请选择" />
                </div>
              </div>
            </el-col>
          </el-row>
        </informationCard>
        <!-- 订单详情 -->
        <informationCard title="订单详情">
          <el-table :data="orderProduct" style="width: 100%; font-size: medium;">
            <el-table-column label="产品编码" prop="id" />
            <el-table-column label="内部编码" prop="innerId" />
            <el-table-column label="外部编码" prop="outerId" />
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
              <div v-for="item in relatedOrdersTable" :key="item.type" class="related-orders-cell type-cell ">
                {{ item.type }}
              </div>
            </div>
            <!-- 第二行：操作按钮 -->
            <div class="related-orders-row">
              <div v-for="(item, idx) in relatedOrdersTable" :key="item.type + '-action'"
                class="related-orders-cell action-cell">
                <el-button v-for="action in item.actions" :key="action.name" link type="primary"
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
import { resMap } from '../utils/statusMap'
import { getProductsByOrderId } from '../function/oders'
import { getOrdersList, putOrder } from '@/apis/orders'
import { parseTime } from '@/utils/ruoyi'
import { ElButton, ElInput, ElDatePicker, ElRow, ElCol, ElTable, ElTableColumn, ElFooter, ElDialog, dayjs } from 'element-plus'
import ProductionSchedule from './productionSchedule.vue'
import { messageBox } from '@/components/message/messageBox'
import PurchaseInfo from './purchasePlan.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import useTabStore from '@/stores/modules/tabs'
import { getPackagingListByOrderId, newPackaging } from '@/apis/produceControl/produce/packaging'
import PackagingDetail from '@/views/PMcenter/produce/component/PackagingDetail.vue'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
import { getPurchaseInfo } from '@/apis/produceControl/purchase/purchaseInfo'
import { getPurchaseListByOrderCode } from '@/apis/produceControl/purchase/purchaseList'
import { getScheduleListByOrderId } from '@/apis/produceControl/produce/schedule'
import { detailPurchasePlan, listPurchasePlanByOrderCode } from '@/apis/produceControl/purchase/purchasePlan'
// Props
const props = defineProps<{
  detail: any
  id: number
  orderCode: string
  addTab: (targetName: string, component: any, data?: any,targetPath?:string) => void

}>()
const tabStore = useTabStore()
const orderDetail = computed(() => props.detail)
const fields = ref()
const statusText = ref()
const updateFields = ref()
onMounted(() => {
  // 订单状态
  statusText.value = resMap[props.detail.status]

  // 业务订单基本信息的字段信息
  fields.value = [
  { label: '订单ID：', value: props.detail.id },
  { label: '创建时间：', value: props.detail.createTime },
  { label: '订单状态：', value: statusText.value },
  { label: '内部编号：', value: props.detail.innerId },
  { label: '外部编号：', value: props.detail.outerId },
  { label: '客户姓名：', value: props.detail.customerName },
  { label: '交付日期：', value: props.detail.deliveryTime },
  { label: '交付截止日期：', value: props.detail.deliveryDeadline },
  { label: '备注：', value: props.detail.remark },
]

  // 修改订单基本信息
  updateFields.value = {
    ...orderDetail.value,
    id: props.detail.id,
    deliveryTime: props.detail.deliveryTime || '',
    deliveryDeadline: props.detail.deliveryDeadline || '',
    remark: props.detail.remark || '',
    customerName: props.detail.customerName || '',
  }
  fetchOrderProduct()

})


// 订单详情-产品数据
interface ProductInfo {
  id: string
  innerId: string
  outerId: string
  name: string
  createTime: string
  updateTime: string
  designStatus: string
}

const orderProduct = ref<ProductInfo[]>([])


const promap = { '0': '未生产', '1': '已生产' }
// 获取订单产品数据
const fetchOrderProduct = async () => {
  const productId = props.detail.productId
  if (!productId) {
    // 如果未绑定产品，不发送请求
    orderProduct.value = [{
      id: '未绑定产品',
      innerId: '-',
      outerId: '-',
      name: '-',
      createTime: '-',
      updateTime: '-',
      designStatus: '-'
    }]
    return
  }

  const res = await getProductsByOrderId(productId)
  orderProduct.value = res.rows

  // 如果有数据，处理产品状态映射
  if (orderProduct.value.length > 0) {
    orderProduct.value[0].designStatus = promap[orderProduct.value[0].designStatus]
  }
}


// // 关联订单数据和操作
// viewPuchaseOrder: 查看采购表
const viewPuchaseOrder = (row: any) => {
  props.addTab(
    `订单${props.orderCode} 采购`,
    PurchaseInfo,
    { orderCode: props.orderCode, purchaseId: orderDetail.value.purchaseId, orderId: props.id },
    `/business/PurchaseInfo/${props.orderCode}`,

  )
}

// viewProductsSchedule: 查看布产表
const viewProductsSchedule = (row: any) => {
  props.addTab(
    `订单${props.orderCode} 布产`,
    ProductionSchedule,
    { orderCode: props.orderCode },
    `/business/ProductionSchedule/${props.orderCode}`,

  )
}

// handleAction: 处理关联订单的操作
const handleAction = (method: Function, row: any) => {
  method(row)
}

const viewPackagingList = (row) => {
  getPackagingListByOrderId(props.orderCode).then((res) => {
    props.addTab(`订单${props.orderCode} 分包`, PackagingDetail, res.rows[0].id,
    `/business/PackagingDetail/${props.orderCode}`)
  })
}
const DialogVisible = ref(false)
const newFormData = ref([
  [
    {
      type: 'input',  // 改为只读显示类型
      label: '订单',
      key: 'orderCode',
      width: 12,
      value: props.detail.innerId,  // 直接显示传入的订单编号
      displayFormat: (value) => `${props.detail.innerId} (${props.detail.outerId})`,
      readonly: true,
      disabled: true,  // 设置为禁用状态
    },
    {
      type: 'input',  // 改为只读显示类型
      label: '产品',
      key: 'productId',
      width: 12,
      value: props.detail.productId,  // 直接显示传入的产品ID
      displayFormat: (value) => `${props.detail.productId} (${props.detail.productName})`,
      readonly: true,
      disabled: true,  // 设置为禁用状态
    },
    // {
    //   type: 'inputSelect',
    //   label: '产品',
    //   key: 'productId',
    //   width: 12,
    //   showKey: [{ key: 'id', label: "产品ID" }, { key: 'name', label: "产品名称" }],
    //   rules: [requiredRule],
    //   options: [],
    //   loading: false,
    //   remoteFunc: searchFunc('system/products/list', 'id'),
    // },
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
    {
      type: 'number',
      label: '配件种类',
      key: 'accessoryType',
      width: 12,
      rules: [positiveNumberRule, requiredRule],
    },
    {
      type: 'number',
      label: '配件数量',
      key: 'accessoryTotal',
      width: 12,
      rules: [positiveNumberRule, requiredRule],
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

  [{ type: 'textarea', label: '备注', key: 'remark', width: 24 }],
])

const newSubmit = ref({
  orderCode: '',
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
      newPackaging({ ...newSubmit.value, orderCode: props.orderCode, productId: orderProduct.value[0].id }).then((res) => {
        relatedOrdersTable.value[2].actions = [{ name: '查看', method: viewPackagingList }]
        messageBox('success', null, '分包创建成功')
        DialogVisible.value = false
        tabStore.freshTab('审核')
      })
    }
  })
}
const addPackagingList = () => {
  newSubmit.value = {
    ...newSubmit.value,  // 保留其他字段的值
    orderCode: props.detail.innerId,  // 设置订单编号
  }
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

detailPurchasePlan(props.orderCode).then((res) => {
  if (res.rows.length == 0) {
    relatedOrdersTable.value[0].actions = [{ name: '创建', method: viewPuchaseOrder }]
  } else {
    relatedOrdersTable.value[0].actions = [{ name: '查看', method: viewPuchaseOrder }]
  }
})

getScheduleListByOrderId(props.orderCode).then((res) => {
  if (res.rows.length == 0) {
    relatedOrdersTable.value[1].actions = [{ name: '创建', method: viewProductsSchedule }]
  } else {
    relatedOrdersTable.value[1].actions = [{ name: '查看', method: viewProductsSchedule }]
  }
})

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
  const submitData = { ...updateFields.value }
  if (submitData.deliveryTime instanceof Date) {
    submitData.deliveryTime = dayjs(submitData.deliveryTime).format('YYYY-MM-DD')
  }
  const res = await putOrder(submitData)
  messageBox('success', null, '订单已成功提交')


  getOrdersList()
}

// onBoxCancel: 取消按钮
const onBoxCancel = () => {
  messageBox('success', null, '已取消提交')
}
</script>

<style scoped lang="less">
.field-content-middle {
  font-size: medium;
}

.field-content-small {
  font-size: small;
  color: #707070;
}

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
    font-size: medium;
    color: #707070;
  }
}

.add-row {
  margin-top: 4px;
  font-size: medium;
  color: #424548;
}

.input-blank {
  width: 40px;
  border-bottom: 1px solid #000;
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
  width: 1100px;
  margin: 0 10px 10px 0;

}

.related-orders-row {
  display: flex;
  // width: 100%;
}

.related-orders-cell {
  flex: 1;
  text-align: left;
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
