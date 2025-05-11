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