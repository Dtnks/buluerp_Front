import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newPurchaseList(data) {
  return httpInstance({
    url: `system/purchase/order`,
    method: 'post',
    headers: headers,
    data: data,
    headers,
  })
}

export function changePurchaseList(data) {
  return httpInstance({
    url: `system/purchase/order`,
    method: 'put',
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  })
}

// export function downLoadModule() {
//   return httpInstance({
//     url: `system/purchase-collection/export/template`,
//     method: 'get',
//     headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
//     responseType: 'blob',
//   })
// }

export function detailPurchaseList(id) {
  return httpInstance({
    url: `system/purchase/order/${id}`,
    method: 'get',
    headers: headers,
  })
}

export function deletePurchaseList(ids) {
  return httpInstance({
    url: `system/purchase-collection/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listPurchaseList(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/purchase/order/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
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
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}
