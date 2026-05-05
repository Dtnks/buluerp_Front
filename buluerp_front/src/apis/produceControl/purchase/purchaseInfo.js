import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export function getPurchaseInfo(id) {
  return httpInstance({
    url: `/system/purchase-info`,
    params: { ids: id },
    method: 'get',
  })
}
export function newPurchaseInfo(data) {
  return httpInstance({
    url: `system/purchase-info`,
    method: 'post',
    headers: headers,
    data: data,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function changePurchaseInfo(data) {
  return httpInstance({
    url: `system/purchase-info`,
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
    url: `system/purchase-info/export/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

export function deletePurchaseInfo(ids) {
  return httpInstance({
    url: `system/purchase-info/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listPurchaseInfo(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/purchase-info/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}

export function detailPurchaseInfo(orderCode) {
  return httpInstance({
    url: `system/purchase-info/list?orderCode=${orderCode}`,
    method: 'get',
    headers: headers,
  })
}

export function exportSelectTable(data) {
  return httpInstance({
    url: `system/purchase-info/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}

export function importFile(formData) {
  return httpInstance({
    url: 'system/purchase-info/import',
    method: 'post',
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}
