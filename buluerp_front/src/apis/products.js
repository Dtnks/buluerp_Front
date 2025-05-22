import httpInstance from "@/utils/httpsInstance.js"

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
  const idStr = Array.isArray(ids) ? ids.join('-') : ids
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