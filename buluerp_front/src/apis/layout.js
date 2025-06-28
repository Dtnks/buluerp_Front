import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export async function GetMenuInfo() {
  let res = await GetUserInfo()
  let id = res.user.roles[0].roleId
  let menu = await httpInstance({
    url: '/system/menu/roleMenuTreeselect/' + id,
    method: 'get',
  })
  console.log(menu, 'menu')
  let data = menu.menus.filter((ele) => {
    if (ele.label == '前端菜单') {
      return ele
    }
  })
  return data
}
export async function GetUserInfo() {
  let res = await httpInstance({
    url: `getInfo`,
    method: 'get',
    headers: headers,
  })
  return res
}

export async function GetMessage() {
  let res = await httpInstance({
    url: `/system/notification/unread`,
    method: 'get',
    headers: headers,
  })
  return res
}
