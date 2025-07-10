<template>
  <div class="bg">
    <el-card class="greyBack" style="margin: 30px, 30px; padding: 0">
      <template #header>
        <div class="card-header card-header-flex">
          <span>产品ID: {{ detail.id }} 对应的造型表列表</span>
          <div>
            <el-button type="success" @click="onCreate">新建</el-button>
            <el-button type="primary" @click="onImport">导入</el-button>
            <el-button type="primary" @click="handleDownloadTemplate">下载导入模板</el-button>
            <el-button type="danger" @click="onDelete">删除</el-button>
            <el-dropdown>
              <el-button type="primary">
                导出 <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="onExportAll">导出所有造型表</el-dropdown-item>
                  <el-dropdown-item @click="onExportSelected">导出所选项</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>

      <div v-for="[groupId, groupItems] in groupedData" :key="groupId" style="margin-bottom: 40px">
        <div style="font-weight: bold; margin: 10px 0">分组：{{ groupId }}</div>

        <el-table
          :data="groupItems"
          border
          style="width: 100%"
          :row-key="getRowKey"
          @selection-change="handleSelectionChange"
        >
          <!-- 表头保持不变 -->
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" />
          <el-table-column label="胶件图片">
            <template #default="{ row }">
              <img
                v-if="row.pictureUrl"
                :src="getFullImageUrl(row.pictureUrl)"
                alt="产品图片"
                style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px"
              />
              <span v-else>暂无图片</span>
            </template>
          </el-table-column>
          <el-table-column prop="productName" label="产品名称" />
          <el-table-column prop="lddNumber" label="LDD编号" />
          <el-table-column prop="mouldNumber" label="模具编号" />
          <el-table-column prop="mouldCategory" label="模具类别" />
          <el-table-column prop="material" label="模具用料" />
          <el-table-column prop="color" label="颜色" />
          <el-table-column prop="quantity" label="数量" />
          <el-table-column prop="confirm" label="是否确认">
            <template #default="{ row }">
              <el-tag :type="row.confirm ? 'success' : 'info'">
                {{ row.confirm ? '已确认' : '未确认' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="120">
            <template #default="{ row }">
              <el-button size="small" type="primary" text @click="onEdit(row)">编辑</el-button>
              <el-button size="small" type="primary" text @click="onView(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 每组下方新增按钮 -->
        <el-button
          type="success"
          style="margin-top: 10px; width: 100%"
          @click="onCreateWithGroup(groupId)"
        >
          + 新增造型表（分组 {{ groupId }}）
        </el-button>
      </div>

      <el-button type="primary" style="margin-top: 30px; width: 100%" @click="onAddGroup">
        + 新增分组
      </el-button>

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
        <div style="margin-top: 20px; text-align: right">
          <el-button type="success" @click="handleConfirm">PMC确认</el-button>
          <el-button type="warning" @click="handleCancelConfirm">取消确认</el-button>
        </div>
      </div>

      <el-dialog v-model="importDialogVisible" title="导入 Excel" width="400px">
        <el-upload
          class="upload-demo"
          drag
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="handleUpload"
          accept=".xlsx,.xls"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
          </template>
        </el-upload>
      </el-dialog>

      <el-dialog v-model="groupExportDialogVisible" title="选择要导出的分组" width="400px">
        <el-select v-model="groupId" placeholder="请选择分组" style="width: 100%">
          <el-option v-for="item in groupOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <template #footer>
          <el-button @click="groupExportDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="onExportByGroup">确认导出</el-button>
        </template>
      </el-dialog>

      <StyleDialog
        v-model="showDialog"
        :isEdit="isEdit"
        :currentData="currentRow"
        @submit="handleSubmit"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import {
  getStyleList,
  deleteStyle,
  exportStyleFile,
  updateStyle,
  addStyle,
  importStyleFile,
  getStyleTemplate,
} from '@/apis/styles'
import { pmcConfirm, pmcCancel, exportDesignFile } from '@/apis/designs'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox } from 'element-plus'
import { downloadBinaryFile } from '@/utils/file/base64'
import { getFullImageUrl } from '@/utils/image/getUrl'
import StyleDialog from '../component/styleDialog.vue'
import useTabStore from '@/stores/modules/tabs'

const props = defineProps<{
  detail: any
  control: any[]
}>()

const getRowKey = (row: any) => row.id

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedRows = ref<any[]>([])
const emit = defineEmits(['refresh'])

const tabStore = useTabStore()
const showDialog = ref(false)
const isEdit = ref(false)
const currentRow = ref({})

const groupedData = computed(() => {
  const groups = new Map()
  data.value.forEach((item) => {
    const group = item.groupId ?? 0
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group).push(item)
  })
  return Array.from(groups.entries()).sort((a, b) => a[0] - b[0])
})

const fetchData = async () => {
  console.log('props.detail:', props.detail.id)
  const res = await getStyleList({
    productId: props.detail.id,
    pageNum: page.value,
    pageSize: pageSize.value,
  })
  data.value = res.rows || []
  total.value = res.total || 0

  restoreSelection()
}

const importDialogVisible = ref(false)

const handlePageChange = (val: number) => {
  page.value = val
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
}

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

const onCreate = () => {
  isEdit.value = false
  currentRow.value = {}
  showDialog.value = true
}

const onCreateWithGroup = (groupId: number) => {
  isEdit.value = false
  currentRow.value = { groupId }
  showDialog.value = true
}

const onAddGroup = () => {
  const allGroupIds = data.value.map((i) => i.groupId ?? 0)
  const nextGroupId = Math.max(...allGroupIds, 0) + 1
  onCreateWithGroup(nextGroupId)
}

const onDelete = async () => {
  if (selectedRows.value.length === 0) {
    messageBox('warning', () => Promise.reject(), '', '请先选择要删除的记录', '')
    return
  }

  messageBox(
    'warning',
    async () => {
      const ids = selectedRows.value.map((i) => i.id)
      const res = await deleteStyle(ids)

      fetchData()
      selectedRows.value = []
      return Promise.resolve()
    },
    '删除成功',
    '删除失败',
    '确认删除选中的造型表数据吗？',
  )
}

const onImport = () => {
  importDialogVisible.value = true
}

const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  if (!isExcel) {
    messageBox('error', null, '', '只能上传 Excel 文件', '')
    return false
  }

  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    const res = await importStyleFile(formData)

    messageBox('success', null, '导入成功', '', '')
    importDialogVisible.value = false
    fetchData()
  } catch (e) {
    messageBox('error', null, '', '导入失败', '')
  }
}

const handleDownloadTemplate = async () => {
  try {
    const res = await getStyleTemplate()
    downloadBinaryFile(
      res,
      '造型表模板.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
  } catch (e) {
    messageBox('error', null, '', '下载失败', '')
  }
}

// 导出相关逻辑
const groupId = ref(null)
const groupExportDialogVisible = ref(false)

const groupOptions = ref<string[]>([])

const onExportAll = async () => {
  try {
    const res = await exportDesignFile(props.detail.id)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    downloadBinaryFile(blob, '造型表导出.xlsx')
  } catch (err) {
    messageBox('error', null, '', '导出失败', '')
  }
}

const onExportSelected = async () => {
  if (selectedRows.value.length === 0) {
    messageBox('warning', null, '', '请先选择要导出的记录', '')
    return
  }

  const ids = selectedRows.value.map((i) => i.id).join(',')

  try {
    const res = await exportStyleFile(ids)
    const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    downloadBinaryFile(blob, '造型表导出_所选项.xlsx')
  } catch (err) {
    messageBox('error', null, '', '导出失败', '')
  }
}

const onEdit = (row: any) => {
  isEdit.value = true
  currentRow.value = { ...row }
  showDialog.value = true
}

const onView = (row: any) => {
  // 可跳转详情页或展示对话框，按需实现
  console.log('查看', row)
}

const handleSubmit = async (rawForm: Record<string, any>) => {
  const formData = new FormData()
  // 遍历添加 key-value 到 formData
  for (const key in rawForm) {
    const value = rawForm[key]
    if (value === undefined || value === null) continue

    if (Array.isArray(value) && value[0] instanceof File) {
      // 文件数组
      value.forEach((file) => formData.append(key, file))
    } else if (value instanceof File) {
      // 单个文件
      formData.append(key, value)
    } else {
      // 普通字段
      formData.append(key, value)
    }
  }

  // 调试输出确认是否为空
  for (const [k, v] of formData.entries()) {
    console.log(k, v)
  }

  try {
    let res
    if (isEdit.value) {
      res = await updateStyle(formData)
    } else {
      formData.append('productId', props.detail.id)
      res = await addStyle(formData)
    }

    messageBox('success', Promise.resolve, isEdit.value ? '更新成功' : '新增成功', '', '')
    fetchData()
    emit('refresh')
  } catch (err) {
    messageBox('error', () => Promise.reject(), '', '提交失败', '')
  } finally {
    showDialog.value = false
  }
}
//Dialog 中只负责传值，FormData 永远由父组件构造和发送。!!!!!!!!!
const handleConfirm = async () => {
  try {
    const res = await pmcConfirm(props.detail.id)

    messageBox('success', null, '确认成功', '', '')
    tabStore.freshTab('产品查询')
  } catch (err) {
    messageBox('error', null, '', '确认失败', '')
  }
}

const handleCancelConfirm = async () => {
  try {
    const res = await pmcCancel(props.detail.id)

    messageBox('success', null, '取消确认成功', '', '')
    tabStore.freshTab('产品查询')
  } catch (err) {
    messageBox('error', null, '', '取消确认失败', '')
  }
}

onMounted(fetchData)
watch([page, pageSize], fetchData)
watch(showDialog, (val) => {
  if (!val) {
    currentRow.value = {}
    isEdit.value = false
  }
})
</script>
<style>
.card-header {
  font-weight: bold;
  font-size: 16px;
}
.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bg {
  padding: 0 40px 0 40px;
  background-color: rgb(240, 242, 245);
}
</style>
