import { getOrdersList, getOrderDetailById, postOrder, getOrderProducts } from '@/apis/orders'
// import { getPackagingListById } from '@/apis/packaging'
import { detailCustomer } from '@/apis/custom'
import { messageBox } from '@/components/message/messageBox'
import { getProductDetail } from '@/apis/products'

// viewOrdersList: 查询订单列表

// getCustomerNameById: 根据订单ID获取客户姓名
export const getCustomerNameById = async (id: number) => {
  const res = await detailCustomer(id)
  return res.data.name
}

// getOderProducts: 获取订单产品列表
export const getOderProducts = async (id: number) => {
  const res = await getOrdersList({ id: id })
  return res
}

// getOrderDetail: 获取订单详情
export const getOrderDetail = async (id: number) => {
  const res = await getOrderDetailById(id)
  return res.data
}

export const getProductsByOrderId = async (id: number) => {
  const res = await getOrderProducts(id)
  return res
}
// addOrder: 添加订单
export const addOrder = async (data: any) => {
  const res = await postOrder(data)
  return res
}

// searchOrders: 查询订单
export const searchOrders = async (params: any) => {
  const res = await getOrdersList(params)
  messageBox({
    type: 'success',
    message: '查询订单成功！',
  })
  return res
}

// getProductDetilById: 根据产品ID获取产品详情
export const getProductDetailById = async (id: number) => {
  const res = await getProductDetail(id)
  return res
}
