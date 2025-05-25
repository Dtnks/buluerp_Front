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
  return httpInstance({
    url: `system/orders/${ids}`,
    method: 'post',
    data: { ids },
    headers: headers,
  })
}

export const getOrderDetailById = (id) => {
  return httpInstance({
    url: `system/orders/${id}`,
    method: 'get',
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

export function updateOrder(data) {
  const formData = new FormData();
  formData.append('id', data.id);
  formData.append('name', data.name);
  formData.append('designStatus', data.designStatus);
  if (data.pictureFile) {
    console.log('上传图片文件：', data.pictureFile);
    formData.append('picture', data.pictureFile);
  }

  return httpInstance({
    url: 'system/orders',
    method: 'put',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}


