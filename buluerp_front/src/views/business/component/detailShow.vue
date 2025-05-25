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
            <el-input placeholder="请输入" />
          </div>
        </el-col>
        <!-- 支付日期 -->
        <el-col :span="6">
          <div class="field">
            <label>支付日期</label>
            <el-date-picker
              v-model="payDate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
            />
          </div>
        </el-col>
        <!-- 其他基本信息 -->
        <el-col :span="6">
          <div class="field">
            <label>其他基本信息</label>
            <el-select placeholder="请选择" style="width: 100%">
              <el-option label="选项1" value="1" />
              <el-option label="选项2" value="2" />
            </el-select>
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
            <el-button link type="primary" size="small" v-if="scope.row.type != '分包表'"
              >创建</el-button
            >
            <el-button link type="primary" size="small">查看</el-button>
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
import { getPackingListByOrderId } from '../apis/oders'

// Props
// defineProps(['innerId', 'customerName', 'status', 'createdTime']);
const props = defineProps<{
  detail: any
}>()

onMounted(() => {
  // 组件挂载后执行的逻辑
  console.log('DetailShow.vue-mount')
  console.log('DetailShow.vue-props.detail.createdTime', props.detail.createdTime)
  // getPackingList();
})

// 订单状态
const status = ref(getStatusText(props.detail.status))

// 支付日期
const payDate = ref([])

// 订单详情数据
const orderDetails = ref([
  { productName: '产品1', quantity: 10, unitPrice: 100, totalPrice: 1000 },
  { productName: '产品2', quantity: 5, unitPrice: 200, totalPrice: 1000 },
])

// 订单ID
const orderId = ref(props.detail.id)

// 关联订单
const relatedOrdersTable = ref([
  {
    type: '分包表',
    orderId: '67890',
  },
  {
    type: '采购表',
    orderId: '无',
  },
  {
    type: '其他表',
    orderId: '无',
  },
])

// // 关联订单数据
// // 分包表
// const packingList = ref([
//   { date: '2023-10-01', name: '订单1', address: '地址1' },
//   { date: '2023-10-02', name: '订单2', address: '地址2' },
// ]);

// //
// const getPackingList = async () => {
//   try {
//     const res = await getPackingListByOrderId(orderId.value);
//     // packingList.value = res;
//     console.log('获取分包表数据(detailShow.vue):', res);
//   } catch (error) {
//     console.error('获取分包表数据失败:', error);
//   }
// };

// // 采购表
// const purchaseTable = ref([
//   { date: '2023-10-01', name: '订单1', address: '地址1' },
//   { date: '2023-10-02', name: '订单2', address: '地址2' },
// ]);
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
