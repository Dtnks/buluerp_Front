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
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="id" label="产品编码" />
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="designStatus" label="产品状态">
          <template #default="{ row }">
            <span style="display: flex; align-items: center;">
              <span
                :style="{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: row.designStatus === 1 ? '#67C23A' : '#E6A23C',
                  marginRight: '8px',
                }"
              ></span>
              {{ row.designStatus === 1 ? '已完成' : '设计中' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="产品图片">
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
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right" width="250">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="onView(row)">查看</el-button>
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
import { getList_pro , deleteProduct} from '@/apis/products.js'
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
  const res = await getList_pro({
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
    await deleteProduct(ids)
    ElMessage.success('删除成功')
    fetchData()
    selectedRows.value = []
  } catch (err) {
    ElMessage.info('取消删除')
  }
}

const onExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的产品')
    return
  }

  const today = new Date()
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')

  const exportData = selectedRows.value.map(item => ({
    产品ID: item.id,
    产品名称: item.name,
    创建时间: item.createTime,
    更新时间: item.updateTime,
    创建人: item.createUsername || '未知',
    设计确认状态: item.designStatus === 1 ? '已完成' : '设计中',
    图片URL: item.pictureUrl ? getFullImageUrl(item.pictureUrl) : '暂无',
  }))

  exportToExcel(exportData, `产品数据_${dateStr}`)
}


const onView = (row: any) => {
  props.addTab(`详情页-${row.name}`, Detail, {id : row.id})
  console.log('id是',row.id)
}
</script>
