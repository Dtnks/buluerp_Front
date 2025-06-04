import { Status, getStatusText } from "@/views/business/utils/statusMap"
export interface TableDataType {
  createTime?: string
  id: number | null
  innerId?: string
  status: Status
  customerName?: string
  remark?: string
}

export interface OrderResponse {
  code: number
  message: string
  rows: TableDataType[]
  total: number
}
