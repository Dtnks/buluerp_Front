import { getOrderStatusMap } from '@/apis/orders'
import { ref, type Ref } from 'vue'

export const newStatusMap = ref<{ [key: number]: string }>({})
export const fetchOrderStatusMap = async (): Promise<{ [key: number]: string } | undefined> => {
  try {
    const response = await getOrderStatusMap()
    if (response.code === 200) {
      console.log('Order status map fetched successfully:', response.data)
      const statusMap: { [key: number]: string } = {}
      for (const [key, value] of Object.entries(response.data)) {
        // statusMap[value as string] = Number(key)
        // console.log(` 11111111 Mapping status "${value}" to code ${key}`)
        // statusMap[key] = Number(value)
        statusMap[value as number] = key
        // console.log(` 22222222 Mapping code "${key}" to status ${value}`)
      }
      console.log('Status map:', statusMap)
      console.log('statusMap[1] =', statusMap[1])
      newStatusMap.value = statusMap
      console.log('New status map:', newStatusMap.value)

      return statusMap
    }
  } catch (error) {
    console.error('Error fetching order status map:', error)
  }
}

export enum Status {
  Initial = 0, // 创建(未审核)
  ApprovedFalse = -1, // 审核未通过
  PendingDesign = 1, // 待设计
  Designing = 2, // 设计中
  Completed = 3, // 已完成
  Canceled = 4, // 作废
  Producing = 5, // 布产中
}

// 创建一个对象来映射枚举值和文字描述
export const statusTextMap: { [key in Status]: string } = {
  [Status.Initial]: '创建(未审核)',
  [Status.ApprovedFalse]: '审核未通过',
  [Status.PendingDesign]: '待设计',
  [Status.Designing]: '设计中',
  [Status.Completed]: '已完成',
  [Status.Canceled]: '作废',
  [Status.Producing]: '布产中',
}

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
