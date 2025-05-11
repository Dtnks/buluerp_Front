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
        <!-- <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="innerId" label="订单ID" />
        <el-table-column prop="customerName" label="客户姓名" />
        <el-table-column prop="orderStatus" label="订单状态">
          <template #default="{ row }">
            <span :style="{ color: getStatusColor(row.orderStatus) }">●</span>
            {{ row.orderStatus }}
          </template>
        </el-table-column>
        <el-table-column prop="information" label="其他基本信息" /> -->
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
          <template v-if="column.slot" #default="{ row }">
            <span style="display: flex; align-items: center;">
              <span :style="{
                backgroundColor: getStatusColor(row[column.prop]), display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', margin: '0 5px 0 0', border: '1px solid #ccc'

              }"></span>
              <!-- {{ row[column.prop] }} -->
              {{ getStatusText(row[column.prop]) }}
            </span>

          </template>
        </el-table-column>
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

              <!-- 编辑弹窗 -->
      <el-dialog title="编辑订单" v-model="editDialogVisible" width="500px">
        <el-form :model="editForm" label-width="100px">
          <el-form-item label="订单ID">
            <el-input v-model="editForm.innerId" disabled />
          </el-form-item>
          <el-form-item label="客户姓名">
            <el-input v-model="editForm.customerName" />
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="editForm.status" placeholder="请选择">
              <el-option label="初始状态" :value="0" />
              <el-option label="设计中" :value="1" />
              <el-option label="已完成" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="其他信息">
            <el-input v-model="editForm.information" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onSaveEdit">保存</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from 'vue';
import { ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { getOrdersList } from '@/apis/orders'
// import request from '@/utils/request';
// import { createIncrementalCompilerHost } from 'typescript';
import type { TableDataType } from '@/types/orderResponse';
import BusinessDetail from '@/views/business/main/Detail.vue';

onMounted(() => {
  getOrders();
})

// defineProps({ addTab: Function });
defineProps<{
  addTab: (tab: { title: string; name: string; component: any; data?: any }) => void;
}>();

const tableData = ref<TableDataType[]>([]);

const columns = [
  { prop: 'createTime', label: '创建时间' },
  { prop: 'innerId', label: '订单ID' },
  { prop: 'customerName', label: '客户姓名' },
  {
    prop: 'status',
    label: '订单状态',
    slot: 'statusSlot', // 自定义渲染的插槽名称
  },
  { prop: 'information', label: '其他基本信息' },
];

// // 表格数据
// interface DataType {
//   key: number;
//   createTime: string;
//   orderId: string;
//   customerName: string;
//   orderStatus: string;
//   information: string;
// }

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

// 表格操作--start
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
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '初始状态';
    case 1:
      return '设计中';
  }
};

// const onEdit = (row: TableDataType) => {
//   console.log('编辑：', row);
// };

const onCheck = (row: TableDataType) => {
  console.log('查看：', row);
};

const onDerive = (row: TableDataType) => {
  console.log('导出：', row);
};

// // 编辑弹窗
// 编辑弹窗的显示状态
const editDialogVisible = ref(false);

// 编辑表单数据
const editForm = reactive({
  innerId: '',
  customerName: '',
  status: 0,
  information: '',
  createTime: '',
  // id: 0,
});

// 点击“编辑”按钮时触发
const onEdit = (row: TableDataType) => {
  // 将选中的行数据复制到编辑表单中
  editForm.innerId = row.innerId;
  // editForm.customerName = row.customerName;
  editForm.status = row.status;
  // editForm.information = row.information;
  editForm.createTime = row.createTime;
  // editForm.id = row.id;


  // 打开编辑弹窗
  editDialogVisible.value = true;
};

// 保存编辑后的数据
const onSaveEdit = () => {
  // 在 tableData 中找到对应的行并更新数据
  const index = tableData.value.findIndex((item) => item.innerId === editForm.innerId);
  if (index !== -1) {
    tableData.value[index] = { ...editForm };
  }

  // 关闭弹窗
  editDialogVisible.value = false;
  console.log('保存后的数据：', tableData.value);
};

//  //表格分页
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: tableData.value.length,

});

const paginatiedtableData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return tableData.value.slice(start, end);
});

const onPageChange = (page: number) => {
  pagination.current = page;
};

const onShowSizeChange = (size: number) => {
  pagination.pageSize = size;
};
// 表格操作--end
</script>

<style scoped></style>
