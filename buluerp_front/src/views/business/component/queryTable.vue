<template>
  <div>
    <!-- 表格 -->
    <el-card shadow="never" style="margin-top: 10px" class="table-container">
      <template #header>
        <div>
          <span>列表</span>
        </div>
      </template>
      <el-table :data="paginatiedtableData" border>
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
import { getOrdersList } from '@/apis/orders';
// import request from '@/utils/request';
// import { createIncrementalCompilerHost } from 'typescript';
import type { TableDataType } from '@/types/orderResponse';
import BusinessDetail from '@/views/business/main/Detail.vue';
import { getCustomerNameById } from '../apis/oders';
import { useQueryTableDataStore } from '@/stores/queryTableData';

// 加载数据
onMounted(() => {
  // getOrders();
  tableDataStore.getOrders();

})

const props = defineProps<{
  queryParams: Record<string, any>;
  addTab: (targetName: string, component: any, data?: any) => void;
}>();

// const tableData = ref<TableDataType[]>([]);

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

// // getOders: 获取订单数据(不包括客户姓名)
// const getOrders = async () => {
//   try {
//     const res = await getOrdersList()
//     console.log('获取订单数据：', res);
//     tableData.value = res.rows;
//     // 设置分页数据总数量
//     pagination.total = res.total;
//     for (let i = 0; i < res.rows.length; i++) {
//       const customerName = await getCustomerNameById(res.rows[i].id);
//       // console.log('获取客户姓名：', customerName);
//       tableData.value[i].customerName = customerName;
//     }

//   }
//   catch (err) {
//     console.log('获取订单数据失败：', err);
//   }
// }

const tableDataStore = useQueryTableDataStore();
// 获取表格数据
const tableData = computed(() => tableDataStore.tableData);




// 表格操作--start
const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return 'grey';
    case 1:
      return 'blue';
    case 2:
      return 'green';
    case 3:
      return 'red';
    case 4:
      return 'orange';
    default:
      return 'grey';
  }
};
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '初始状态';
    case 1:
      return '设计中';
    case 2:
      return '已完成';
    case 3:
      return '作废';
    case 4:
      return '布产中';
  }
};

// onCheck: 点击查看按钮, 查看订单详情
const onCheck = (row: TableDataType) => {
  console.log('查看：', row);
  // getOderDetail(row.id).then(res => {
  //   console.log('查看订单详情：', res);
  // })
  props.addTab(`订单详情 ${row.innerId}`, BusinessDetail, {
    id: row.id,
    innerId: row.innerId,
    customerName: row.customerName,
    status: row.status,
    // information: row.information,
    createTime: row.createTime,
  })
};

const onDerive = (row: TableDataType) => {
  console.log('导出：', row);
};

// // 编辑弹窗 ---start
// 编辑弹窗的显示状态
const editDialogVisible = ref(false);

// 编辑表单数据
const editForm = reactive({
  innerId: '',
  customerName: '',
  status: 0,
  information: '',
  createTime: '',
  quantity: 0, // 默认数量
  customer_id: '', // 默认客户ID
  product_id: '', // 默认产品ID
  id: 0, // 默认ID
});

// 点击“编辑”按钮时触发
const onEdit = (row: TableDataType) => {
  // 将选中的行数据复制到编辑表单中
  editForm.innerId = row.innerId;
  editForm.customerName = row.customerName;
  editForm.status = row.status;
  // editForm.information = row.information;
  editForm.createTime = row.createTime;
  editForm.id = row.id ||0;

  editDialogVisible.value = true;
};

// 保存编辑后的数据
const onSaveEdit = async () => {
  try {
    await tableDataStore.editTableData({ ...editForm });
    editDialogVisible.value = false;
    console.log('保存后的数据：', tableData.value);
  } catch (error) {
    console.error('保存数据失败：', error);
  }
};
// // 编辑弹窗 ---end

// //表格分页
const pagination = reactive({
  current: 1,
  pageSize: 5,
  total: computed(() => tableData.value.length),
  // pageSizes: [5, 10, 20, 50],
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
