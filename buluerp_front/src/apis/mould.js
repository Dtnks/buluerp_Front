import httpInstance from "@/utils/httpsInstance"

export function getMouldList(params) {
  return httpInstance({
    url: 'system/mould/list',
    method: 'get',
    params
  })
}

export function createMould(formData) {
  return httpInstance({
    url: 'system/mould',
    method: 'post',
    data: formData,
        headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function deleteMould(ids) {
  var idsParam = Array.isArray(ids) ? ids.join(',') : ids
  return httpInstance({
    url: `system/mould/`,
    method: 'delete',
    params: { ids: idsParam },
  })
}

export function updateMould(data) {
  return httpInstance({
    url: 'system/mould',
    method: 'PUT',
    data: data
  })
}

export function getMouldDetail(id) {
  return httpInstance({
    url: `system/mould/${id}`,
    method: 'get',
  })
}

export function importMouldFile(formData) {
  return httpInstance({
    url: '/system/mould/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getMouldTemplate() {
  return httpInstance({
    url: 'system/mould/export/template',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportMould(ids) {
  // 如果 ids 是数组，转换成逗号分隔的字符串
  var idsParam = Array.isArray(ids) ? ids.join(',') : ids

  return httpInstance({
    url: 'system/mould/export',
    method: 'post',
    params: { ids: idsParam }, // 通过 query 参数传递
    responseType: 'blob'
  })
}


