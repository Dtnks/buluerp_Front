export interface TableDataType {
  createTime: string;
  id?: number;
  innerId: string;
  status: number;
  customer: string;
  remark?: string;
}

export interface OrderResponse {
  code: number;
  message: string;
  rows: TableDataType[];
  total: number;
}

