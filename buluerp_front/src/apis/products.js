import httpInstance from "@/utils/httpsInstance.js"
import { ElMessage } from "element-plus"

export function getList_pro(params) {
    return httpInstance({
      url: 'system/products/list',
      method: 'get',
      params
    })
  }

export function getProductDetail(id) {
  return httpInstance({
    url: `system/products/${id}`,
    method: 'get',
  })
}

export function createProduct(formData) {
  return httpInstance({
    url: 'system/products',
    method: 'post',
    data: formData
  })
}

export function deleteProduct(ids) {
  const idStr = Array.isArray(ids) ? ids.join(',') : ids
  return httpInstance({
    url: `system/products/${idStr}`,
    method: 'delete'
  })
}


export function importProductFile(formData) {
  return httpInstance({
    url: '/system/products/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function updateProduct(data) {
  const formData = new FormData();

  formData.append('id', String(data.id));
  formData.append('name', data.name);
  formData.append('designStatus', String(data.designStatus));

  // 默认 deletePicture = 0，除非明确要求删除
  formData.append('deletePicture', String(data.deletePicture === 1 ? 1 : 0));

  if (data.picture instanceof File) {
    formData.append('picture', data.picture);
  }

  return httpInstance({
    url: 'system/products',
    method: 'put',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}




export function getProductTemplate() {
  return httpInstance({
    url: 'system/products/template',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportProduct(ids) {
  return httpInstance({
    url: `system/products/export/${ids}`,
    method: 'post',
    responseType: 'blob'
  })
}

