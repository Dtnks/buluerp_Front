import httpInstance from '@/utils/httpInstance'
export function getUnCheckArticleList() {
  return httpInstance({
    url: `dev-api/test/user/list`,
    method: 'get',
    headers: headers,
  })
}
