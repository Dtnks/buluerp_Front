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

export const editOder = (data) => {
  return httpInstance({
    url: 'system/orders/edit',
    method: 'post',
    data,
    headers: headers,
  })
}
export const deleteOrders = (ids) => {
  const idStr = Array.isArray(ids) ? ids.join('-') : ids
  return httpInstance({
    url: `system/orders/${idStr}`,
    method: 'delete',
    headers: headers,
  })
}

// 根据订单id获取订单详情
export const getOrderDetailById = (id) => {
  // 使用httpInstance发送get请求，获取订单详情
  return httpInstance({
    // 请求的url
    url: `system/orders/${id}`,
    // 请求的方法
    method: 'get',
    // 请求的头部信息
    headers: headers,
  })
}

// 新增
export const postOrder = (data) => {
  return httpInstance({
    url: 'system/orders',
    method: 'post',
    data,
    headers: headers,
  })
}

// 修改
export const putOrder = (data) => {
  return httpInstance({
    url: 'system/orders',
    method: 'put',
    data,
    headers: headers,
  })
}
export function importOrderFile(formData) {
  return httpInstance({
    url: '/system/oders/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}



