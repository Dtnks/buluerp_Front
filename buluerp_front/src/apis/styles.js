import httpInstance from "@/utils/httpsInstance.js"

export function getStyleList(params) {
  return httpInstance({
    url: 'system/style/list',
    method: 'get',
    params
  })
}

export function addStyle(data) {
  return httpInstance({
    url: 'system/style',
    method: 'post',
    data
  })
}

export function updateStyle(data) {
  return httpInstance({
    url: 'system/style',
    method: 'PUT',
    data: data
  })
}

export function deleteStyle(ids) {
  const idStr = Array.isArray(ids) ? ids.join(',') : ids
  return httpInstance({
    url: `system/style/${idStr}`,
    method: 'delete'
  })
}

export function importStyleFile(formData) {
  return httpInstance({
    url: '/system/style/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getStyleTemplate() {
  return httpInstance({
    url: 'system/style/template',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportStyleFile(ids) {
  return httpInstance({
    url: `/system/style/export/${ids}`,
    method: 'post',
    responseType: 'blob'
  })
}


export function searchStyle(params) {
  return httpInstance({
    url: 'system/style',
    method: 'get',
    params
  })
}
