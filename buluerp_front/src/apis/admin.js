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

export function getUserList(
  page,
  searchContent = { roleNames: null, userName: '', nickName: '', status: '' },
) {
  return httpInstance({
    url: `system/user/urlist?pageNum=${page}&pageSize=8&roleId=${searchContent.roleId}&userName=${searchContent.userName}&nickName=${searchContent.nickName}&status=${searchContent.status}`,
    method: 'get',
    headers: headers,
  })
}

export function changeStatus(data) {
  return httpInstance({
    url: `system/user/changeStatus`,
    method: 'put',
    headers: headers,
    data: data,
  })
}

export function changeRoles(data) {
  return httpInstance({
    url: `system/user/authRole`,
    method: 'put',
    headers: headers,
    data: data,
  })
}

export function resetPassword(data) {
  return httpInstance({
    url: `system/user/resetPwd`,
    method: 'put',
    headers: headers,
    data: data,
  })
}

export function getUser(id) {
  return httpInstance({
    url: `system/user/${id}`,
    method: 'get',
    headers: headers,
  })
}
