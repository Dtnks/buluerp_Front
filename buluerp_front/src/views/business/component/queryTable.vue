<template>
  <div>
    <!-- 表格 -->
    <el-card shadow="never" style="margin-top: 10px" class="table-container">
      <template #header>
        <div>
          <span>列表</span>
        </div>
      </template>
      <el-table :data="tableData" border>
        <!-- todo -->
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="orderId" label="订单ID" />
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="orderStatus" label="订单状态">
          <template #default="{ row }">
            <span :style="{ color: getStatusColor(row.orderStatus) }">●</span>
            {{ row.orderStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="information" label="其他基本信息" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button link type="primary" @click="onEdit(row)">编辑</el-button>
            <el-button link type="primary" @click="onCheck(row)">查看</el-button>
            <el-button link type="primary" @click="onDerive(row)">导出</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next, sizes, total" :total="pagination.total"
        :page-size="pagination.pageSize" :current-page="pagination.current" @size-change="onShowSizeChange"
        @current-change="onPageChange" :page-sizes="[5, 10, 20, 50]" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue';
import { ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { getOrdersList } from '@/apis/orders'
import request from '@/utils/request';
import { createIncrementalCompilerHost } from 'typescript';

onMounted(() => {
  getOrders();
})

defineProps({ addTab: Function });

const tableData = ref([]);

// const columns = [
//   { prop: 'createTime', label: '创建时间' },
//   { prop: 'orderId', label: '订单ID' },
//   { prop: 'customerName', label: '客户姓名' },
//   { prop: 'orderStatus', label: '订单状态' },
//   { prop: 'information', label: '其他基本信息' },
// ];

// 表格数据
interface DataType {
  key: number;
  createTime: string;
  orderId: string;
  customerName: string;
  orderStatus: string;
  information: string;
}

// const data: DataType[] = [];
// for (let i = 0; i < 40; i++) {
//   data.push({
//     key: i,
//     createTime: Date.now().toString(),
//     orderId: '3249hg284b14',
//     customerName: `John Brown ${i}`,
//     orderStatus: '初始状态',
//     information: `London, Park Lane no. ${i}`,
//   });
// }

const getOrders = async () => {
  try {
    const res = await getOrdersList()
    console.log('获取订单数据：', res);
    tableData.value = res.rows;
  }
  catch (err) {
    console.log('获取订单数据失败：', err);
  }
}

// 表格操作
const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return 'grey';
    case 1:
      return 'blue';
    // case '已完成':
    //   return 'green';
    // case '作废':
    //   return 'red';
    // case '布产中':
    //   return 'orange';
    // default:
    //   return 'black';
  }
};

const onEdit = (row: DataType) => {
  console.log('编辑：', row);
};

const onCheck = (row: DataType) => {
  console.log('查看：', row);
};

const onDerive = (row: DataType) => {
  console.log('导出：', row);
};

// 表格分页
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: tableData.length,
});

const paginatiedtableData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return tableData.slice(start, end);
});

const onPageChange = (page: number) => {
  pagination.current = page;
};

const onShowSizeChange = (size: number) => {
  pagination.pageSize = size;
};
</script>

<style scoped></style>
