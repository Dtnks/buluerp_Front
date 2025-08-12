<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div
        class="card-header"
        style="display: flex; justify-content: space-between; align-items: center"
      >
        <span>展示</span>
        <div class="card-actions">
          <!-- <el-button type="danger" @click="onDelete">删除</el-button> -->
          <el-button type="primary" @click="onExport">导出</el-button>
        </div>
      </div>
    </template>
    <div>
      <el-table
        :data="data"
        border
        style="width: 100%"
        ref="tableRef"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="productId" label="产品ID" />
        <el-table-column prop="createUserId" label="创建人ID" />
        <el-table-column prop="orderId" label="订单ID" />
        <el-table-column prop="createTime" label="创建时间" />
        <!-- <el-table-column prop="confirm" label="是否确认">
            <template #default="{ row }">
            <el-tag :type="row.confirm ? 'success' : 'info'">
                {{ row.confirm ? '已确认' : '未确认' }}
            </el-tag>
            </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" width="75">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="onEdit(row)">编辑</el-button>
            <!-- <el-button size="small" type="primary" text @click="onView(row)">查看</el-button> -->
          </template>
        </el-table-column>
      </el-table>

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
    </div>
  </el-card>
  <DesignDialog
    v-model="showDialog"
    :isEdit="isEdit"
    :currentData="currentRow"
    @submit="handleSubmit"
  />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { deleteDesign, exportDesignFile, getDesignList, updateDesign } from '@/apis/designs.js'
import { exportToExcel } from '@/utils/file/exportExcel'
import { downloadBinaryFile } from '@/utils/file/base64'
import { messageBox } from '@/components/message/messageBox'
import Style from '@/views/production/main/StyleTable.vue'

import DesignDialog from '@/views/production/component/designDialog.vue'

const showDialog = ref(false)
const isEdit = ref(false)
const currentRow = ref({})

const props = defineProps<{
  queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any,targetPath?:string) => void
}>()
const getRowKey = (row: any) => row.id

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)



const fetchData = async () => {
  const res = await getDesignList({
    ...props.queryParams,
    pageNum: page.value,
    pageSize: pageSize.value,
  })
  data.value = res.rows || []
  total.value = res.total || 0

  restoreSelection()
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

      const res = await updateDesign(formData)

      messageBox('success', Promise.resolve, '更新成功', '', '')
    }
    fetchData()
  } catch (err) {
    messageBox('error', () => Promise.reject(), '', '操作失败', '')
  } finally {
    showDialog.value = false
  }
}

onMounted(() => {
  fetchData()
})

watch(
  () => props.queryParams,
  () => {
    page.value = 1
    fetchData()
  },
  { deep: true },
)

watch([page, pageSize], fetchData)

const handlePageChange = (val: number) => {
  page.value = val
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
}

const selectedRows = ref<any[]>([])
const tableRef = ref()

const handleSelectionChange = (selection: any[]) => {
  const currentIds = data.value.map((item) => item.id)

  // 删除当前页取消选中的
  selectedRows.value = selectedRows.value.filter((item) => !currentIds.includes(item.id))

  // 添加当前页选中的（去重）
  selectedRows.value.push(
    ...selection.filter((item) => !selectedRows.value.some((existing) => existing.id === item.id)),
  )
}
const restoreSelection = () => {
  nextTick(() => {
    data.value.forEach((row) => {
      const found = selectedRows.value.find((item) => item.id === row.id)
      if (found) {
        tableRef.value?.toggleRowSelection(row, true)
      }
    })
  })
}

const onDelete = async () => {
  if (selectedRows.value.length === 0) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要删除的产品', '')
    return
  }

  messageBox(
    'warning',
    async () => {
      const ids = selectedRows.value.map((item) => item.id)
      const res = await deleteDesign(ids)

      fetchData()
      selectedRows.value = []
      return Promise.resolve()
    },
    '删除成功',
    '删除失败',
    '确认要删除选中的造型表吗？',
  )
}

const onExport = async () => {
  if (selectedRows.value.length === 0) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要导出的造型表', '')
    return
  }

  const ids = selectedRows.value.map((item) => item.id).join(',')
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
const onView = (row: any) => {
  props.addTab(`造型表 - ID: ${row.id}`, Style, { productId: row.productId },`/production/StyleTable/${row.id}`)
}
</script>
<style>
.card-actions {
  margin-right: 20px;
}
</style>
