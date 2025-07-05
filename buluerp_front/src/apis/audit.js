import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export const getAuditSwitchList = () => {
  return httpInstance({
    url: `system/audit-switch/list`,
    method: 'get',
    headers: headers,
  })
}

export const updateAuditSwitch = (auditType, status) => {
  return httpInstance({
    url: `system/audit-switch/status/${auditType}/${status}`,
    method: 'put',
    headers: headers,
  })
}

export const getAuditSwitchEnabled = (auditType) => {
  return httpInstance({
    url: `system/audit-switch/enabled/${auditType}`,
    method: 'get',
    headers: headers,
  })
}

// getAuditList: 获取审核记录列表
export const getAuditList = (pageNum, pageSize) => {
  return httpInstance({
    url: `system/audit/list`,
    method: 'get',
    headers: headers,
    params: { pageNum, pageSize },
  })
}

// getAuditOrderPending: 获取待审核订单列表
export const getAuditOrderPending = (pageNum, pageSize) => {
  return httpInstance({
    url: `system/audit/order/pending`,
    method: 'get',
    headers: headers,
    params: { pageNum, pageSize },
  })
}

// getAuditProductionPending: 获取待审核布产列表
export const getAuditProductionPending = (pageNum, pageSize) => {
  return httpInstance({
    url: `system/audit/production/pending`,
    method: 'get',
    headers: headers,
    params: { pageNum, pageSize },
  })
}
// getAuditPurchasePending: 获取待审核采购列表
export const getAuditPurchasePending = (pageNum, pageSize) => {
  return httpInstance({
    url: `system/audit/purchase/pending`,
    method: 'get',
    headers: headers,
    params: { pageNum, pageSize },
  })
}

// getAuditSubcontractPending: 获取待审核分包列表
export const getAuditSubcontractPending = (pageNum, pageSize) => {
  return httpInstance({
    url: `/system/audit/packaging/pending`,
    method: 'get',
    headers: headers,
    params: { pageNum, pageSize },
  })
}

// postAuditOder: 提交订单审核
export const postAuditOder = (auditId, data) => {
  return httpInstance({
    url: `/system/audit/order/audit/${auditId}`,
    method: 'post',
    headers: headers,
    data: { ...data },
  })
}

// postAuditProduction: 提交布产审核
export const postAuditProduction = (auditId, commitData) => {
  return httpInstance({
    url: `/system/audit/production/audit/${auditId}`,
    method: 'post',
    headers: headers,
    data: { ...commitData },
  })
}

// postAuditPurchase: 提交采购审核
export const postAuditPurchase = (auditId, commitData) => {
  return httpInstance({
    url: `/system/audit/purchase/audit/${auditId}`,
    method: 'post',
    headers: headers,
    data: { ...commitData },
  })
}

// postAuditSubcontract: 提交分包审核
export const postAuditSubcontract = (auditId, commitData) => {
  return httpInstance({
    url: `/system/audit/packaging/audit/${auditId}`,
    method: 'post',
    headers: headers,
    data: { ...commitData },
  })
}
