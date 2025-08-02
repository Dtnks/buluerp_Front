import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newPurchasePlan(data) {
  return httpInstance({
    url: `system/purchase-collection/from-info`,
    method: 'post',
    data,
  })
}

export function getPurchaseListByOrderId(orderId) {
  return httpInstance({
    url: `system/purchase-collection/list?orderCodeExact=${orderId}`,
    method: 'get',
    headers: headers,
  })
}

export function finishPurchasePlan(data) {
  return httpInstance({
    url: `system/purchase-collection/mark-all-done`,
    method: 'post',
    headers: headers,
    data: data,
  })

}

export function changePurchasePlan(data) {
  return httpInstance({
    url: `system/purchase-collection`,
    method: 'put',
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  })
}

export function downLoadModule() {
  return httpInstance({
    url: `system/purchase-collection/export/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

export function deletePurchasePlan(ids) {
  return httpInstance({
    url: `system/purchase-collection/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listPurchasePlan(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/purchase-collection/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}

export function detailPurchasePlan(orderCode) {
  return httpInstance({
    url: `system/purchase-collection/list?orderCode=${orderCode}`,
    method: 'get',
    headers: headers,
  })
}

export function exportSelectTable(data) {
  return httpInstance({
    url: `system/purchase-collection/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}
export function listPurchasePlanByOrderCode(orderCode){
  let context= `system/purchase-collection/list?orderCodeExact=${orderCode}`
  return function(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `${context}&pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}}
export function importFile(formData) {
  return httpInstance({
    url: 'system/purchase-collection/import',
    method: 'post',
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function getPurchasePlanDetail(id) {
  return httpInstance({
    url: `system/purchase-collection/list?id=${id}`,
    method: 'get',
    headers: headers,
  })
}
