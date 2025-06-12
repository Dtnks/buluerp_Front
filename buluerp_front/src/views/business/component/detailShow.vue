<template>
  <div class="detail-box">
    <div
      style="
        flex: 1;
        background-color: rgba(240, 242, 245, 1);
        padding: 20px 40px 0 40px;
        overflow-y: auto;
      "
    >
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
                  <el-input
                    v-if="field.label == '客户姓名'"
                    v-model="updateFields.customerName"
                    placeholder="请输入"
                  />
                  <el-input
                    v-else-if="field.label == '其他基本信息'"
                    v-model="updateFields.remark"
                    placeholder="请输入"
                  />
                  <el-date-picker
                    v-else
                    v-model="updateFields.deliveryTime"
                    style="width: 200px"
                    placeholder="请选择"
                  />
                </div>
              </div>
            </el-col>
          </el-row>
        </informationCard>

        <!-- 订单详情 -->
        <informationCard title="订单详情">
          <!-- <el-select v-model="seletedProdunctId">
            <el-option v-for="product in orderDetail.products" :key="product.id" :label="product.id"
              :value="product.id">
            </el-option>
          </el-select> -->

          <el-table :data="displayProducts" style="width: 100%">
            <el-table-column prop="productId" label="产品编号">
              <!-- <template #default="scope">
              <el-select  v-if="scope.$index >= 2" v-model="selectedProductIds.value[scope.$index]" @change="updateRow(scope.row, scope.$index)">
                <el-option v-for="product in orderDetail.products" :key="product.productId" :label="product.productId"
                  :value="product.productId">
                </el-option>
              </el-select>
              <span v-else>{{ scope.row.productId }}</span>
            </template> -->
            </el-table-column>
            <el-table-column prop="product.name" label="产品名称">
              <template #default="scope">
                {{ scope.row.product ? scope.row.product.name : '未选择产品' }}
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="remark" label="其他信息" />
            <el-table-column prop="action" label="操作" width="180">
              <template #default="scope">
                <el-button @click="onEditProduct(scope.row)" link type="primary" size="small"
                  >编辑</el-button
                >
                <el-button link type="primary" size="small" @click="onDeleteProduct(scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="add-row">
            <span class="add-row-text">增加</span>
            <el-input v-model="addRowCount" class="input-blank" />
            <span class="add-row-text">行</span>
          </div>
        </informationCard>

        <!-- 关联订单 -->
        <informationCard title="关联订单">
          <el-table :data="relatedOrdersTable" style="width: 100%">
            <el-table-column prop="type" label="订单类型" width="100" />
            <el-table-column prop="orderId" label="订单ID" />
            <el-table-column prop="action" label="操作" width="180">
              <template #default="scope">
                <el-button
                  v-for="action in scope.row.actions"
                  :key="action.name"
                  link
                  type="primary"
                  size="small"
                  @click="handleAction(action.method, scope.row)"
                >
                  {{ action.name }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </informationCard>
      </div>
    </div>
    <el-footer class="footer">
      <el-button @click="onBoxCancel">取消</el-button>
      <el-button type="primary" @click="onBoxSubmit">提交</el-button>
    </el-footer>

    <el-dialog v-model="editDialogVisible" width="800px">
      <CreateForm :data="newPackagingList" :Formvalue="newSubmit" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
          <el-button
            type="info"
            @click="
              () => {
                editDialogVisible = false
              }
            "
          >
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editproductVisible" title="编辑产品" width="500px">
      <el-form :model="updatedProduct" label-width="100px">
        <el-form-item label="产品编号">
          <el-input v-model="updatedProduct.productId" disabled />
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input v-model="updatedProduct.productName" disabled />
        </el-form-item>
        <el-form-item label="产品数量">
          <el-input v-model="updatedProduct.productQuantity" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editproductVisible = false">取消</el-button>
        <el-button type="primary" @click="onEditProductConfirm(updatedProduct)">保存</el-button>
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
import { deleteProduct } from '@/apis/products'
import { getPackagingByOrderCode } from '@/apis/produceControl/produce/packaging'
import {
  ElButton,
  ElInput,
  ElDatePicker,
  ElRow,
  ElCol,
  ElTable,
  ElTableColumn,
  ElFooter,
  ElMessageBox,
  ElDialog,
  dayjs,
} from 'element-plus'
import CreateForm from '@/components/form/CreateForm.vue'
import PackagingList from './packagingList.vue'
import ProductionSchedule from './productionSchedule.vue'
import { messageBox } from '@/components/message/messageBox'
// Props
const props = defineProps<{
  detail: any
  id: number
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
}>()

const packagingInstance = getPackagingByOrderCode(props.id)
packagingInstance().then((res) => (relatedOrdersTable.value[2].xxx = res.total))
const orderDetail = computed(() => props.detail)

onMounted(() => {
  console.log('订单详情组件加载', props.id)
  fetchOrderProducts(props.id)
})

// 控制 CreateForm 的显示
const showCreateForm = ref(false)
// 打开 CreateForm
const openCreateForm = () => {
  showCreateForm.value = true
}

const editDialogVisible = ref(false)
const editproductVisible = ref(false)
// 订单状态
const statusText = ref(getStatusText(props.detail.status))

// 业务订单基本信息的字段信息
const fields = ref([
  { label: '订单ID', value: props.detail.id },
  { label: '创建日期', value: props.detail.createTime },
  { label: '订单状态', value: statusText.value },
  { label: '客户姓名', value: props.detail.customerName },
  { label: '交付日期', value: props.detail.deliveryTime },
  { label: '其他基本信息', value: props.detail.remark },
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
const orderProducts = ref([])

// 获取订单产品数据
const fetchOrderProducts = async (orderId: number) => {
  try {
    const res = await getOrderDetail(orderId)
    if (res.products) {
      orderProducts.value = res.products || []
    } else {
      messageBox('error', null, null, '获取订单产品数据失败, 请检查订单是否存在产品信息')
    }
  } catch (error) {
    console.error('获取订单产品数据失败:', error)
    messageBox('error', null, null, '获取订单产品数据失败, 请稍后再试')
  }
}

// 用户选择的产品编号
const selectedProductIds = ref({})

// 用户输入的新增的行数
const addRowCount = ref(0)
const newRowCount = computed(() => Number(addRowCount.value) + 2)

// 展示出来的产品数据
const displayProducts = computed(() => {
  if (addRowCount.value == 0) {
    return orderProducts.value.slice(0, 2)
  }
  return [...orderProducts.value.slice(0, newRowCount.value)]
})

// 编辑弹窗的产品数据
const updatedProduct = ref({
  productId: 0,
  productName: '',
  productQuantity: 0,
})

// 根据id查找出来的产品数据
const productDetail = ref([])

// updateRow: 更新产品行
const updateRow = (row, rowIndex) => {
  //  const selectedProduct = orderProducts.value.find(item => item.productId === row.productId);
  const selectedProduct = orderProducts.value.find(
    (item) => item.productId == selectedProductIds.value[rowIndex],
  )
  console.log(selectedProductIds.value, 'selectedProductIds.value')
  console.log('orderProducts.value', orderProducts.value)
  console.log('selectedProduct', selectedProduct)
  // if (selectedProduct) {
  //   row.product.name = selectedProduct.product.name;
  //   row.quantity = selectedProduct.quantity;
  //   row.remark = selectedProduct.remark;
  // } else {
  //   row.product.name = '';
  //   row.quantity = 0;
  //   row.remark = '';
  // }
}

// onDeleteProduct: 删除订单产品
const onDeleteProduct = (row: any) => {
  ElMessageBox.confirm('确定删除该产品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 删除逻辑
      deleteProduct(row.productId)
        .then(() => {
          // 从订单产品列表中移除该产品
          orderProducts.value = orderProducts.value.filter(
            (item) => item.productId !== row.productId,
          )
          fetchOrderProducts(props.id)
          messageBox('success', null, '产品已成功删除')
        })
        .catch((error) => {
          console.error('删除产品失败:', error)
          messageBox('error', null, null, '删除产品失败, 请稍后再试')
        })
    })
    .catch(() => {
      messageBox('success', null, '已取消删除操作')
    })
}

// onEditProduct: 编辑订单产品
const onEditProduct = async (row: any) => {
  console.log('编辑产品:', row)

  editproductVisible.value = true
  updatedProduct.value = {
    productId: row.productId,
    productName: row.product?.name || '',
    productQuantity: row.quantity,
  }
}

// onEditProductConfirm: 确认编辑产品
const onEditProductConfirm = async (product: any) => {
  console.log('确认编辑产品:', product)
  try {
    await putOrder({
      ...orderDetail.value,
      products: orderProducts.value.map((item) =>
        item.productId === product.productId
          ? {
              ...item,
              quantity: Number(product.productQuantity),
            }
          : item,
      ),
    })
    fetchOrderProducts(props.id)
    messageBox('success', null, '订单产品已成功更新')
  } catch (error) {
    console.error('更新订单产品失败:', error)
    messageBox('error', null, null, '更新订单产品失败，请稍后再试')
  }
  editproductVisible.value = false
}

// 关联订单数据和操作
// 分包表
const packagingList = ref([])

// 采购表
const purchaseTable = ref([])

// viewPuchaseOrder: 查看外购表
const viewPuchaseOrder = (row: any) => {
  console.log('查看外购表', row)
  props.addTab(`外购表 ${row.orderId}`, PackagingList, {
    orderId: props.id,
    control: props.control,
  })
}

// addProductsSchedule: 创建布产表
const addProductsSchedule = (row: any) => {
  console.log('创建布产表', row)
}

// viewProductsSchedule: 查看布产表
const viewProductsSchedule = (row: any) => {
  console.log('查看布产表', row)
  props.addTab(`布产表 ${row.orderId}`, ProductionSchedule, {
    orderId: props.id,
    control: props.control,
  })
}

// addPackagingList: 创建分包表
const addPackagingList = (row: any) => {
  console.log('创建分包表', row)
  // // 创建分包表逻辑
  openCreateForm()
  // getPackagingList(props.id)
}

// viewPackagingList: 查看分包表
const viewPackagingList = async (row: any) => {
  props.addTab(
    `分包表 ${row.orderId}`,
    PackagingList,
    {
      orderCode: props.id,
    },
    props.control,
  )
}
// handleAction: 处理关联订单的操作
const handleAction = (method: Function, row: any) => {
  method(row)
}

// 关联订单
const relatedOrdersTable = ref([
  {
    // todo: 后端还没写外购表
    type: '外购表',
    orderId: props.id,
    actions: [{ name: '查看', method: viewPuchaseOrder }],
  },
  {
    type: '布产表',
    orderId: props.id,
    actions: [
      { name: '创建', method: addProductsSchedule },
      { name: '查看', method: viewProductsSchedule },
    ],
  },
  {
    type: '分包表',
    orderId: props.id,
    actions: [
      { name: '创建', method: addPackagingList },
      { name: '查看', method: viewPackagingList },
    ],
  },
])

// //  页脚按钮
// onBoxSubmit: 提交按钮
const onBoxSubmit = () => {
  console.log('提交1111', updateFields.value)
  const submitData = { ...updateFields.value }
  if (submitData.deliveryTime instanceof Date) {
    submitData.deliveryTime = dayjs(submitData.deliveryTime).format('YYYY-MM-DD')
  }

  putOrder(submitData)
    .then(() => {
      messageBox('success', null, '订单已成功提交')
    })
    .catch((error) => {
      console.error('提交订单失败:', error)
      messageBox('error', null, null, '提交订单失败，请稍后再试')
    })
  const res = getOrdersList()
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
</style>
