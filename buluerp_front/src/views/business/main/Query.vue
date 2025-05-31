<template>
  <div class="col">
    <el-config-provider :locale="zhCn">
      <BordShow content="业务订单查询列表" path="业务中心/查询" />
      <div class="greyBack">
        <QueryForm @onSubmit="handleQuery" @onAdd="handleAdd" :control="control"></QueryForm>
        <QueryTable :addTab="props.addTab" :pagination="pagination" :tableData="tableData" :control="control"
          @onPageChange="handlePageChange" @onPageSizeChange="handleSizeChange" @fetchData="fetchTableData"
          @onUpdated="handleUpdate">
        </QueryTable>
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
import { getOrdersList, putOrder } from '@/apis/orders'
import { addOrder, searchOrders } from '../function/oders'
import type { OrderResponse, TableDataType } from '@/types/orderResponse'

const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
}>()
// pagination: 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 5,
  total: 0,
})

// tableData: 表格数据
const tableData = ref<TableDataType[]>([])

const queryParams = reactive({})
// todo: 查询要再和后端对一下
// fetchTableData: 获取table数据
const fetchTableData = async () => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => value != '')
    );
    const params = {
      ...filteredParams,
      pageNum: pagination.page,
      pageSize: pagination.pageSize,
    }
    const res = await getOrdersList(params);
    console.log('获取订单数据(queryTable.vue):', res)
    tableData.value = res.rows || []
    pagination.total = res.total || 0
  } catch (error) {
    console.error('获取订单数据失败(queryTable.vue):', error)
  }
}

// handleQuery: 处理查询
const handleQuery = (params: any) => {

  pagination.page = 1; // 查询时重置页码为 1
  Object.assign(queryParams, params); // 更新查询条件
  console.log('查询参数(handleQuery):', params);
  fetchTableData()
};

// handleAdd: 处理新增
const handleAdd = async (newData: TableDataType) => {
  try {
    console.log('1111新增数据(handleAdd):', newData);
    const res = await addOrder(newData)
    if (res.code === 200) {
      console.log('新增结果(handleAdd):', res)
      fetchTableData()
    }

  } catch (err) {
    console.error('新增失败:', err)
  }
};

// handleUpdate: 处理更新
const handleUpdate = async (updatedData: TableDataType) => {
  try {
    const res = await putOrder(updatedData);
    if (res.code == 200) {
      console.log('更新结果(handelUpdate):', res);
      fetchTableData();
    }
  } catch (err) {
    console.error('更新失败:', err);
  }
};

// handlePageChange: 处理分页
const handlePageChange = (page: number) => {
  pagination.page = page
  fetchTableData() // 获取数据
}

// handleSizeChange: 处理每页条数变化
const handleSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1 // 重置页码为 1
  fetchTableData() // 获取数据
}

// 初始化数据
onMounted(() => {
  fetchTableData()
})
</script>

<style scoped lang="less">
.form-buttons {
  display: flex;
  gap: 0 20px;
  justify-content: flex-end;
}

::v-deep(.table-container .el-card__body) {
  padding: 0 !important;
}
</style>
