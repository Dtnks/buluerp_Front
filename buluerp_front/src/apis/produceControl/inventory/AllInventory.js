import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newRecording(data, type) {
  return httpInstance({
    url: `system/inventory/${type}`,
    method: 'post',
    headers,
    data: data,
  })
}

export function changeRecording(data, type) {
  return httpInstance({
    url: `system/inventory/${type}`,
    method: 'put',
    headers,
    data: data,
  })
}

export function changeSafeNumber(id, number, type) {
  return httpInstance({
    url: `system/inventory/${type}/safe-quantity/${id}?safeQuantity=${number}`,
    method: 'put',
    headers,
  })
}

export function detailRecording(id, type) {
  return httpInstance({
    url: `system/inventory/${type}/${id}`,
    method: 'get',
    headers: headers,
  })
}
export function storeRecording(pageNum, pageSize, type, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/inventory/${type}/store?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}

export function deleteRecording(ids, type) {
  console.log(`system/inventory/${type}/${ids.join(',')}`)
  return httpInstance({
    url: `system/inventory/${type}/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listRecording(pageNum, pageSize, type, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')

  return httpInstance({
    url: `system/inventory/${type}/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}
export function exportSelectTable(data, type) {
  return httpInstance({
    url: `system/inventory/${type}/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}

export function importFile(formData, type) {
  return httpInstance({
    url: `system/inventory/${type}/import`,
    method: 'post',
    data: formData,
    headers,
  })
}

export function downLoadModule(type) {
  return httpInstance({
    url: `/system/inventory/${type}/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}
