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
              v-if="row.pictureUrl"
              :src="getFullImageUrl(row.pictureUrl)"
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
            <el-button size="small" type="primary" text @click="onEdit">编辑</el-button>
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
</template>

<script lang="ts" setup>
import { ref, watch , onMounted} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {deleteMaterial ,getMaterialList } from '@/apis/materials.js' 
import { exportToExcel } from '@/utils/file/exportExcel'

import Detail from '../main/Detail.vue' 
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

const onExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的物料')
    return
  }

  const today = new Date()
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '') 

  const exportData = selectedRows.value.map(item => ({
    创建时间: item.creatTime,
    更新时间: item.updateTime,
    胶件图引: item.drawingReference,
    模具编号: item.id,
    规格名称: item.specificationName,
    腔口数量: item.cavityCount,
    材料类型: item.materialType,
    常规编码: item.standardCode,
    单重: item.singleWeight,
    模具状态: item.mouldStatus,
    模具厂商: item.mouldManufacturer,
    生产周期: item.cycleTime,
    样品库位: item.sampleLocation,
    备注: item.remarks,
    备用编码: item.spareCode,
  }))

  exportToExcel(exportData, `物料资料数据`)
}


const onEdit = (row: any) => {

}
</script>
