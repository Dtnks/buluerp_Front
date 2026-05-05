import httpInstance from "@/utils/httpsInstance.js"

export function getDesignList(params) {
  return httpInstance({
    url: 'system/patterns/list',
    method: 'get',
    params
  })
}

export function addDesign(data) {
  return httpInstance({
    url: 'system/patterns',
    method: 'post',
    data
  })
}

export function updateDesign(data) {
  return httpInstance({
    url: 'system/patterns',
    method: 'PUT',
    data: data
  })
}

export function deleteDesign(ids) {
  const idStr = Array.isArray(ids) ? ids.join(',') : ids
  return httpInstance({
    url: `system/patterns/${idStr}`,
    method: 'delete'
  })
}

export function importDesignFile(formData) {
  return httpInstance({
    url: '/system/patterns/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getDesignTemplate() {
  return httpInstance({
    url: 'system/patterns/template',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportDesignFile(ids) {
  return httpInstance({
    url: `system/patterns/export/${ids}`,
    method: 'post',
    responseType: 'blob'
  })
}

export function searchDesign(params) {
  return httpInstance({
    url: 'system/patterns',
    method: 'get',
    params
  })
}

export function searchDesignDetail(id){
    return httpInstance({
        url: `system/patterns/${id}`,
        method: 'get',
    })
}

export function pmcConfirm(id){
    return httpInstance({
        url: `system/patterns/${id}`,
        method: 'put',
    })
}

export function pmcCancel(id){
    return httpInstance({
        url: `system/patterns/cancel/${id}`,
        method: 'put',
    })
}
