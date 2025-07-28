<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div
        class="card-header"
        style="display: flex; justify-content: space-between; align-items: center"
      >
        <span>展示</span>
        <div class="card-actions">
          <el-button type="danger" @click="onDelete">删除</el-button>
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
        <el-table-column label="胶件图片">
          <template #default="{ row }">
            <img
              v-if="row.drawingReference"
              :src="getFullImageUrl(row.drawingReference)"
              alt="产品图片"
              style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px"
            />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="物料ID" />
        <el-table-column prop="mouldNumber" label="模具编号" />
        <el-table-column prop="specificationName" label="规格名称" />
        <el-table-column prop="cavityCount" label="腔口数量" />
        <el-table-column prop="materialType" label="料别" />
        <el-table-column prop="standardCode" label="常规编码" />
        <el-table-column prop="singleWeight" label="单重" />
        <el-table-column prop="mouldStatus" label="模具状态" />
        <el-table-column prop="mouldManufacturer" label="模具厂家" />
        <el-table-column prop="cycleTime" label="周期/s" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column prop="spareCode" label="备用编号" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="外购信息" width="100">
          <template #default="{ row }">
            <el-button
              v-if="row.purchased"
              size="small"
              type="primary"
              text
              @click="openPurchaseDialog(row.purchaseInfo)"
            >
              查看
            </el-button>
            <span v-else>无外购信息</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="75">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="onEdit(row)">编辑</el-button>
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
    <el-dialog v-model="purchaseDialogVisible" title="外购信息" width="600px">
        <div v-if="currentPurchaseInfo" class="purchase-info-container">
          <div class="info-item">
            <strong>采购编码:</strong> {{ currentPurchaseInfo.purchaseCode }}
          </div>
          <div class="info-item">
            <strong>ID:</strong> {{ currentPurchaseInfo.id }}
          </div>
          <div class="info-item">
            <strong>物料ID:</strong> {{ currentPurchaseInfo.materialId }}
          </div>
          <div class="info-item">
            <strong>单价:</strong> {{ currentPurchaseInfo.unitPrice.toFixed(2) }}
          </div>
          <div class="info-item">
            <strong>供应商:</strong> {{ currentPurchaseInfo.supplier }}
          </div>
          <div class="info-item">
            <strong>图片:</strong>
            <div v-if="currentPurchaseInfo.pictureUrl" class="image-container">
              <img
                :src="getFullImageUrl(currentPurchaseInfo.pictureUrl)"
                alt="外购图片"
                class="purchase-image"
              />
            </div>
            <span v-else>暂无图片</span>
          </div>
        </div>
      </el-dialog>
  </el-card>
  <MaterialDialog
    v-model="showDialog"
    :isEdit="isEdit"
    :currentData="currentRow"
    @submit="handleSubmit"
  />
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import {
  deleteMaterial,
  exportMaterialFile,
  getMaterialList,
  updateMaterial,
} from '@/apis/materials.js'
import { exportToExcel } from '@/utils/file/exportExcel'
import { downloadBinaryFile } from '@/utils/file/base64'
import { messageBox } from '@/components/message/messageBox'
import { getFullImageUrl } from '@/utils/image/getUrl'
import MaterialDialog from '@/views/production/component/materialDialog.vue'

const showDialog = ref(false)
const isEdit = ref(false)
const currentRow = ref({})

const props = defineProps<{
  queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any) => void
}>()
const getRowKey = (row: any) => row.id

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
interface PurchaseInfo {
  id: number;
  purchaseCode: string;
  pictureUrl: string;
  unitPrice: number;
  materialId: number;
  supplier: string;
}

const currentPurchaseInfo = ref<PurchaseInfo | null>(null)

const purchaseDialogVisible = ref(false)

const openPurchaseDialog = (purchaseInfo: PurchaseInfo) => {
  currentPurchaseInfo.value = purchaseInfo
  purchaseDialogVisible.value = true
}

const fetchData = async () => {
  const res = await getMaterialList({
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
      const res = await updateMaterial(formData)

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
      const res = await deleteMaterial(ids)

      fetchData()
      selectedRows.value = []
      return Promise.resolve()
    },
    '删除成功',
    '删除失败',
    '确认要删除选中的产品吗？',
  )
}

const onExport = async () => {
  if (selectedRows.value.length === 0) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要导出的物料', '')
    return
  }

  const ids = selectedRows.value.map((item) => item.id).join(',')
  const formData = new FormData()
  formData.append('ids', ids)

  try {
    const res = await exportMaterialFile(formData)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    downloadBinaryFile(blob, '物料导出.xlsx')
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
.purchase-info-container {
  font-family: Arial, sans-serif;
  line-height: 1.8;
}

.info-item {
  margin-bottom: 10px;
}

strong {
  font-weight: 600;
}

.image-container {
  margin-top: 10px;
}

.purchase-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}
</style>
