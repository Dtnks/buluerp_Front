import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
// export function getPostList() {
//   console.log(headers)
//   return httpInstance({
//     url: `system/post/optionselect`,
//     method: 'get',
//     headers: headers,
//   })
// }

// export function getRoleList() {
//   return httpInstance({
//     url: `system/role/optionselect`,
//     method: 'get',
//     headers: headers,
//   })
// }

export function getOptionselect() {
  return httpInstance({
    url: `system/role/list`,
    method: 'get',
    headers: headers,
  })
}

export function newUser(data) {
  return httpInstance({
    url: `system/user`,
    method: 'post',
    headers: headers,
    data: data,
  })
}

export function getUserList(page) {
  return httpInstance({
    url: `system/user/list?pageNum=${page}&pageSize=8`,
    method: 'get',
    headers: headers,
  })
}
