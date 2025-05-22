import httpInstance from "@/utils/httpsInstance.js"

export function getMaterialList(id) {
  return httpInstance({
    url: `system/style/${id}`,
    method: 'get',
  })
}

export function updateMaterial(data) {
  return httpInstance({
    url: 'system/products',
    method: 'PUT',
    data: data 
  })
}