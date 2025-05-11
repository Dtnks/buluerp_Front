import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type { OrderResponse } from '@/types/orderResponse'

let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function getOrdersList(): Promise<AxiosResponse<OrderResponse>> {
  return request({
    url: 'dev-api/system/orders/list',
    method: 'get',
    headers: headers,
  })
}

export const editOder = ( data: any) => {
  return request({
    url: 'dev-api/system/orders/edit',
    method: 'post',
    data,
    headers: headers,
  })
}
export const deleteOrder = ( id: any) => {
  return request({
    url: `dev-api/system/orders/${id}`,
    method: 'post',
    id,
    headers: headers,
  })
}



