import httpInstance from "@/utils/httpsInstance.js"

export function getMaterialList(params) {
  return httpInstance({
    url: 'system/material-info/list',
    method: 'get',
    params
  })
}

export function addMaterial(data) {
  return httpInstance({
    url: 'system/material-info',
    method: 'post',
    data
  })
}

export function updateMaterial(data) {
  return httpInstance({
    url: 'system/material-info',
    method: 'PUT',
    data: data 
  })
}

export function deleteMaterial(ids) {
  const idStr = Array.isArray(ids) ? ids.join(',') : ids 
  return httpInstance({
    url: `system/material-info/${idStr}`,
    method: 'delete'
  })
}

export function importMaterialFile(formData) {
  return httpInstance({
    url: '/system/material-info/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}