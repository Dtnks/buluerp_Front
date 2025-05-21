import { getOrdersList, getOrderDetailById } from '@/apis/orders'
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
