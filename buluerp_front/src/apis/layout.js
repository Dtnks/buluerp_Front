import httpInstance from '@/utils/httpsInstance.js'
let headers = { Authorization: `${localStorage.getItem('Authorization')}` }
export async function GetMenuInfo() {
  let res = await httpInstance({
    url: `getInfo`,
    method: 'get',
    headers: headers,
  })
  let id = res.user.userId
  let menu = await httpInstance({
    url: '/system/menu/roleMenuTreeselect/' + id,
    method: 'get',
  })
  console.log(menu, 111)
  let data = menu.menus.filter((ele) => {
    if (ele.label == '前端菜单') {
      return ele
    }
  })
  return data
}
