<template>
  <!-- 表格 -->
  <el-card shadow="never" style="margin: 0px 20px">
    <template #header>
       <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>列表</span>
          <div>
          <el-button type="danger" @click="onDelete">删除</el-button>
          <el-button type="primary" @click="onExport">导出</el-button>
        </div>
      </div>
    </template>
    <el-table :data="props.tableData" border @selection-change="handleSelectionChange" >
      <el-table-column type="selection"  />
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
      >
        <template v-if="column.slot" #default="{ row }">
          <span style="display: flex; align-items: center">
            <span
              :style="{
                backgroundColor: getStatusColor(row[column.prop]),
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                margin: '0 5px 0 0',
                border: '1px solid #ccc',
              }"
            ></span>
            <!-- {{ row[column.prop] }} -->
            {{ getStatusText(row[column.prop]) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="onEdit(row)">编辑</el-button>
          <el-button link type="primary" @click="onCheck(row)">查看</el-button>
          <!-- <el-button link type="primary" @click="onDerive(row)">导出</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next, sizes, total"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.page"
      @size-change="emit('onPageChange', $event)"
      @current-change="emit('onPageChange', $event)"
      :page-sizes="[5, 10, 20, 50]"
    />

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
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref, watch } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElPagination, ElDialog, ElForm, ElFormItem, ElSelect, ElOption, ElInput, ElMessage, ElMessageBox } from 'element-plus'
import { getOrdersList, updateOrder, deleteOrders } from '@/apis/orders'
// import request from '@/utils/request';
// import { createIncrementalCompilerHost } from 'typescript';
import type { TableDataType } from '@/types/orderResponse'
import BusinessDetail from '@/views/business/main/Detail.vue'
import { getCustomerNameById, addOrder } from '../apis/oders'
import { exportToExcel } from '@/utils/file/exportExcel'
import { beforeUpload } from '@/utils/file/importExcel'


// 加载数据
onMounted(() => {
  // getOrders()
})

const props = defineProps<{
  // queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any) => void
  tableData: any[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}>()
// 设置tableData默认值(注意: Vue 的 props 默认是只读的，不能直接修改)
// 定义一个本地的 tableData
const localTableData = ref([...props.tableData]);

// 监听 props.tableData 的变化，更新本地的 tableData
watch(
  () => props.tableData,
  (newData) => {
    localTableData.value = [...newData];
  },
  { immediate: true }
);



const emit = defineEmits(['onPageChange', 'fetchData']);

// const tableData = ref<TableDataType[]>([])

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
]

// // getOders: 获取订单数据(不包括客户姓名)
// const getOrders = async () => {
//   try {
//     const res = await getOrdersList()
//     console.log('获取订单数据：', res)
//     tableData.value = res.rows
//     for (let i = 0; i < res.rows.length; i++) {
//       const customerName = await getCustomerNameById(res.rows[i].id)
//       // console.log('获取客户姓名：', customerName);
//       tableData.value[i].customerName = customerName
//     }
//   } catch (err) {
//     console.log('获取订单数据失败：', err)
//   }
// }

// 表格操作--start
const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return 'grey'
    case 1:
      return 'blue'
    case 2:
      return 'green'
    case 3:
      return 'red'
    case 4:
      return 'orange'
    default:
      return 'grey'
  }
}
const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '初始状态'
    case 1:
      return '设计中'
    case 2:
      return '已完成'
    case 3:
      return '作废'
    case 4:
      return '布产中'
  }
}

const onCheck = (row: TableDataType) => {
  console.log('查看：', row)
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
}

const onDerive = (row: TableDataType) => {
  console.log('导出：', row)
}

// // 编辑弹窗 ---start
// 编辑弹窗的显示状态
const editDialogVisible = ref(false)

// 编辑表单数据
const editForm = reactive({
  innerId: '',
  customerName: '',
  status: 0,
  information: '',
  createTime: '',
  // id: 0,
})

// 点击“编辑”按钮时触发
const onEdit = (row: TableDataType) => {
  // 将选中的行数据复制到编辑表单中
  editForm.innerId = row.innerId
  editForm.customerName = row.customerName
  editForm.status = row.status
  // editForm.information = row.information;
  editForm.createTime = row.createTime
  // editForm.id = row.id;

  // 打开编辑弹窗
  editDialogVisible.value = true
}

// 保存编辑后的数据
const onSaveEdit = () => {
  // 在 tableData 中找到对应的行并更新数据
  const index = localTableData.value.findIndex((item) => item.innerId === editForm.innerId)
  if (index !== -1) {
    localTableData.value[index] = { ...editForm }
  }

  // 关闭弹窗
  editDialogVisible.value = false
  console.log('保存后的数据：', localTableData.value)
}
// // 编辑弹窗 ---end

//  //表格分页
// const pagination = reactive({
//   page: 1,
//   pageSize: 5,
//   // total: props.tableData.length,
//   total: props.pagination.total,
//   pageSizes: [5, 10, 20, 50],
// })

const paginatiedtableData = computed(() => {
  const start = (props.pagination.page - 1) * props.pagination.pageSize
  const end = start + props.pagination.pageSize
  return props.tableData.slice(start, end)
})

// const onPageChange = (page: number) => {
//   props.pagination.page = page
// }

// const onShowSizeChange = (size: number) => {
//   props.pagination.pageSize = size
// }
// 表格操作--end

const selectedRows = ref<any[]>([])
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 删除

const onDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的产品');
    return;
  }

  try {
    await ElMessageBox.confirm('确认要删除选中的产品吗？', '提示', {
      type: 'warning'
    });

    const ids = selectedRows.value.map(item => item.id);
    await deleteOrders(ids);
    ElMessage.success('删除成功');
    // 重新获取表格数据
    emit('fetchData');
    selectedRows.value = [];
  } catch (err) {
    ElMessage.info('取消删除');
  }
};
// 导出
const onExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的产品');
    return;
  }

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

  const exportData = selectedRows.value.map(item => ({
    内部编号: item.innerId,
    外部编号: item.outerId,
    创建时间: item.createTime,
    操作人ID: item.operatorId,
    数量: item.quantity,
    交货期限: item.deliveryDeadline,
    交货时间: item.deliveryTime,
    状态: item.status,
    客户ID: item.customerId,
    产品ID: item.productId,
    布产ID: item.productionId,
    外购ID: item.purchaseId,
    分包ID: item.subcontractId,
    最后操作时间: item.lastOperationTime,
  }));

  exportToExcel(exportData, `订单数据_${dateStr}`);
};
</script>

<style scoped></style>
