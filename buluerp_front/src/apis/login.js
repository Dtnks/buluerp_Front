import httpInstance from '@/utils/httpsInstance.js'
export function Login(data) {
  return httpInstance({
    url: `login`,
    method: 'post',
    data: data,
  })
}
