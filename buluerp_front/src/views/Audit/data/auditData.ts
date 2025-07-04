export const TypeOptions = [
  { label: '全部审核记录', value: '' },
  { label: '订单', value: 'order' },
  { label: '委外加工单', value: 'pending' },
  { label: '布产', value: 'production' },
  { label: '采购单', value: 'purchase' },
  { label: '分包单', value: 'subcontract' },
]

export const formData = {}

export const columns = {
  order: [
    { value: 'id', label: 'ID' },
    { value: 'orderNo', label: '订单号' },
    { value: 'orderType', label: '订单类型' },
  ],
  pending: [
    { value: 'id', label: 'ID' },
    { value: 'orderNo', label: '委外加工单号' },
    { value: 'orderType', label: '委外加工类型' },
  ],
  production: [
    { value: 'id', label: 'ID' },
    { value: 'orderNo', label: '布产单号' },
    { value: 'orderType', label: '布产类型' },
  ],
  purchase: [
    { value: 'id', label: 'ID' },
    { value: 'orderNo', label: '采购单号' },
    { value: 'orderType', label: '采购类型' },
  ],
  subcontract: [
    { value: 'id', label: 'ID' },
    { value: 'orderNo', label: '分包单号' },
    { value: 'orderType', label: '分包类型' },
  ],
}

export const tableData = {
  order: [
    { id: 1, orderNo: 'ORD001', orderType: '销售订单' },
    { id: 2, orderNo: 'ORD002', orderType: '采购订单' },
  ],
  pending: [
    { id: 1, orderNo: 'PEND001', orderType: '外包加工' },
    { id: 2, orderNo: 'PEND002', orderType: '内部加工' },
  ],
  production: [
    { id: 1, orderNo: 'PROD001', orderType: '新产品布产' },
    { id: 2, orderNo: 'PROD002', orderType: '旧产品布产' },
  ],
  purchase: [
    { id: 1, orderNo: 'PUR001', orderType: '原材料采购' },
    { id: 2, orderNo: 'PUR002', orderType: '成品采购' },
  ],
  subcontract: [
    { id: 1, orderNo: 'SUB001', orderType: '外包分包' },
    { id: 2, orderNo: 'SUB002', orderType: '内部分包' },
  ],
}
