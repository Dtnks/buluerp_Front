import { defineStore } from 'pinia';
import type { TableDataType } from '@/types/orderResponse';
import { ref } from 'vue';
import { getCustomerNameById,  } from '../views/business/apis/oders';
import { getOrdersList, putOrder } from '@/apis/orders';

export const useQueryTableDataStore = defineStore('table', () => {
  // 数据
  const tableData = ref<TableDataType[]>([]);

  // getOders: 获取订单数据(包括客户姓名)
const getOrders = async () => {
  try {
    const res = await getOrdersList()
    console.log('获取订单数据：', res);
    tableData.value = res.rows;
    // // 设置分页数据总数量
    // pagination.total = res.total;
    for (let i = 0; i < res.rows.length; i++) {
      const customerName = await getCustomerNameById(res.rows[i].id);
      // console.log('获取客户姓名：', customerName);
      tableData.value[i].customerName = customerName;
    }
  }
  catch (err) {
    console.log('获取订单数据失败：', err);
  }
}

// addTableData: 添加订单数据
const addTableData =  (newData: TableDataType) => {
  try {

    console.log('添加订单数据--pinia：', newData);
    tableData.value.push(newData);
    // // 设置分页数据总数量
    // pagination.total = res.total;

  }
  catch (err) {
    console.log('添加订单数据失败：', err);
  }
}

// editTableData: 编辑订单数据
const editTableData = async (aditData: TableDataType) => {
  try {
    const res = await putOrder(aditData)
    if (res.code === 200) {
    console.log('编辑订单数据--pinia：', res);

    // 更新
    const index = tableData.value.findIndex(item => item.innerId === aditData.innerId);
    if (index !== -1) {
      tableData.value[index] = { ...tableData.value[index], ...aditData };
    } else {
      console.log('未找到要更新的订单数据');
    }
    // // 设置分页数据总数量
    // pagination.total = res.total;

  } else {
    console.log('编辑订单数据失败：', res);
  }
} catch (err) {
    console.log('编辑订单数据失败：', err);

}
}



  return { tableData, getOrders, addTableData, editTableData };
})

