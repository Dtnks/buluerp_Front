import httpInstance from "@/utils/httpsInstance.js"

export function getMaterialList(params) {
  return httpInstance({
    url: 'system/material-info/list',
    method: 'get',
    params
  })
}

export function updateMaterial(data) {
  return httpInstance({
    url: 'system/products',
    method: 'PUT',
    data: data 
  })
}