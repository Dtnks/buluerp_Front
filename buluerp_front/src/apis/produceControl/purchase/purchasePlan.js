import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function getList() {
  return httpInstance({
    url: `system/orders/list`,
    method: 'get',
    headers: headers,
  })
}
