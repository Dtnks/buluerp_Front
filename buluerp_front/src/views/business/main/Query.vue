<template>
  <div>
    <el-config-provider :locale="zhCn">
      <BordShow content="业务订单查询列表" path="业务中心/查询" />
      <div class="greyBack">
        <QueryForm @onSubmit="handleQuery" @onAdd="handleAdd"></QueryForm>
        <QueryTable
          :queryParams="queryParams"
          :addTab="props.addTab"
          :pagination="pagination"
          :tableData="tableData"
          @onPageChange="handlePageChange"
        ></QueryTable>
      </div>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import BordShow from '@/components/board/SecBoard.vue'
// import type { FormInstance } from 'element-plus';
// import type { ElForm } from 'element-plus';
// import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';
// import { Search } from '@element-plus/icons-vue';
import QueryForm from '../component/queryForm.vue'
import QueryTable from '../component/queryTable.vue'
import { getOrdersList } from '@/apis/orders'
import { addOrder } from '../apis/oders'

const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
}>()

// queryParams: 查询参数
const queryParams = reactive({
  orderId: '',
  status: '',
  createTime: '',
  customerName: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
})

// pagination: 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// tableData: 表格数据
const tableData = ref([])

// fetchTableData: 获取table数据
// todo: 封装过searchOrder可以拿来用
const fetchTableData = async () => {
  try {
    // 过滤掉空值的查询参数
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([key, value]) => value !== '' || key === 'pageNum' || key === 'pageSize',
      ),
    )
    console.log('过滤后的查询参数:', filteredParams)

    const params = {
      ...queryParams,
      pageNum: pagination.page,
      pageSize: pagination.pageSize,
    }
    console.log('查询参数:', params)

    const res = await getOrdersList(params)
    console.log('获取订单数据(queryTable.vue):', res)
    tableData.value = res.rows || []
    pagination.total = res.total || 0
  } catch (error) {
    console.error('获取订单数据失败(queryTable.vue):', error)
  }
}

// handleQuery: 处理查询
const handleQuery = (params: Record<string, any>) => {
  Object.assign(queryParams, params) // 更新查询条件
  pagination.page = 1 // 查询时重置页码为 1
  fetchTableData() // 获取数据
}

// handleAdd: 处理新增
const handleAdd = async (newData: Record<string, any>) => {
  try {
    const res = await addOrder(newData)
    console.log('新增结果:', res)
    fetchTableData() // 重新获取数据
  } catch (err) {
    console.error('新增失败:', err)
  }
}

// handlePageChange: 处理分页
const handlePageChange = (page: number, pageSize: number) => {
  pagination.page = page
  pagination.pageSize = pageSize
  fetchTableData() // 获取数据
}

// 初始化数据
onMounted(() => {
  fetchTableData()
})
</script>

<style scoped lang="less">
// .input {
//   margin-bottom: 20px;
// }

.form-buttons {
  display: flex;
  gap: 0 20px;
  justify-content: flex-end;
  // margin-right: 10px;
  // margin-top: 10px;
}

// .el-table {
//   margin-top: 20px;
// }

::v-deep(.table-container .el-card__body) {
  padding: 0 !important;
}
</style>
