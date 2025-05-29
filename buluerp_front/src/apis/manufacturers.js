import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newManufacturers(data) {
  console.log(data, 'data')
  return httpInstance({
    url: `system/manufacturer`,
    method: 'post',
    headers: headers,
    data: data,
  })
}

export function changeManufacturers(data) {
  return httpInstance({
    url: `system/manufacturer`,
    method: 'put',
    headers: headers,
    data: data,
  })
}

export function detailManufacturers(id) {
  return httpInstance({
    url: `system/manufacturer/${id}`,
    method: 'get',
    headers: headers,
  })
}

export function deleteManufacturers(ids) {
  console.log(`system/manufacturer/${ids.join(',')}`)
  return httpInstance({
    url: `system/manufacturer/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listManufacturers(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/manufacturer/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
    //
    //
  })
}
export function exportSelectTable(data) {
  return httpInstance({
    url: `system/manufacturer/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}

export function importmanufacturersFile(formData) {
  return httpInstance({
    url: 'system/manufacturer/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function downLoadModule() {
  return httpInstance({
    url: `system/manufacturer/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}
