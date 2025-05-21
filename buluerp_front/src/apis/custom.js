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

export function deleteCustomer(id) {
  return httpInstance({
    url: `system/customers/${id}`,
    method: 'delete',
    headers: headers,
  })
}

export function listCustomer(
  pageNum,
  pageSize,
  searchContent = { name: '', contact: '', email: '', remarks: '' },
) {
  return httpInstance({
    url: `system/customers/list?pageNum=${pageNum}&pageSize=${pageSize}&name=${searchContent.name}&contact=${searchContent.contact}&email=${searchContent.email}&remarks=${searchContent.remarks}`,
    method: 'get',
    headers: headers,
  })
}
export function exportSelectTable(data) {
  return httpInstance({
    url: `system/customers/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType:"blob",
    data: data,
  })
}
