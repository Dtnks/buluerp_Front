import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export function getLog(id) {
  return httpInstance({
    url: `/system/operation-log`,
    params: { ids: id },
    method: 'get',
  })
}

export function deleteLog(ids) {
  return httpInstance({
    url: `system/operation-log/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listLog(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/operation-log/list?pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}

export function exportSelectTable(data) {
  return httpInstance({
    url: `system/operation-log/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}
