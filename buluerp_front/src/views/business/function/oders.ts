import { getOrdersList, getOrderDetailById, postOrder, putOrder, getOrderProducts } from '@/apis/orders'
import { getPackingListById } from '@/apis/packing'
import { detailCustomer } from '@/apis/custom'
import { messageBox } from '@/components/message/messageBox'

// getCustomerNameById: 根据订单ID获取客户姓名
export const getCustomerNameById = async (id: number) => {
  try {
    const res = await detailCustomer(id)
    // console.log('获取客户姓名res.data：', res.data);
    return res.data.name
  } catch (err) {
    console.log('获取客户姓名失败：', err)
  }
}

// getOrderDetail: 获取订单详情
export const getOrderDetail = async (id: number) => {
  try {
    const res = await getOrderDetailById(id)
    console.log('获取订单详情：', res.data)
    return res.data
  } catch (err) {
    console.log('获取订单详情失败：', err)
  }
}

// addOrder: 添加订单
export const addOrder = async (data: any) => {
  try {
    const res = await postOrder(data)
    if (res.code === 200) {
      console.log('添加订单成功：', res)
      return res
    }else {
      console.log('添加订单失败：', res)
      messageBox({
        type: 'error',
        message: res.message || '添加订单失败，请稍后再试！'
      })
    }
  } catch (err) {
    console.log('添加订单失败：', err)
  }
}

// searchOrders: 查询订单
export const searchOrders = async (params: any) => {
  try {
    const res = await getOrdersList(params)
    console.log('查询订单：', res)
    return res
  } catch (err) {
    console.log('查询订单失败：', err)
  }
}

// getProductsByOrderId: 根据订单ID获取产品列表
export const getProductsByOrderId = async (id: number) => {
  try {
    const res = await getOrderProducts(id)
    console.log('获取产品列表：', res)
    return res
  } catch (err) {
    console.log('获取产品列表失败：', err)
  }
}


// getPackingListByOrderId: 根据订单ID获取分包表
export const getPackingListByOrderId = async (id: number) => {
  try {
    const res = await getPackingListById(id)
    console.log('获取分包表：', res)
    return res
  } catch (err) {
    console.log('获取分包表失败：', err)
    messageBox({
      type: 'error',
      message: '获取分包表失败，请稍后再试！'
    })

  }
}
// todo: id是订单id还是分包表id？
// getPackingListDetailById: 根据分包表ID获取分包表详情
