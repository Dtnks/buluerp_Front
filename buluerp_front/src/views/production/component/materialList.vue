<template>

  <Tablelist :tableData="tableData" :listData="data" :operations="operations" :exportFunc="onExport"
    :DeleteFunc="onDelete" :control="control">
    <!-- 分页器 -->
    <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center">
      <div>共 {{ total }} 条</div>
      <el-pagination background layout="prev, pager, next, jumper, ->, total, sizes" :current-page="page"
        :page-size="pageSize" :page-sizes="[5, 10, 20, 50]" :total="total" @current-change="handlePageChange"
        @size-change="handleSizeChange" />
    </div>
  </Tablelist>

  <!-- 外购信息弹窗 -->
  <el-dialog v-model="purchaseDialogVisible" title="外购信息" width="600px" @close="closePurchaseDialog">
    <div v-if="currentPurchaseInfo" class="purchase-info-container">
      <div class="info-item"><strong>采购编码:</strong> {{ currentPurchaseInfo.purchaseCode }}</div>
      <div class="info-item"><strong>ID:</strong> {{ currentPurchaseInfo.id }}</div>
      <div class="info-item"><strong>物料ID:</strong> {{ currentPurchaseInfo.materialId }}</div>
      <div class="info-item"><strong>单价:</strong> {{ currentPurchaseInfo.unitPrice.toFixed(2) }}</div>
      <div class="info-item"><strong>供应商:</strong> {{ currentPurchaseInfo.supplier }}</div>
      <div class="info-item">
        <strong>图片:</strong>
        <div v-if="currentPurchaseInfo.pictureUrl" class="image-container">
          <img :src="getFullImageUrl(currentPurchaseInfo.pictureUrl)" alt="外购图片" class="purchase-image" />
        </div>
        <span v-else>暂无图片</span>
      </div>
    </div>
  </el-dialog>

    <!-- 模具信息弹窗 -->
  <el-dialog v-model="showDetailDialog" title="模具信息" width="1000px">
    <div style="display: flex; gap: 20px;">
      <!-- 左侧模具基本信息 -->
      <div style="flex: 1; min-width: 300px;">
        <div v-if="currentRow" class="purchase-info-container">
          <div class="info-item"><strong>模具ID:</strong> {{ currentRow.mouldNumber }}</div>
          <div class="info-item"><strong>模具厂家:</strong> {{ currentRow.manufacturerName }}</div>
          <div class="info-item"><strong>试模时间:</strong> {{ currentRow.trialDate }}</div>
          <div class="info-item"><strong>模具状态:</strong> {{ currentRow.status }}</div>
        </div>
        <div v-else class="purchase-info-container">
          <div class="info-item">此模具不存在！</div>
        </div>
      </div>
      <div style="flex: 1; min-width: 500px; height: 400px; border: none; border-radius: 8px; display: flex; align-items: center; justify-content: center; background-color: #f5f7fa; overflow: hidden;">
        <ThreeShowing v-if="currentRow.modelUrl" :modelUrl="currentRow.modelUrl"/>
        <span v-else style="color: #909399;">暂无 3D 模型数据</span>
      </div>
    </div>
  </el-dialog>

  <!-- 编辑对话框 -->
  <MaterialEditDialog v-model="showDialog" :currentData="currentRow" @submit="handleSubmit" />
  <PurchaseDialog
  v-model="showPurchaseDialog"
  :currentData="currentRow"
  @submit="handleSubmit"
/>

</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import {
  deleteMaterial,
  exportMaterialFile,
  getMaterialList,
  updateMaterial,
} from '@/apis/materials.js'
import {
  getMouldDetail
} from '@/apis/mould'
import { downloadBinaryFile } from '@/utils/file/base64'
import { messageBox } from '@/components/message/messageBox'
import { getFullImageUrl } from '@/utils/image/getUrl'
import MaterialDialog from '@/views/production/component/materialDialog.vue'
import MaterialEditDialog from './materialEditDialog.vue'
import Tablelist from '@/components/table/TableList.vue'
import PurchaseDialog from './purchaseDialog.vue'
import ThreeShowing from './threeShowing.vue'

const showDialog = ref(false)
const showDetailDialog = ref(false)
const currentRow = ref({})

const props = defineProps<{
  queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any, targetPath?: string) => void
}>()

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

interface PurchaseInfo {
  id: number
  purchaseCode: string
  pictureUrl: string
  unitPrice: number
  materialId: number
  supplier: string
}

const currentPurchaseInfo = ref<PurchaseInfo | null>(null)
const purchaseDialogVisible = ref(false)

const openPurchaseDialog = (purchaseInfo: PurchaseInfo) => {
  currentPurchaseInfo.value = purchaseInfo
  purchaseDialogVisible.value = true
}

// 定义表格列
const tableData = [
  { value: 'drawingReference', label: '胶件图片', type: 'picture' },
  { value: 'modelUrl', label: '3D模型', type: 'model' },
  { value: 'id', label: '物料ID', type: 'text' },
  { value: 'mouldNumber', label: '模具编号', type: 'text' },
  { value: 'specificationName', label: '规格名称', type: 'text' },
  {
    value: 'purchased',
    label: '外购信息',
    type: 'Maptext',
    map: {
      true: '有',
      false: '无',
    },
  },
  { value: 'cavityCount', label: '腔口数量', type: 'text' },
  { value: 'materialType', label: '料型', type: 'text' },
  { value: 'standardCode', label: '常规编码', type: 'text' },
  { value: 'singleWeight', label: '单重', type: 'text' },
  {
    value: 'mouldStatus',
    label: '模具状态',
    type: (row) => {
      return row.mouldStatus === '模具故障送修中' ? 'warningtags' : 'tags'
    }
  },
  // { value: 'mouldManufacturer', label: '模具厂家', type: 'text' },
  { value: 'cycleTime', label: '周期/s', type: 'text' },
  { value: 'remarks', label: '备注', type: 'text' },
  { value: 'spareCode', label: '备用编号', type: 'text' },
  { value: 'updateTime', label: '更新时间', type: 'text' },
]

// 操作列
const operations = [
  { value: '模具详情', func: (row: any) => onDetail(row), disabled: false },
  { value: '编辑', func: (row: any) => onEdit(row), disabled: false },
  { value: '查看外购', func: (row: any) => openPurchaseDialog(row.purchaseInfo), disabled: false },
]

// 控制按钮的禁用状态
const control = ref([{ disabled: false }, { disabled: false }, { disabled: false }])

const fetchData = async () => {
  const res = await getMaterialList({
    ...props.queryParams,
    pageNum: page.value,
    pageSize: pageSize.value,
  })
  data.value = res.rows || []
  total.value = res.total || 0
}

const showPurchaseDialog = ref(false)

const onEdit = (row: any) => {
  console.log(row)
  currentRow.value = { ...row }

  if (row.purchased) {
    // 如果是外购物料，显示外购对话框
    showPurchaseDialog.value = true
  } else {
    // 否则显示普通物料编辑对话框
    showDialog.value = true
  }
}

const handleSubmit = async (formData: any) => {
  try {
    await updateMaterial(formData)
    messageBox('success', Promise.resolve, '更新成功', '', '')
    await fetchData()
  } catch {
    messageBox('error', () => Promise.reject(), '', '操作失败', '')
  } finally {
    showDialog.value = false
  }
}

const onDetail = async (row: any) => {
  try {
    console.log(row.mouldNumber)
    const res = await getMouldDetail(row.mouldNumber)
    currentRow.value = res.data
    console.log(currentRow.value)
    showDetailDialog.value = true
  }
   catch (error) {
    console.error('获取模具详情失败', error)
    console.log('err', error)
  }
}
const closePurchaseDialog = () => {
  currentPurchaseInfo.value = null
  purchaseDialogVisible.value = false
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

// 删除
const onDelete = async (rows: any[]) => {
  if (!rows.length) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要删除的产品', '')
    return
  }
  messageBox(
    'warning',
    async () => {
      const ids = rows.map((item) => item.id)
      await deleteMaterial(ids)
      fetchData()
      return Promise.resolve()
    },
    '删除成功',
    '删除失败',
    '确认要删除选中的产品吗？',
  )
}

// 导出
const onExport = async (rows: any[]) => {
  if (!rows.length) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要导出的物料', '')
    return
  }
  const ids = rows.map((item) => item.id).join(',')
  const formData = new FormData()
  formData.append('ids', ids)
  try {
    const res = await exportMaterialFile(formData)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    downloadBinaryFile(blob, '物料导出.xlsx')
  } catch (err) {
    messageBox('error', () => Promise.reject(), '', '导出失败', '')

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
