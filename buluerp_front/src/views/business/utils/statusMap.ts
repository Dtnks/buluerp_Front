import { getOrderStatusMap } from '@/apis/orders'
import { ref, type Ref } from 'vue'

export const newStatusMap = ref<{ [key: number]: string }>({})

const getStatusMap = async () => {
  const response = await getOrderStatusMap()

  // 翻转键值
  const reversedMap = Object.entries(response.data).reduce((acc, [key, value]) => {
    acc[Number(value)] = key
    return acc
  }, {} as { [key: string]: number })
  
  return () => {
    return reversedMap
  }
}
const resMap =( await getStatusMap())()

export {resMap}



/**
 * 根据状态值获取状态文字
 * @param status 状态值
 * @returns 状态文字
 */
export const getStatusText = (status: Status): string => {
  return statusTextMap[status] || '未知状态'
}

// export interface StatusMap {
//   [key: string]: string
// }

/**
 * 获取订单状态映射
 * @returns Promise<StatusMap>
 */
