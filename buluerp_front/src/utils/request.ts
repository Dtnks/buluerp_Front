import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/', // 基础 URL
  // baseURL: 'http://154.201.77.135:8080/', // 基础 URL
  timeout: 8000, // 超时时间
})
 
// 请求拦截器
request.interceptors.request.use(
  (config) => {
    console.log(config.baseURL,'config.baseURL');
    console.log(config.url,'config.url');
    console.log(config,'config');



    const Authorization = localStorage.getItem('Authorization') // 获取 Authorization
    if (Authorization) {
      config.headers.Authorization = `Bearer ${Authorization}` // 设置请求头
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      console.error(`响应错误：状态码 ${status}`, data)

      // 根据状态码显示错误提示
      if (status === 401) {
        ElMessage.error('未授权，请重新登录')
      } else if (status === 500) {
        ElMessage.error('服务器内部错误')
      } else {
        ElMessage.error(data.message || '请求失败')
      }
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试')
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }

    return Promise.reject(error)
  },
)

export default request
