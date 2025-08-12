<template>
  <div class="col">
    <el-config-provider :locale="zhCn">
      <BordShow content="业务订单查询列表" path="业务中心/查询" />
      <div class="greyBack">
        <QueryForm @onSubmit="handleQuery" @onAdd="handleAdd"
          @customerSuggestions="customerSuggestions" @checkCustomerName="checkCustomerName"></QueryForm>
        <QueryTable :addTab="props.addTab" :pagination="pagination" :tableData="tableData"
          @onPageChange="handlePageChange" @onPageSizeChange="handleSizeChange" @fetchData="fetchTableData"
          @onUpdated="handleUpdate" @customerSuggestions="customerSuggestions" @checkCustomerName="checkCustomerName">
        </QueryTable>
      </div>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import BordShow from '@/components/board/SecBoard.vue'
import QueryForm from '../component/queryForm.vue'
import QueryTable from '../component/queryTable.vue'
import { getOrdersList, putOrder } from '@/apis/orders'
import { addOrder } from '../function/oders'
import type { TableDataType } from '@/types/orderResponse'
import { messageBox } from '@/components/message/messageBox'
import { listCustomerAll } from '@/apis/custom'
import useTabStore from '@/stores/modules/tabs'

const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any, targetPath?: string) => void

}>()
const tabStore = useTabStore()
// pagination: 分页数据
const pagination = reactive({
  page: 1,
  pageSize: 5,
  total: 0,
})

// tableData: 表格数据
const tableData = ref<TableDataType[]>([])

const queryParams = reactive({})

// fetchTableData: 获取table数据
const fetchTableData = async () => {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => value || value === 0),
    )
    const params = {
      ...filteredParams,
      orderByColumn: 'createTime', // 默认按创建时间排序
      isAsc: 'desc', // 默认降序
      pageNum: pagination.page,
      pageSize: pagination.pageSize,
    }
    const res = await getOrdersList(params)
    tableData.value = res.rows || []
    pagination.total = res.total || 0
  } catch (error) {
    console.error('获取订单数据失败(queryTable.vue):', error)
    messageBox('error', null, null, '获取订单数据失败', '请稍后重试')
  }
}
tabStore.addOrderFresh(fetchTableData)
// handleQuery: 处理查询
const handleQuery = (params: any) => {
  pagination.page = 1 // 查询时重置页码为 1
  Object.assign(queryParams, params) // 更新查询条件
  console.log('查询参数(handleQuery)', params)
  fetchTableData()
}

// handleAdd: 处理新增
const handleAdd = async (newData: TableDataType) => {
  const res = await addOrder(newData)
  messageBox('success', null, '订单已成功添加')
  fetchTableData()
  tabStore.freshTab('审核')
}

// handleUpdate: 处理编辑更新
const handleUpdate = async (updatedData: TableDataType) => {
  const res = await putOrder(updatedData)
  console.log(res)
  console.log('更新结果(handelUpdate):', res)
  messageBox('success', null, '订单已成功更新')
  fetchTableData()
  tabStore.freshTab('审核')
}

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

const suggestionResult = ref([])

// customerSuggestions: 客户姓名建议
const customerSuggestions = async (queryString: string, cb) => {
  const res = await listCustomerAll(queryString)
  const customerNames = ref(res.rows.map((customer) => customer.name))
  // 如果没有查询字符串，返回客户表第一页客户名称
  if (!queryString) {
    cb(customerNames.value.map((name) => ({ value: name })))
    return
  }

  const results = queryString
    ? customerNames.value.filter((customer) => customer.includes(queryString))
    : customerNames.value
  suggestionResult.value = queryString
    ? customerNames.value.filter((customer) => customer.includes(queryString))
    : customerNames.value
  cb(results.map((name) => ({ value: name })))

}

// checkCustomerName: 校验客户姓名
const checkCustomerName = async (customerName: string) => {
  await customerSuggestions(customerName, (suggestions) => {
    suggestionResult.value = suggestions
    console.log('校验客户姓名:', suggestionResult.value)
    if (suggestionResult.value.length === 0) {
      messageBox('error', null, null, '没有找到匹配的客户姓名, 请先添加客户')
    }
  })

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
