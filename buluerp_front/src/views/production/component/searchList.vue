<template>

  <div>
    <!-- 用 Tablelist 替换 el-table -->
    <Tablelist :tableData="tableData" :listData="data" :operations="operations" :exportFunc="onExport"
      :DeleteFunc="onDelete" :control="control">

      <!-- 分页器 -->
      <slot>
        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center">
          <div>共 {{ total }} 条</div>
          <el-pagination background layout="prev, pager, next, jumper, ->, total, sizes" :current-page="page"
            :page-size="pageSize" :page-sizes="[5, 10, 20, 50]" :total="total" @current-change="handlePageChange"
            @size-change="handleSizeChange" />
        </div>
      </slot>
    </Tablelist>
  </div>

</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { getList_pro, deleteProduct, exportProduct } from '@/apis/products.js'
import { messageBox } from '@/components/message/messageBox'
import { downloadBinaryFile } from '@/utils/file/base64'
import Tablelist from '@/components/table/TableList.vue'

const props = defineProps<{
  queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any, targetPath?: string) => void

}>()

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchData = async () => {
  const res = await getList_pro({
    ...props.queryParams,
    pageNum: page.value,
    pageSize: pageSize.value,
  })
  data.value = res.rows || []
  total.value = res.total || 0
}
onMounted(fetchData)

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

// === 表格配置 ===
const tableData = [
  { label: '创建时间', value: 'createTime', type: 'text' },
  { label: '产品编码', value: 'id', type: 'text' },
  { label: '产品名称', value: 'name', type: 'text' },
  {
    label: '产品状态',
    value: 'designStatus',
    type: 'Maptext',
    map: { 1: '已完成', 0: '设计中' },
  },
  { label: '产品图片', value: 'pictureUrl', type: 'picture' },
  { label: '更新时间', value: 'updateTime', type: 'text' },
]

const operations = [
  {
    value: '查看',
    func: (row: any) => props.addTab(`产品详情页-${row.name}`, 'ProductDetail', row, `/production/Detail/${row.id}`),
  },
]

// === 操作 ===
const onDelete = async (rows: any[]) => {
  if (!rows || rows.length === 0) {
    messageBox('error', () => Promise.reject(), '', '请先选择要删除的产品', '')
    return
  }

  const ids = rows.map((item) => item.id)
  messageBox(
    'warning',
    () =>
      deleteProduct(ids).then(() => {
        fetchData()
        return Promise.resolve()
      }),
    '删除成功',
    '删除失败',
    '确认要删除选中的产品吗？',
  )
}

const onExport = async (rows: any[]) => {
  if (!rows || rows.length === 0) {
    messageBox('error', () => Promise.reject(), '', '请先选择要导出的产品', '')
    return
  }

  const ids = rows.map((item) => item.id).join(',')
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
  props.addTab(`产品详情页-${row.name}`, 'ProductDetail', row, `/production/Detail/${row.id}`)
}
</script>
