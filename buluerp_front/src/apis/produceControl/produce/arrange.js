import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newPurchaseArrange(data) {
  return httpInstance({
    url: `system/production-arrange`,
    method: 'post',
    headers: headers,
    data: data,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function changePurchaseArrange(data) {
  return httpInstance({
    url: `system/production-arrange`,
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
    url: `system/production-arrange/export/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

export function deletePurchaseArrange(ids) {
  return httpInstance({
    url: `system/production-arrange/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listPurchaseArrange(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/production-arrange/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}
export function exportSelectTable(data) {
  return httpInstance({
    url: `system/production-arrange/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}

export function importFile(formData) {
  return httpInstance({
    url: 'system/production-arrange/import',
    method: 'post',
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}
