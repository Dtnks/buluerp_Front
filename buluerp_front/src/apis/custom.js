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

export function listCustomer(pageNum, pageSize) {
  return httpInstance({
    url: `system/customers/list?pageNum=${pageNum}&pageSize=${pageSize}`,
    method: 'get',
    headers: headers,
  })
}
