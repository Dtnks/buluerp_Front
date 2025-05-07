import httpInstance from '@/utils/httpsInstance.js'
let headers={token:localStorage.getItem('token')}
export function getUnCheckArticleList() {
  return httpInstance({
    url: `dev-api/test/user/list`,
    method: 'get',
    headers: headers,
  })
}
