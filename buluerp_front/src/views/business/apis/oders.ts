import { getOrdersList, getOrderDetailById, postOrder, putOrder } from '@/apis/orders'
import { detailCustomer } from '@/apis/custom'

// getCustomerNameById: 根据订单ID获取客户姓名
export const getCustomerNameById = async (id: number) => {
  try {
    const res = await detailCustomer(id)
    // console.log('获取客户姓名res.data：', res.data);
    return res.data.name;
  } catch (err) {
    console.log('获取客户姓名失败：', err);
  }
}


// getOrderDetail: 获取订单详情
export const getOrderDetail = async (id: number) => {
  try {
    const res = await getOrderDetailById(id)
    console.log('获取订单详情：', res.data);

  }
  catch (err) {

    console.log('获取订单详情失败：', err);

  }
}


// addOrder: 添加订单
export const addOrder = async (data: any) => {
  try {
    const res = await postOrder(data)
    if (res.code === 200) {
      console.log('添加订单成功：', res);
      return res;
    }
  } catch (err) {
    console.log('添加订单失败：', err);
  }
}

// searchOrders: 查询订单
export const searchOrders = async (params: any) => {
  try {
    const res = await getOrdersList(params)
    console.log('查询订单：', res);
    return res;
  } catch (err) {
    console.log('查询订单失败：', err);
  }
}

