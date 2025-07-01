import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export function newPackaging(data) {
  return httpInstance({
    url: `system/packaging-bag`,
    method: 'post',
    headers: headers,
    data: data,
    headers,
  })
}

export function changePackaging(data) {
  return httpInstance({
    url: `system/packaging-bag`,
    method: 'put',
    headers,
    data: data,
  })
}

export function deletePackaging(id) {
  return httpInstance({
    url: `system/packaging-bag/${id}`,
    method: 'delete',
    headers: headers,
  })
}

export function getBagList(id) {
  return httpInstance({
    url: `system/packaging-bag/list?packagingListId=${id}`,
    method: 'get',
    headers: headers,
  })
}
