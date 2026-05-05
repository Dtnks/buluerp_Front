import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newCustomer(data) {
  return httpInstance({
    url: `system/customers`,
    method: 'post',
    headers: headers,
    data: data,
  })
}

export function changeCustomer(data) {
  return httpInstance({
    url: `system/customers`,
    method: 'put',
    headers: headers,
    data: data,
  })
}

export function detailCustomer(id) {
  return httpInstance({
    url: `system/customers/${id}`,
    method: 'get',
    headers: headers,
  })
}

export function deleteCustomer(ids) {
  return httpInstance({
    url: `system/customers/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listCustomer(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/customers/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}

export function listCustomerAll(name) {
  return httpInstance({
    url: `system/customers/list?name=${name || ''}`,
    method: 'get',
    headers: headers,
  })
}


export function exportSelectTable(data) {
  return httpInstance({
    url: `system/customers/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}

export function importCustomFile(formData) {
  return httpInstance({
    url: 'system/customers/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function downLoadModule() {
  return httpInstance({
    url: `system/customers/export/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}
