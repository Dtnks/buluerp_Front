<template>

    <Tablelist
      :tableData="tableData"
      :listData="data"
      :operations="operations"
      :exportFunc="onExport"
      :DeleteFunc="onDelete"
      :control="control"
    >
      <!-- 分页器 -->
      <div
        style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center"
      >
        <div>共 {{ total }} 条</div>
        <el-pagination
          background
          layout="prev, pager, next, jumper, ->, total, sizes"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </Tablelist>

    <!-- 编辑对话框 -->
    <DesignDialog
      v-model="showDialog"
      :isEdit="isEdit"
      :currentData="currentRow"
      @submit="handleSubmit"
    />

</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { deleteDesign, exportDesignFile, getDesignList, updateDesign } from '@/apis/designs.js'
import { downloadBinaryFile } from '@/utils/file/base64'
import { messageBox } from '@/components/message/messageBox'
import Tablelist from '@/components/table/TableList.vue'
import Style from '@/views/production/main/StyleTable.vue'
import DesignDialog from '@/views/production/component/designDialog.vue'

const showDialog = ref(false)
const isEdit = ref(false)
const currentRow = ref({})

const props = defineProps<{
  queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any) => void
}>()

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 定义表格列
const tableData = [
  { value: 'id', label: 'ID', type: 'text' },
  { value: 'productId', label: '产品ID', type: 'text' },
  { value: 'createUserId', label: '创建人ID', type: 'text' },
  { value: 'orderId', label: '订单ID', type: 'text' },
  { value: 'createTime', label: '创建时间', type: 'text' },
  // { value: 'confirm', label: '是否确认', type: 'Maptext', map: { true: '已确认', false: '未确认' } },
]

// 操作列
const operations = [
  { value: '编辑', func: (row: any) => onEdit(row), disabled: false },

]

// 控制按钮的禁用状态
const control = ref([{ disabled: false }, { disabled: false }, { disabled: false }])

const fetchData = async () => {
  const res = await getDesignList({
    ...props.queryParams,
    pageNum: page.value,
    pageSize: pageSize.value,
  })
  data.value = res.rows || []
  total.value = res.total || 0
}

const onEdit = (row: any) => {
  isEdit.value = true
  currentRow.value = { ...row }
  showDialog.value = true
}

const handleSubmit = async (formData: any) => {
  try {
    if (isEdit.value) {
      formData.id = currentRow.value.id
      await updateDesign(formData)
      messageBox('success', Promise.resolve, '更新成功', '', '')
    }
    fetchData()
  } catch {
    messageBox('error', () => Promise.reject(), '', '操作失败', '')
  } finally {
    showDialog.value = false
  }
}

onMounted(fetchData)

watch(
  () => props.queryParams,
  () => {
    page.value = 1
    fetchData()
  },
  { deep: true }
)

watch([page, pageSize], fetchData)

const handlePageChange = (val: number) => {
  page.value = val
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
}

// 删除
const onDelete = async (rows: any[]) => {
  if (!rows.length) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要删除的项', '')
    return
  }
  messageBox(
    'warning',
    async () => {
      const ids = rows.map((item) => item.id)
      await deleteDesign(ids)
      fetchData()
      return Promise.resolve()
    },
    '删除成功',
    '删除失败',
    '确认要删除选中的设计总表吗？'
  )
}

// 导出
const onExport = async (rows: any[]) => {
  if (!rows.length) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要导出的项', '')
    return
  }
  const ids = rows.map((item) => item.id).join(',')
  const formData = new FormData()
  formData.append('ids', ids)
  try {
    const res = await exportDesignFile(formData)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    downloadBinaryFile(blob, '设计总表导出.xlsx')
  } catch (err) {
    messageBox('error', () => Promise.reject(), '', '导出失败', '')
    console.error('导出错误:', err)
  }
}


</script>

<style>
.card-actions {
  margin-right: 20px;
}
</style>
