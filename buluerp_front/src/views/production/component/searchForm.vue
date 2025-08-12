<template>
  <!-- <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>查询</span>
      </div>
    </template> -->

  <Form :data="data" :title="title" :onSubmit="onSubmit" :onCreate="onCreate" :onImport="onImport"
    :onDownloadTemplate="onDownloadTemplate" :searchForm="formState" :control="control" :formState="formState">
  </Form>
  <!-- </el-card> -->

  <el-dialog v-model="createDialogVisible" title="新建产品" width="500px">
    <el-form ref="createFormRef" :model="createForm" :rules="createFormRules" label-width="100px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="createForm.name" placeholder="请输入产品名称" />
      </el-form-item>
      <el-form-item label="内部编号" prop="innerId">
        <el-input v-model="createForm.innerId" placeholder="请输入内部编号" />
      </el-form-item>
      <el-form-item label="外部编号" prop="outerId">
        <el-input v-model="createForm.outerId" placeholder="请输入外部编号" />
      </el-form-item>
      <el-form-item label="产品图片" prop="image">
        <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeImageUpload"
          :on-change="handleImageChange">
          <div class="upload-box">
            <img v-if="createForm.image" :src="createForm.image" class="avatar" />
            <div v-else class="upload-placeholder">
              <el-icon>
                <Plus />
              </el-icon>
              <div style="margin-top: 4px; font-size: 12px; color: #999">点击上传</div>
            </div>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onCreateCancel">取消</el-button>
      <el-button type="primary" @click="handleCreateSubmit">提交</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="importDialogVisible" title="导入 Excel" width="400px">
    <el-upload class="upload-demo" drag :show-file-list="false" :before-upload="beforeUpload"
      :http-request="handleUpload" accept=".xlsx,.xls">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
      <template v-slot:tip>
        <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { createProduct, importProductFile, getProductTemplate } from '@/apis/products.js'
import { downloadBinaryFile } from '@/utils/file/base64'
import { messageBox } from '@/components/message/messageBox'
import Form from '@/components/form/Form.vue'

const emit = defineEmits(['search', 'created'])
defineProps(['control'])

// data: 表单数据
const data = reactive([
  [
    {
      label: '产品编码',
      type: 'input',
      key: 'productCode',
    },
    {
      label: '产品状态',
      type: 'select',
      key: 'productStatus',
      options: [
        { label: '设计中', value: 0 },
        { label: '已完成', value: 1 },
      ],
    },
    {
      label: '创建日期',
      type: 'timer',
      key: 'createDate',
      timerType: 'daterange',
    },
  ],
  [
    {
      label: '产品名称',
      type: 'input',
      key: 'productName',
    },
    {
      label: '创建人姓名',
      type: 'input',
      key: 'creatorName',
    },
  ],
])

const title = '查询'

// 表单状态
const formState = reactive({
  productCode: '',
  productStatus: '',
  createDate: [],
  productName: '',
  creatorName: '',
  otherSearch: '',
})

// 查询条件
const searchForm = ref({
  productCode: '',
  productStatus: '',
  createDate: [],
  productName: '',
  creatorName: '',
})

// 新建相关
const createDialogVisible = ref(false)
const createForm = reactive({
  name: '',
  innerId: '',
  outerId: '',
  image: '',
})

const createFormRef = ref<FormInstance>()
const createFormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  innerId: [{ required: true, message: '请输入内部编号', trigger: 'blur' }],
  outerId: [{ required: true, message: '请输入外部编号', trigger: 'blur' }],
  image: [{ required: true, message: '请上传产品图片', trigger: 'change' }],
}

const imageFile = ref<File | null>(null)
const importDialogVisible = ref(false)

// 方法
const onSubmit = () => {
  const params = {
    productCode: formState.productCode || '',
    productName: formState.productName || '',
    productStatus: formState.productStatus,
    creatorName: formState.creatorName || '',
    createDate: formState.createDate || [],
    otherSearch: formState.otherSearch || '',
  }
  emit('search', params)
}

const onCreate = () => {
  createDialogVisible.value = true
}

const onCreateCancel = () => {
  createDialogVisible.value = false
  resetCreateForm()
}

const onImport = () => {
  importDialogVisible.value = true
}

const handleCreateSubmit = async () => {
  const valid = await createFormRef.value?.validate().catch(() => false)
  if (!valid) return

  if (!imageFile.value) {
    messageBox('error', () => Promise.reject(), '', '请上传产品图片', '')
    return
  }

  const formData = new FormData()
  formData.append('name', createForm.name)
  formData.append('picture', imageFile.value)
  formData.append('innerId', createForm.innerId)
  formData.append('outerId', createForm.outerId)

  messageBox(
    'warning',
    () =>
      createProduct(formData).then((res) => {
        createDialogVisible.value = false
        resetCreateForm()
        emit('created')
        return Promise.resolve()
      }),
    '产品创建成功',
    '创建失败',
    '是否确认创建该产品？',
  )
}

const resetCreateForm = () => {
  createForm.name = ''
  createForm.image = ''
  createForm.outerId = ''
  createForm.innerId = ''
  imageFile.value = null
  createFormRef.value?.clearValidate?.()
}

const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isExcel) {
    messageBox('error', () => Promise.reject(), '', '只能上传 Excel 文件（xls/xlsx）', '')
    return false
  }
  if (!isLt5M) {
    messageBox('error', () => Promise.reject(), '', '文件大小不能超过 5MB', '')
    return false
  }
  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  messageBox(
    'warning',
    () =>
      importProductFile(formData).then((res) => {
        importDialogVisible.value = false
        return Promise.resolve()
      }),
    '导入成功',
    '导入失败',
    '确定要导入选中的 Excel 文件吗？',
  )
}

const onDownloadTemplate = async () => {
  try {
    const res = await getProductTemplate()
    downloadBinaryFile(
      res,
      '产品模板.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
  } catch (e) {
    messageBox('error', () => Promise.reject(), '', '下载失败', '')
  }
}

const beforeImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    messageBox('error', () => Promise.reject(), '', '只能上传图片文件', '')
    return false
  }

  if (!isLt2M) {
    messageBox('error', () => Promise.reject(), '', '图片大小不能超过 2MB', '')
    return false
  }

  imageFile.value = file
  const reader = new FileReader()
  reader.onload = () => {
    createForm.image = reader.result as string
  }
  reader.readAsDataURL(file)

  return false
}
</script>

<style scoped>
.avatar-uploader .upload-box {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
}
</style>