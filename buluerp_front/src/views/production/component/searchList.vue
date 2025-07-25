<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div
        class="card-header"
        style="display: flex; justify-content: space-between; align-items: center"
      >
        <span>展示</span>
        <div class="card-actions">
          <el-button type="danger" @click="onDelete" :disabled="control[2].disabled"
            >删除</el-button
          >
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
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="id" label="产品编码" />
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="designStatus" label="产品状态">
          <template #default="{ row }">
            <span style="display: flex; align-items: center">
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
              v-if="row.pictureUrl && !loadErrorMap[row.id]"
              :src="getFullImageUrl(row.pictureUrl)"
              alt="产品图片"
              style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px"
              @error="handleImageError(row.id)"
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
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, reactive, nextTick } from 'vue'
import { getList_pro, deleteProduct, exportProduct } from '@/apis/products.js'
import { messageBox } from '@/components/message/messageBox'
import { getFullImageUrl } from '@/utils/image/getUrl'
import { downloadBinaryFile } from '@/utils/file/base64'

import Detail from '../main/Detail.vue'

const props = defineProps<{
  queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
}>()

const getRowKey = (row: any) => row.id

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
// const BASE_IMAGE_URL = 'http://154.201.77.135:8080'

// const getFullImageUrl = (path: string) => {
//   return BASE_IMAGE_URL + path.replace('//', '/')
// }

const loadErrorMap = reactive<Record<string | number, boolean>>({})

const handleImageError = (id: string | number) => {
  loadErrorMap[id] = true
}

const fetchData = async () => {
  const res = await getList_pro({
    ...props.queryParams,
    pageNum: page.value,
    pageSize: pageSize.value,
  })
  data.value = res.rows || []
  total.value = res.total || 0

  restoreSelection()
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

  // 删除当前页中取消选择的项
  selectedRows.value = selectedRows.value.filter((item) => !currentIds.includes(item.id))

  // 添加当前页中选中的项（去重）
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
    messageBox('error', () => Promise.reject(), '', '请先选择要删除的产品', '')
    return
  }

  const ids = selectedRows.value.map((item) => item.id)

  messageBox(
    'warning',
    () =>
      deleteProduct(ids).then((res) => {
        fetchData()
        selectedRows.value = []
        return Promise.resolve()
      }),
    '删除成功',
    '删除失败',
    '确认要删除选中的产品吗？',
  )
}

const onExport = async () => {
  if (selectedRows.value.length === 0) {
    messageBox('error', () => Promise.reject(), '', '请先选择要导出的产品', '')
    return
  }

  const ids = selectedRows.value.map((item) => item.id).join(',')

  const today = new Date()
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
  const filename = `产品数据_${dateStr}.xlsx`

  try {
    const res = await exportProduct(ids)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    downloadBinaryFile(blob, filename)
  } catch (err) {
    messageBox('error', null, '', '导出失败', '')
  }
}

const onView = (row: any) => {
  props.addTab(`产品详情页-${row.name}`, Detail, row, props.control)
}
</script>
<style>
.card-actions {
  margin-right: 20px;
}
</style>
