import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export function listScheduleByOrderCode(orderCode) {
  let searchText=`system/products-schedule/list?orderCode=${orderCode}`
  return function(pageNum, pageSize, searchContent = {}){
    let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
    return httpInstance({
    url: `${searchText}&pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
  }
  
}


export function getProductionScheduleById(id) {
  return httpInstance({
    url: `system/products-schedule/list?ids=${id}`,
    method: 'get',
    headers: headers,
  })
}
export function finishSchedule(data) {
  return httpInstance({
    url: `system/products-schedule/mark-all-done`,
    method: 'post',
    headers: headers,
    data: data,
  })
}
export function getScheduleListByOrderId(orderId) {
  return httpInstance({
    url: `system/products-schedule/list?orderCode=${orderId}`,
    method: 'get',
    headers: headers,
  })
}

export function newSchedule(data) {
  return httpInstance({
    url: `system/products-schedule/from-material`,
    method: 'post',
    headers: headers,
    data: data,
  })
}

export function changeSchedule(data) {
  return httpInstance({
    url: `system/products-schedule`,
    method: 'put',
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  })
}

export function downLoadModule() {
  return httpInstance({
    url: `system/products-schedule/export/template`,
    method: 'get',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
  })
}

export function deleteSchedule(ids) {
  return httpInstance({
    url: `system/products-schedule/${ids.join(',')}`,
    method: 'delete',
    headers: headers,
  })
}

export function listSchedule(pageNum, pageSize, searchContent = {}) {
  let concatText = Object.keys(searchContent)
    .map((key) => {
      return `&${key}=${searchContent[key]}`
    })
    .join('')
  return httpInstance({
    url: `system/products-schedule/list?orderByColumn=orderCode&pageNum=${pageNum}&pageSize=${pageSize}${concatText}`,
    method: 'get',
    headers: headers,
  })
}
export function exportSelectTable(data) {
  return httpInstance({
    url: `system/products-schedule/export`,
    method: 'post',
    headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    data: data,
  })
}

export function importFile(formData) {
  return httpInstance({
    url: 'system/products-schedule/import',
    method: 'post',
    data: formData,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function selectTransToArrange(data) {
  console.log(data)
  return httpInstance({
    url: `system/production-arrange/from-schedule`,
    method: 'post',
    data,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}
