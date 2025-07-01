import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export function newPackaging(data) {
  return httpInstance({
    url: `system/packaging-detail`,
    method: 'post',
    headers: headers,
    data: data,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function changePackaging(data) {
  return httpInstance({
    url: `system/packaging-detail`,
    method: 'put',
    data,
    headers: {
      ...headers,
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function deletePackaging(ids) {
  return httpInstance({
    url: `system/packaging-detail/${ids}`,
    method: 'delete',
    headers: headers,
  })
}

export function getBagList(id) {
  return httpInstance({
    url: `system/packaging-detail/list?packagingBagId=${id}`,
    method: 'get',
    headers: headers,
  })
}
