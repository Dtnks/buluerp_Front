import axios from 'axios'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import router from '@/router'
import { tansParams, blobValidate } from '@/utils/ruoyi'
const httpInstance = axios.create({
  baseURL: 'http://154.201.77.135:8080/',
  timeout: 5000,
})

let downloadLoadingInstance

httpInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('Authorization')
    // if (token) {
    //   config.headers.Authorization = token
    // }
    const Authorization = localStorage.getItem('Authorization')
    if (Authorization) {
      config.headers.Authorization = `Bearer ${Authorization}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一处理错误、鉴权失败等
httpInstance.interceptors.response.use(
  (res) => {
    if (res.data.code === 200 || res.status === 200) {
      return res.data
    } else {
      ElMessage.error(res.data.message || '请求失败')
      return Promise.reject(res.data)
    }
  },
  (err) => {
    if (err.response?.status === 401) {
      ElMessageBox.confirm(warningText, '操作确认提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        router.push('/login')
        localStorage.removeItem('Authorization')
      })
    } else {
      ElMessage.error(err.response?.data?.message || '服务异常')
    }
    return Promise.reject(err)
  },
)

export default httpInstance

export function download(url, params, filename, config) {
  downloadLoadingInstance = ElLoading.service({
    text: '正在下载数据，请稍候',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  return httpInstance
    .post(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params)
        },
      ],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
      ...config,
    })
    .then(async (data) => {
      const isLogin = await blobValidate(data)
      if (isLogin) {
        const blob = new Blob([data])
        saveAs(blob, filename)
      } else {
        const resText = await data.text()
        const rspObj = JSON.parse(resText)
        const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
        ElMessage.error(errMsg)
      }
      downloadLoadingInstance.close()
    })
    .catch((r) => {
      console.error(r)
      ElMessage.error('下载文件出现错误，请联系管理员！')
      downloadLoadingInstance.close()
    })
}
