import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }

export function getOptionselect() {
  return httpInstance({
    url: `system/role/list?pageNum=1&pageSize=100`,
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

export function getUserList(page, searchContent = { roleId: '', userName: '', nickName: '' }) {
  return httpInstance({
    url: `system/user/urlist?pageNum=${page}&pageSize=8&roleId=${searchContent.roleId}&userName=${searchContent.userName}&nickName=${searchContent.nickName}`,
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
    url: `system/user/authRole?userId=${data.userId}&roleIds=${data.roleIds.join('&roleIds=')}`,
    method: 'put',
    headers: headers,
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
