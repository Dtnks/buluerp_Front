// import request from '@/utils/request'
// import type { AxiosResponse } from 'axios'
// import type { OrderResponse } from '@/types/orderResponse'
import httpInstance from "@/utils/httpsInstance"

let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function getOrdersList(params={}) {
  return httpInstance({
    url: 'system/orders/list',
    method: 'get',
    headers: headers,
    params,

  })
}

export const editOder = ( data) => {
  return httpInstance({
    url: 'dev-api/system/orders/edit',
    method: 'post',
    data,
    headers: headers,
  })
}
export const deleteOrder = ( id) => {
  return httpInstance({
    url: `dev-api/system/orders/${id}`,
    method: 'post',
    headers: headers,
  })
}

export const getOrderDetailById = ( id) => {
  return httpInstance({
    url: `system/orders/${id}`,
    method: 'get',
    headers: headers,
  })
}

export const postOrder = ( data) => {
  return httpInstance({
    url: 'system/orders',
    method: 'post',
    data,
    headers: headers,
  })
}

export const putOrder = ( data) => {
  return httpInstance({
    url: 'system/orders',
    method: 'put',
    data,
    headers: headers,
  })
}



