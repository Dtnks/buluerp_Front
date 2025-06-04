<template>
  <div class="detail-box">
    <div style="flex: 1; background-color: rgba(240, 242, 245, 1); padding: 20px 40px 0 40px; overflow-y: auto;">
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
                  <el-input v-else-if="field.label == '其他基本信息'" v-model="updateFields.remark" placeholder="请输入" />
                  <el-date-picker v-else v-model="updateFields.deliveryDate" style="width: 200px;" placeholder="请选择" />
                </div>
              </div>
            </el-col>
          </el-row>
        </informationCard>

        <!-- 订单详情 -->
        <informationCard title="订单详情">
          <el-table :data="orderProducts" style="width: 100%">
            <el-table-column prop="productId" label="产品编号" />
            <el-table-column prop="product.name" label="产品名称" />
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="remark" label="其他信息" />
            <el-table-column prop="action" label="操作" width="180">
              <template #default="scope">
                <el-button @click="onEditProduct(scope.row)" link type="primary" size="small">编辑</el-button>
                <el-button link type="primary" size="small" @click="onDeleteProduct(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
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
    </div>
    <el-footer class="footer">
      <el-button @click=onBoxCancel>取消</el-button>
      <el-button type="primary" @click="onBoxSubmit">提交</el-button>
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import informationCard from './informationCard.vue'
<<<<<<< HEAD
import { onMounted, ref } from 'vue'
import {getOrderDetail} from '@/apis/orders.js'
=======
import { computed, onMounted, ref } from 'vue'
import { getStatusText } from '../utils/statusMap'
import { getPackagingListByOrderId, getProductsByOrderId, getProductDetailById, getOrderDetail } from '../function/oders'
import { getList_pro } from '@/apis/products.js'
import { ElMessage, ElButton, ElInput, ElDatePicker, ElRow, ElCol, ElTable, ElTableColumn, ElFooter, ElMessageBox } from 'element-plus'

// Props
const props = defineProps<{
  detail: any
  id: number
}>()

const orderDetail = computed(() => props.detail)

onMounted(() => {
  console.log('订单详情组件加载', props.id);
})

// 订单状态
const statusText = ref(getStatusText(props.detail.status))

// 业务订单基本信息的字段信息
const fields = ref([
  { label: '订单ID', value: props.detail.id },
  { label: '创建日期', value: props.detail.createTime },
  { label: '订单状态', value: statusText.value },
  { label: '客户姓名', value: props.detail.customerName },
  { label: '交付日期', value: props.detail.deliveryDate },
  { label: '其他基本信息', value: props.detail.remark },
])

// 修改订单基本信息
const updateFields = ref({
  ...fields.value,
  deliveryDate: '',
  remark: '',
  customerName: '',
})
// 订单详情-产品数据
const orderProducts = computed(() => props.detail.products || []);

// onDeleteProduct: 删除订单产品
const onDeleteProduct = (row: any) => {
  ElMessageBox.confirm('确定删除该产品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 删除逻辑
      console.log('删除产品:', row);
      ElMessage.success('产品已删除');
    })
    .catch(() => {
      ElMessage.info('已取消删除');
    });
}

// onEditProduct: 编辑订单产品
const onEditProduct = (row: any) => {
  console.log('编辑产品:', row);
  // 编辑逻辑
  ElMessage.success('产品已编辑');
}


// 关联订单数据和操作
// 分包表
const packagingList = ref([]);

// getPackagingList: 根据订单ID获取分包表数据
const getPackagingList = (id: number) => {
  getPackagingListByOrderId(id)
}



// 采购表
const purchaseTable = ref([]);

// viewPuchaseOrder: 查看外购表
const viewPuchaseOrder = (row: any) => {
  console.log('查看采购表', row);
}

// addProductsSchedule: 创建布产表
const addProductsSchedule = (row: any) => {
  console.log('创建布产表', row);
}

// viewProductsSchedule: 查看布产表
const viewProductsSchedule = (row: any) => {
  console.log('查看布产表', row);
}

// addPackagingList: 创建分包表
const addPackagingList = (row: any) => {
  console.log('创建分包表', row);
  // // 创建分包表逻辑
  // getPackagingList(props.id)
}

// viewPackagingList: 查看分包表
const viewPackagingList = (row: any) => {
  getPackagingList(props.id)
  console.log('查看分包表', row);
}
// handleAction: 处理关联订单的操作
const handleAction = (method: Function, row: any) => {
  method(row);
}

// 关联订单
const relatedOrdersTable = ref([
  { // todo: 后端还没写外购表
    type: '外购表',
    orderId: '',
    actions: [{ name: '查看', method: viewPuchaseOrder },]
  },
  {
    type: '布产表',
    orderId: '无',
    actions: [{ name: '创建', method: addProductsSchedule }, { name: '查看', method: viewProductsSchedule },]
  },
  {
    type: '分包表',
    orderId: '无',
    actions: [{ name: '创建',  method: addPackagingList }, { name: '查看',  method: viewPackagingList },]
  }
])

// //  页脚按钮
// onBoxSubmit: 提交按钮
const onBoxSubmit = () => {
  console.log('提交1111', updateFields.value);
  ElMessage.success('提交成功')
}

// onBoxCancel: 取消按钮
const onBoxCancel = () => {
  console.log('取消');
  ElMessage.info('已取消操作')
}

>>>>>>> origin/main
</script>

<style scoped lang="less">
.detail-box {
  display: flex;
  flex-direction: column;
  height: 100vh;

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
</style>
