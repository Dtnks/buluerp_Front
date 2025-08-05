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

export function addPurMaterial(data) {
  return httpInstance({
    url: 'system/material-info/purchased',
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

export function importPurMaterialFile(formData) {
  return httpInstance({
    url: '/system/material-info/import/purchased',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getMaterialTemplate() {
  return httpInstance({
    url: 'system/material-info/export/template',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportMaterialFile(formData) {
  return httpInstance({
    url: 'system/material-info/export',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}

export function searchMaterial(params) {
  return httpInstance({
    url: 'system/material-info',
    method: 'get',
    params
  })
}

export function getPurchasedTemplate() {
  return httpInstance({
    url: 'system/material-info/import/purchased/template',
    method: 'get',
    responseType: 'blob'
  })
}
