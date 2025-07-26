import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export function getMaterialInfo(id) {
  return httpInstance({
    url: `/system/material-type`,
    params: { ids: id },
    method: 'get',
  })
}
export function newMaterialInfo(data) {
  return httpInstance({
    url: `system/material-type`,
    method: 'post',
    headers: headers,
    data: data,
    headers
  })
}

export function changeMaterialInfo(data) {
  return httpInstance({
    url: `system/material-type`,
    method: 'put',
    headers,
    data: data,
  })
}

export function downLoadModule() {
  return httpInstance({
    url: `system/material-type/export/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

export function deleteMaterialInfo(ids) {
  return httpInstance({
    url: `system/material-type/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listMaterialInfo(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/material-type/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}


export function exportSelectTable(data) {
  return httpInstance({
    url: `system/material-type/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}

export function importFile(formData) {
  return httpInstance({
    url: 'system/material-type/import',
    method: 'post',
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}
