import httpInstance from "@/utils/httpsInstance"

export function getMouldHouseList(pageNum, pageSize, query = {}) {
  return httpInstance({
    url: 'system/mould-house/list',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      ...query
    }
  })
}


export function createMouldHouse(data) {
  return httpInstance({
    url: 'system/mould-house',
    method: 'post',
    data, // 普通对象
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function deleteMouldHouse(ids) {
  var idsParam = Array.isArray(ids) ? ids.join(',') : ids
  return httpInstance({
    url: `system/mould-house/`,
    method: 'delete',
    params: { ids: idsParam },
  })
}

export function updateMouldHouse(data) {
  return httpInstance({
    url: 'system/mould-house',
    method: 'PUT',
    data: data
  })
}

export function getMouldHouseDetail(id) {
  return httpInstance({
    url: `system/mould-house/${id}`,
    method: 'get',
  })
}

export function importMouldHouseFile(formData) {
  return httpInstance({
    url: '/system/mould-house/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getMouldHouseTemplate() {
  return httpInstance({
    url: 'system/mould-house/export/template',
    method: 'get',
    responseType: 'blob'
  })
}

export function exportMouldHouse(ids) {
  // 如果 ids 是数组，转换成逗号分隔的字符串
  var idsParam = Array.isArray(ids) ? ids.join(',') : ids

  return httpInstance({
    url: 'system/mould-house/export',
    method: 'post',
    params: { ids: idsParam }, // 通过 query 参数传递
    responseType: 'blob'
  })
}


