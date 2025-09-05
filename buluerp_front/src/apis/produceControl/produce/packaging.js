import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newPackaging(data) {
  return httpInstance({
    url: `system/packaging-list`,
    method: 'post',
    headers: headers,
    data: data,
    headers,
  })
}

export function changePackaging(data) {
  return httpInstance({
    url: `system/packaging-list`,
    method: 'put',
    headers,
    data: data,
  })
}

export function deletePackaging(ids) {
  return httpInstance({
    url: `system/packaging-list/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listPackaging(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/packaging-list/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}

export function getPackagingListByOrderId(orderId) {
  return httpInstance({
    url: `system/packaging-list/list?orderCodeExact=${orderId}`,
    method: 'get',
    headers: headers,
  })
}
export function exportSelectTable(id) {
  return httpInstance({
    url: `system/packaging-list/export?id=${id}`,
    method: 'post',
    headers,
    responseType: 'blob',
  })
}

export function importFile(formData) {
  return httpInstance({
    url: 'system/packaging-list/import',
    method: 'post',
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function downLoadModule() {
  return httpInstance({
    url: `system/packaging-list/export/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

export function getPackagingDetail(id) {
  return httpInstance({
    url: `system/packaging-list?ids=${id}`,
    method: 'get',
    headers: headers,
  })
}
