export interface TableDataType {
  createTime?: string
  id: number | null
  innerId?: string
  status: number | null
  customerName?: string
  remark?: string
}

export interface OrderResponse {
  code: number
  message: string
  rows: TableDataType[]
  total: number
}
