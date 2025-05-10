import request from '@/utils/request'

let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function getOrdersList() {
  return request({
    url: 'dev-api/system/orders/list',
    method: 'get',
    headers: headers,
  })
}
