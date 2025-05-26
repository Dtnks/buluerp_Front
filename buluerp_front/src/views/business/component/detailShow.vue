<template>
  <div style="flex: 1; background-color: rgba(240, 242, 245, 1); padding: 20px 40px 0 40px">
    <!-- 业务订单基本信息 -->
    <informationCard title="业务订单基本信息">
      <el-row :gutter="16" class="information-row">
        <!-- 订单ID -->
        <el-col :span="6">
          <div class="field">
            <label>订单ID</label>
            <div>{{ detail.innerId }}</div>
          </div>
        </el-col>
        <!-- 创建日期 -->
        <el-col :span="6">
          <div class="field">
            <label>创建日期</label>
            <div>{{ detail.createTime || '暂无数据' }}</div>
          </div>
        </el-col>
        <!-- 订单状态 -->
        <el-col :span="6">
          <div class="field">
            <label>订单状态</label>
            <div>{{ status }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16" style="margin: 46px 0 16px 0" class="information-row">
        <!-- 客户姓名 -->
        <el-col :span="6">
          <div class="field">
            <label>客户姓名</label>
            <!-- <el-input placeholder="请输入" /> -->
            <div>{{ detail.customerName }}</div>
          </div>
        </el-col>
        <!-- 支付日期 -->
        <el-col :span="6">
          <div class="field">
            <label>支付日期</label>
            <el-date-picker v-model="payDate" style="width: 200px;" />
          </div>
        </el-col>
        <!-- 其他基本信息 -->
        <el-col :span="6">
          <div class="field">
            <label>其他基本信息</label>
            <el-input placeholder="请输入" />
          </div>
        </el-col>
      </el-row>
    </informationCard>

    <!-- 订单详情 -->
    <informationCard title="订单详情">
      <el-table :data="orderDetails" style="width: 100%">
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="totalPrice" label="总价" />
      </el-table>
    </informationCard>

    <!-- 关联订单 -->
    <informationCard title="关联订单">
      <el-table :data="relatedOrdersTable" style="width: 100%">
        <el-table-column prop="type" label="订单类型" width="100" />
        <el-table-column prop="orderId" label="订单ID" />
        <el-table-column prop="action" label="操作" width="180">
          <template #default="scope">
            <el-button v-for="action in scope.row.actions" :key="action.name" link type="primary" size="small"
              @click="handleAction(action.method, scope.row)">
              {{ action.name }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </informationCard>
  </div>
</template>

<script setup lang="ts">
import informationCard from './informationCard.vue'
import { onMounted, ref } from 'vue'
import { getStatusText } from '../utils/statusMap'
import { getPackingListByOrderId, getProductsByOrderId} from '../function/oders'
import { getList_pro } from '@/apis/products.js'

// Props
// defineProps(['innerId', 'customerName', 'status', 'createdTime']);
const props = defineProps<{
  detail: any
  id: number
}>()

onMounted(() => {
  // getPackingList();
  
  getOrderProducts(props.id)

})

// 订单状态
const status = ref(getStatusText(props.detail.status))

// 支付日期
const payDate = ref([])

// 订单详情数据
const orderDetails = ref([])

// getOrderProducts: 获取订单产品详情
const getOrderProducts = async (id: number) => {
  const res = await getProductsByOrderId(id)
}

// 订单ID(id直接传过来, 不用这个了)
const orderId = ref(props.detail.id)


// 关联订单数据和操作
// 分包表
const packingList = ref([]);

// getPackingList: 根据订单ID获取分包表数据
const getPackingList = (id: number) => {
  getPackingListByOrderId(id)
}

// viewPackingList: 查看分包表
const viewPackingList = (row: any) => {
  console.log('查看分包表', row);
}


// 采购表
const purchaseTable = ref([

]);

// viewPuchaseOrder: 查看采购表
const viewPuchaseOrder = (row: any) => {
  console.log('查看采购表', row);
}

// editPuchaseOrder: 编辑采购表
const editPuchaseOrder = (row: any) => {
  console.log('编辑采购表', row);
}

// handleAction: 处理关联订单的操作
const handleAction = (method: Function, row: any) => {
  method(row);
}

// 关联订单
const relatedOrdersTable = ref([
  {
    type: '分包表',
    orderId: '67890',
    actions: [
      { name: '查看', method: viewPackingList },
    ]
  },
  {
    type: '采购表',
    orderId: '无',
    actions: [
      { name: '查看', method: viewPuchaseOrder },
      { name: '编辑', method: editPuchaseOrder },
    ]
  },
  {
    type: '其他表',
    orderId: '无',
    actions: [
      { name: '查看' },
      { name: '编辑' },
    ]
  },
])



</script>

<style scoped lang="less">
.information-row {
  padding-left: 4px;

  * {
    margin-right: 11px;
  }
}

.field {
  margin-bottom: 16px;
}
</style>
