<template>
  <el-card style=" margin: 0 20px;">
    <template #header>
      <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
        <span>展示</span>
        <div>
          <el-button type="danger" @click="onDelete">删除</el-button>
          <el-button type="primary" @click="onExport">导出</el-button>
        </div>
      </div>
    </template>
    <div>
      <el-table :data="data" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="胶件图片">
          <template #default="{ row }">
            <img
              v-if="row.drawingReference"
              :src="getFullImageUrl(row.drawingReference)"
              alt="产品图片"
              style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;"
            />
            <span v-else>暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="mouldNumber" label="模具编号" />
        <el-table-column prop="specificationName" label="规格名称" />
        <el-table-column prop="materialType" label="料别" />
        <el-table-column prop="standardCode" label="常规编码" />
        <el-table-column prop="singleWeight" label="单重" />
        <el-table-column prop="mouldStatus" label="模具状态" />
        <el-table-column prop="mouldManufacturer" label="模具厂家" />
        <el-table-column prop="cycleTime" label="周期/s" />
        <el-table-column prop="remarks" label="备注" />
        <el-table-column prop="spareCode" label="备用编号" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right" width="75">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="onEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
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
  <MaterialDialog
  v-model="showDialog"
  :isEdit="isEdit"
  :currentData="currentRow"
  @submit="handleSubmit"
/>

</template>

<script lang="ts" setup>
import { ref, watch , onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { deleteMaterial , exportMaterialFile, getMaterialList , updateMaterial , } from '@/apis/materials.js' 
import { exportToExcel } from '@/utils/file/exportExcel'
import { downloadBinaryFile } from '@/utils/file/base64'

import MaterialDialog from '@/views/production/component/materialDialog.vue' 
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

const BASE_IMAGE_URL = 'http://154.201.77.135:8080' 

const getFullImageUrl = (path: string) => {
  // 防止多余斜杠：/profile//2025/... => /profile/2025/...
  return BASE_IMAGE_URL + path.replace('//', '/')
}

const fetchData = async () => {
  console.log('queryParams:', props.queryParams)
  const res = await getMaterialList({
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
      await updateMaterial(formData) 
      ElMessage.success('更新成功')
    } else {
    }
    fetchData()
  } catch (err) {
    ElMessage.error('操作失败')
  } finally {
    showDialog.value = false
  }
}

onMounted(() => {
  fetchData() // 组件挂载时发一次请求
})

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

const selectedRows = ref<any[]>([])

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

const onDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要删除的产品')
    return
  }

  try {
    await ElMessageBox.confirm('确认要删除选中的产品吗？', '提示', {
      type: 'warning'
    })

    const ids = selectedRows.value.map(item => item.id)
    await deleteMaterial(ids) 
    ElMessage.success('删除成功')
    fetchData() 
    selectedRows.value = [] 
  } catch (err) {
    ElMessage.info('取消删除')
  }
}

const onExport = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的物料')
    return
  }

  const ids = selectedRows.value.map(item => item.id).join(',') 

  const formData = new FormData()
  formData.append('ids', ids)

  try {
    const res = await exportMaterialFile(formData)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    downloadBinaryFile(blob, '物料导出.xlsx')
  } catch (err) {
    ElMessage.error('导出失败')
    console.error('导出错误:', err)
  }
}
</script>
