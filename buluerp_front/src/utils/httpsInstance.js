import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const httpInstance = axios.create({
  baseURL: 'http://154.201.77.135:8080/',
  timeout: 5000,
})

httpInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器：统一处理错误、鉴权失败等
httpInstance.interceptors.response.use(
  res => {
    if (res.data.code === 200) {
      return res.data
    } else {
      ElMessage.error(res.data.message || '请求失败')
      return Promise.reject(res.data)
    }
  },
  err => {
    if (err.response?.status === 401) {
      ElMessage.error('认证失败，请重新登录')
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      ElMessage.error(err.response?.data?.message || '服务异常')
    }
    return Promise.reject(err)
  }
)

export default httpInstance
