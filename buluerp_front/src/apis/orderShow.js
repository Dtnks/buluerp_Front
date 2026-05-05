import httpInstance from '@/utils/httpsInstance'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function getOrdersData() {
  return httpInstance({
    url: 'system/orders/statistics',
    method: 'get',
    headers: headers,
  })
}
