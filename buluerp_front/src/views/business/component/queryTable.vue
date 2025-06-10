<template>
  <!-- 表格 -->
  <el-card shadow="never" style="margin: 0px 20px">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>列表</span>
        <div>
          <el-button type="danger" @click="onDelete" :disabled="control[2].disabled">删除</el-button>
          <el-button type="primary" @click="onExport">导出</el-button>
        </div>
      </div>
    </template>
    <el-table :data="props.tableData" border @selection-change="handleSelectionChange" :row-key="row => row.id">
      <el-table-column type="selection" :reserve-selection="true" />
      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
        <template v-if="column.slot" #default="{ row }">
          <span style="display: flex; align-items: center">
            <span :style="{
              backgroundColor: getStatusColor(row[column.prop]),
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              margin: '0 5px 0 0',
              border: '1px solid #ccc',
            }"></span>
            <!-- {{ row[column.prop] }} -->
            {{ getStatusText(row[column.prop]) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" @click="onEdit(row)" :disabled="control[1].disabled">编辑</el-button>
          <el-button link type="primary" @click="onCheck(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next, sizes, total" :total="pagination.total"
      :page-size="pagination.pageSize" :current-page="pagination.page" @size-change="emit('onPageSizeChange', $event)"
      @current-change="emit('onPageChange', $event)" :page-sizes="[5, 10, 20, 50]" />

    <!-- 编辑弹窗 -->
    <el-dialog title="编辑订单" v-model="editDialogVisible" width="500px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="订单ID">
          <el-input v-model="editForm.id" disabled />
        </el-form-item>
        <el-form-item label="客户姓名">
          <el-input v-model="editForm.customerName" />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="editForm.statusText" disabled />
        </el-form-item>
        <el-form-item label="其他信息">
          <el-input v-model="editForm.remark" />
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
import { reactive, onMounted, ref } from 'vue'
import { ElButton, ElTable, ElTableColumn, ElPagination, ElDialog, ElForm, ElFormItem, ElInput, ElMessageBox } from 'element-plus'
import { deleteOrders } from '@/apis/orders'
import type { TableDataType } from '@/types/orderResponse'
import BusinessDetail from '@/views/business/main/Detail.vue'
import { exportToExcel } from '@/utils/file/exportExcel'
import { getStatusText } from '../utils/statusMap'
import { messageBox } from '@/components/message/messageBox'

// 加载数据
onMounted(() => {
  // getOrders()
})

const props = defineProps<{
  // queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any) => void
  tableData: any[]
  control: Array<object>
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}>()

const emit = defineEmits(['onUpdated', 'fetchData', 'onPageSizeChange', 'onPageChange']);

const columns = [
  { prop: 'createTime', label: '创建时间' },
  { prop: 'id', label: '订单ID' },
  { prop: 'customerName', label: '客户姓名' },
  {
    prop: 'status',
    label: '订单状态',
    slot: 'statusSlot', // 自定义渲染的插槽名称
  },
  { prop: 'remark', label: '其他基本信息' },
]

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

const onCheck = (row: TableDataType) => {
  console.log('查看：', row)
  props.addTab(`订单详情 ${row.id}`, BusinessDetail, {
    addTab: props.addTab,
    control: props.control,
    id: row.id,
    innerId: row.innerId,
    status: row.status,
    remark: row.remark,
    createTime: row.createTime,
    customerName: row.customerName,
  })
}

// // 编辑弹窗 ---start
// 编辑弹窗的显示状态
const editDialogVisible = ref(false)

// 编辑表单数据
const editForm = reactive({
  id: 0,
  innerId: '',
  customerName: '',
  statusText: '',
  remark: '',
  createTime: '',
  // id: 0,
})

// 点击“编辑”按钮时触发
const onEdit = (row: TableDataType) => {
  // 将选中的行数据复制到编辑表单中
  // editForm.innerId = row.innerId
  editForm.customerName = row.customerName ? row.customerName : '';
  editForm.statusText = getStatusText(row.status);
  editForm.remark = row.remark ? row.remark : '';
  editForm.createTime = row.createTime ? row.createTime : '';
  editForm.id = row.id ? row.id : 0;

  Object.assign(editForm, row)
  console.log('编辑表单数据：', editForm);

  // 打开编辑弹窗
  editDialogVisible.value = true
}

// 保存编辑后的数据
const onSaveEdit = () => {
  console.log('保存了', { ...editForm });
  emit('onUpdated', { ...editForm })
  emit('fetchData')
  editDialogVisible.value = false
}

// 表格操作--end

const selectedRows = ref<any[]>([])
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// onDelete: 点击删除
const onDelete = async () => {
  if (selectedRows.value.length === 0) {
    messageBox('error', null, null, '请先选择要删除的产品')
    return
  }
  try {
    await ElMessageBox.confirm('确认要删除选中的产品吗？', '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showCancelButton: true,
    })
    const ids = selectedRows.value.map((item) => item.id)
    try {
      await deleteOrders(ids)
      messageBox('success', null, '已成功删除选中的产品')
      // 重新获取表格数据
      emit('fetchData');
      selectedRows.value = [];
    } catch (error) {
      console.error('删除失败:', error)
      messageBox('error', null, null, '删除失败,请稍后重试')
    }
  } catch (err) {
    messageBox('success', null, '已取消删除操作')
  }
}
// 导出字段配置，方便维护和扩展
const exportFields = [
  { label: '内部编号', key: 'innerId' },
  { label: '外部编号', key: 'id' },
  { label: '数量', key: 'quantity' },
  { label: '交货期限', key: 'deliveryDeadline' },
  { label: '交货时间', key: 'deliveryTime' },
  { label: '状态', key: 'status' },
  { label: '产品ID', key: 'productId' },
  { label: '布产ID', key: 'productionId' },
  { label: '外购ID', key: 'purchaseId' },
  { label: '分包ID', key: 'subcontractId' },
  { label: '其它信息', key: 'remark' },
]

const onExport = () => {
  if (selectedRows.value.length === 0) {
    messageBox('error', null, null, '请先选择要导出的订单')
    return
  }
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
  const exportData = selectedRows.value.map(item => {
    const row: Record<string, any> = {}
    exportFields.forEach(field => {
      row[field.label] = item[field.key]
    })
    return row
  })
  exportToExcel(exportData, `订单数据_${dateStr}`)
}
</script>

<style scoped></style>
