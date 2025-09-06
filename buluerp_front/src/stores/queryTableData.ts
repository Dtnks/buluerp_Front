import { defineStore } from 'pinia'
import type { TableDataType } from '@/types/orderResponse'
import { reactive, ref } from 'vue'
import { getCustomerNameById } from '../views/business/function/oders'
import { getOrdersList, putOrder } from '@/apis/orders'

export const useQueryTableDataStore = defineStore('table', () => {
  // 数据
  const tableData = ref<TableDataType[]>([])
  const total = ref(0)
  const pagination = reactive({
    current: 1,
    pageSize: 5,
    pageSizes: [10, 20, 30, 40, 50],
  })

  // 查询条件
  const queryParams = reactive<Record<string, any>>({
    id: 14,
    innerId: '',
    customerName: '',
    // orderId: '',
    createTime: '',
    status: '',
    remark: '',
  })
  // getOders: 获取订单数据(支持查询和分页)
  const getOrders = async () => {
    // 过滤掉空值或无效值
    const validParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([_, value]) => value !== '' && value !== null && value !== undefined,
      ),
    )

    const res = await getOrdersList({
      ...validParams,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 5,
    })
    tableData.value = res?.rows ?? []
    total.value = res.total || 0
  }

  // 设置查询条件
  const setQueryParams = (params: Record<string, any>) => {
    Object.assign(queryParams, params)
  }

  // 设置分页数据
  const setPage = (page: number) => {
    pagination.current = page
  }

  const setPageSize = (size: number) => {
    pagination.pageSize = size
  }

  // addTableData: 添加订单数据
  const addTableData = (newData: TableDataType) => {
    tableData.value.push(newData)
    // // 设置分页数据总数量
    // pagination.total = res.total;
  }

  // editTableData: 编辑订单数据
  const editTableData = async (aditData: TableDataType) => {
    await putOrder(aditData)
    // 更新
    const index = tableData.value.findIndex((item) => item.id === aditData.id)
    tableData.value[index] = { ...tableData.value[index], ...aditData }

    // // 设置分页数据总数量
    // pagination.total = res.total;
  }

  return {
    tableData,
    getOrders,
    addTableData,
    editTableData,
    setQueryParams,
    queryParams,
    pagination,
    total,
    setPage,
    setPageSize,
  }
})
