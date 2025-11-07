<template>
  <div class="col">
    <BordShow content="模具列表" path="模具管理/模具" />

    <div class="greyBack">
      <!-- 查询表单 -->
      <FormSearch
        title="查询"
        :data="formData"
        :onSubmit="onSubmit"
        :onImport="onImport"
        :onCreate="onCreate"
        :onDownloadTemplate="onDownloadTemplate"
        :searchForm="searchContent"
      />

      <!-- 表格 -->
      <TableList
        :tableData="tableData"
        :operations="operation"
        :listData="listData"
        :DeleteFunc="DeleteFunc"
        :exportFunc="exportFunc"
      >
        <slot>
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
        </slot>
      </TableList>
    </div>

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="editDialogVisible" :title="title" width="800px">
      <CreateForm :data="dynamicFormData" :Formvalue="newSubmit" ref="createFormRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确认</el-button>
          <el-button @click="() => (editDialogVisible = false)">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import TableList from '@/components/table/TableList.vue'
import BordShow from '@/components/board/SecBoard.vue'
import { ElMessage } from 'element-plus'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { parseTime } from '@/utils/ruoyi'
import { downloadBinaryFile } from '@/utils/file/base64'
import { requiredRule } from '@/utils/form/valid'
import {
  getMouldList,
  createMould,
  deleteMould,
  updateMould,
  exportMould,
  importMouldFile,
  getMouldTemplate,
} from '@/apis/mould'
import {searchFunc} from "@/utils/search/search"
// 查询表单
const formData = ref([
  [
    { type: 'input', label: '模具编号', key: 'mouldNumber' },
    { type: 'input', label: '模具厂商', key: 'manufacturerId' },
    {
      type: 'select',
      label: '模具状态',
      key: 'status',
      options: [
        { value: '创建(待制作)', label: '创建(待制作)' },
        { value: '制作完成(待验收)', label: '制作完成(待验收)' },
        { value: '验收通过', label: '验收通过' },
        { value: '维修中', label: '维修中' },
        { value: '试模完成', label: '试模完成' },
      ],
    },
  ],
])


const searchContent = ref({
  id: '',
  manufacturerId: '',
  status: '',
})

// 表格列
const tableData = ref([
  { value: 'id', label: 'id', type: 'text' },
  { value : 'mouldNumber', label: '模具编号', type: 'text' },
  { value: 'manufacturerId', label: '模具厂商', type: 'text' },
  { value: 'trialDate', label: '试模日期', type: 'text' },
  {
    value: 'status',
    label: '模具状态',
    type: 'text',
  },
  {
    value: 'mouldHouseId',
    label: '模房id',
    type: 'text',
  },
])

// 表单项
import { computed } from 'vue'

// 动态表单项
const dynamicFormData = computed(() => {
  if (title.value === '新增') {
    // 新增只显示两项
    return [
      [
        { type: 'input', label: '模具编号', key: 'mouldNumber', width: 8, rules: [requiredRule] },
        { type: 'inputSelect', label: '模具厂商', key: 'manufacturerId', width: 8, rules: [requiredRule],
        showKey:[{key:'id',label:"厂商编号"},{key:'name',label:"厂商名称"}],
      remoteFunc: searchFunc('system/manufacturer/list', 'id'),
      options: [],
      loading: false, },
      ],
    ]
  } else {
    // 编辑显示四项
    return [
      [
        { type: 'input', label: '模具编号', key: 'mouldNumber', width: 8, rules: [requiredRule] },
        { type: 'inputSelect', label: '模具厂商', key: 'manufacturerId', width: 8, rules: [requiredRule],
        showKey:[{key:'id',label:"厂商编号"},{key:'name',label:"厂商名称"}],
      remoteFunc: searchFunc('system/manufacturer/list', 'id'),
      options: [],
      loading: false, },
        {
          type: 'select',
          label: '模具状态',
          key: 'status',
          width: 8,
          options: [
            { value: '创建(待制作)', label: '创建(待制作)' },
            { value: '制作完成(待验收)', label: '制作完成(待验收)' },
            { value: '验收通过', label: '验收通过' },
            { value: '维修中', label: '维修中' },
            { value: '试模完成', label: '试模完成' },
          ],
          rules: [requiredRule],
        },
      ],
      [
        {
          type: 'timer',
          label: '试模日期',
          key: 'trialDate',
          timerType: 'date',
          width: 8,
        },
        {
          type: 'inputSelect',
          label: '模房ID',
          key: 'mouldHouseId',
          width: 8,
          rules: [requiredRule],
          showKey: [
            { key: 'id', label: '模房编号' },
            { key: 'name', label: '模房名称' }
          ],
          remoteFunc: searchFunc('system/mould-house/list', 'id'),
          options: [],
          loading: false,
          tip: '-1 表示未维修', // ✅ 新增提示文字
        }
      ],
    ]
  }
})

// 表单绑定对象
const newSubmit = ref({
  mouldNumber: '',
  manufacturerId: '',
  trialDate: '',
  status: '',
  remark: '',
})

// 表格操作列
const operation = ref([
  {
    value: '编辑',
    func: (row) => {
      title.value = '编辑'
      newSubmit.value = { ...row }
      editDialogVisible.value = true
      nextTick(() => createFormRef.value.clearValidate())
    },
  },
])

// 分页与数据
const listData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载数据
const loadData = () => {
  getMouldList({
    pageNum: page.value,
    pageSize: pageSize.value,
    ...searchContent.value,
  }).then((res) => {
    // 数据处理
    listData.value = res.rows.map((item) => ({
      ...item,
      // mouldHouseId: item.mouldHouseId === -1 ? '未维修' : item.mouldHouseId
    }))
    total.value = res.total
  })
}

loadData()

const handlePageChange = (val: number) => {
  page.value = val
  loadData()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  loadData()
}

// 新增与编辑
const editDialogVisible = ref(false)
const title = ref('新增')
const createFormRef = ref()

// 点击“新增”按钮
const onCreate = () => {
  title.value = '新增'
  // 清空表单
  newSubmit.value = {
    mouldNumber: '',
    manufacturerId: '',
    trialDate: '',
    status: '',
    remark: '',
  }
  // 打开弹窗
  editDialogVisible.value = true

  // 清除上次的校验结果
  nextTick(() => {
    if (createFormRef.value) createFormRef.value.clearValidate()
  })
}

const handleSubmit = () => {
  createFormRef.value.validateForm((valid) => {
    if (!valid) return

    // 拷贝表单数据
    const payload = { ...newSubmit.value }


    // // 格式化日期字段（如果需要）
    // payload.mouldDesignTime = parseTime(payload.mouldDesignTime, '{y}-{m}-{d}')
    // payload.trialDate = parseTime(payload.trialDate, '{y}-{m}-{d}')

    // 根据状态选择接口
    const api = title.value === '编辑' ? updateMould : createMould

    // === ✅ 直接用 JSON 提交 ===
    api(payload).then((res) => {
      ElMessage.success(res.msg || '操作成功')
      editDialogVisible.value = false
      loadData()
    })
  })
}



// 删除
const DeleteFunc = (rows) => {
  if (!rows.length) return ElMessage.warning('请选择要删除的记录')
  const ids = rows.map((r) => r.id)
  messageBox(
    'warning',
    () => deleteMould(ids).then(() => loadData()),
    `成功删除 ${ids.length} 条记录`,
    '用户权限不足',
    `确认删除 ${ids.length} 条记录？`,
  )
}

// 导入
const importDialogVisible = ref(false)
const onImport = () => (importDialogVisible.value = true)
const handleUpload = (option) => {
  const formData = new FormData()
  formData.append('file', option.file)
  importMouldFile(formData).then((res) => {
    ElMessage.success(res.msg || '导入成功')
    importDialogVisible.value = false
    loadData()
  })
}

// 下载模板
const onDownloadTemplate = () => {
  getMouldTemplate().then((res) => downloadBinaryFile(res, '模具导入模板.xlsx'))
}

// 导出
const exportFunc = (rows) => {
  if (!rows.length) return ElMessage.warning('请选择要导出的记录')
  const ids = rows.map((r) => r.id).join(',')
  exportMould(ids).then((res) => downloadBinaryFile(res, '模具导出.xlsx'))
}

// 查询
const onSubmit = () => {
  page.value = 1
  loadData()
}
</script>
