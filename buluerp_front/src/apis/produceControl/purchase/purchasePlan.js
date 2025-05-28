import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newPurchasePlan(data) {
  return httpInstance({
    url: `system/purchase-collection`,
    method: 'post',
    headers: headers,
    data: data,
  })
}

export function changePurchasePlan(data) {
  return httpInstance({
    url: `system/purchase-collection`,
    method: 'put',
    headers: headers,
    data: data,
  })
}

export function detailPurchasePlan(id) {
  return httpInstance({
    url: `system/purchase-collection/${id}`,
    method: 'get',
    headers: headers,
  })
}

export function deletePurchasePlan(ids) {
  return httpInstance({
    url: `system/purchase-collection/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listPurchasePlan(
  pageNum,
  pageSize,
  searchContent = { name: '', contact: '', email: '', remarks: '' },
) {
  return httpInstance({
    url: `system/purchase-collection/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${searchContent.name}&contact=${searchContent.contact}&email=${searchContent.email}&remarks=${searchContent.remarks}&creatTime=${searchContent.creatTime}`,
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

export function importFile(formData) {
  return httpInstance({
    url: 'system/purchase-collection/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
