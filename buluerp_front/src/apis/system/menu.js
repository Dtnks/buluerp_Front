import httpInstance from '@/utils/httpsInstance.js'
// 查询菜单列表
export function listMenu(query) {
  return httpInstance({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return httpInstance({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return httpInstance({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return httpInstance({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return httpInstance({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return httpInstance({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return httpInstance({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}