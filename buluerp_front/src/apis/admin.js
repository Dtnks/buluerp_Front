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

export function getRoleList() {
  return httpInstance({
    url: `system/role/optionselect`,
    method: 'get',
    headers: headers,
  })
}
