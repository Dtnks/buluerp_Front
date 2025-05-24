<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>查询</span>
      </div>
    </template>

    <el-form ref="formRef" :model="formState" label-width="100px" class="search-form">
      <!-- 第一行 -->
      <el-row :gutter="20" align="middle">
        <el-col :span="6">
          <el-form-item label="产品编码" prop="productCode">
            <el-input v-model.number="formState.productCode" placeholder="请输入产品编码" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品状态" prop="productStatus">
            <el-select v-model="formState.productStatus" placeholder="请选择产品状态">
              <el-option label="设计中" value="0" />
              <el-option label="已完成" value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建日期" prop="createDate">
            <el-date-picker
              v-model="formState.createDate"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-space>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onClear">重置</el-button>
          </el-space>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20" align="middle" style="margin-top: 16px">
        <el-col :span="6">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="formState.productName" placeholder="请输入产品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创建人姓名" prop="creatorName">
            <el-input v-model="formState.creatorName" placeholder="请输入创建人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="其他搜索" prop="otherSearch">
            <el-input v-model="formState.otherSearch" placeholder="请输入其他搜索条件" />
          </el-form-item>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-space>
            <el-button type="primary" @click="onCreate">新建</el-button>
            <el-button @click="onImport">导入</el-button>
          </el-space>
        </el-col>
      </el-row>

      <div style="text-align: right; margin-top: 8px">
        <el-link type="primary" @click="onDownloadTemplate">下载导入模板</el-link>
      </div>
    </el-form>
  </el-card>
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
      <template v-slot:tip>
        <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
      </template>
    </el-upload>
  </el-dialog>
  <el-dialog v-model="createDialogVisible" title="新建产品" width="500px">
    <el-form ref="createFormRef" :model="createForm" :rules="createFormRules" label-width="100px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="createForm.name" placeholder="请输入产品名称" />
      </el-form-item>

      <el-form-item label="产品图片" prop="image">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="beforeImageUpload"
          :on-change="handleImageChange"
        >
          <div class="upload-box">
            <img v-if="createForm.image" :src="createForm.image" class="avatar" />
            <div v-else class="upload-placeholder">
              <el-icon><Plus /></el-icon>
              <div style="margin-top: 4px; font-size: 12px; color: #999">点击上传</div>
            </div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="材料ID" prop="materialIds">
        <el-select
          v-model="createForm.materialIds"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请输入材料ID，按回车确认"
        >
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="onCreateCancel">取消</el-button>
      <el-button type="primary" @click="handleCreateSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { createProduct, importProductFile } from '@/apis/products.js'

const emit = defineEmits(['search', 'created'])

const createDialogVisible = ref(false)
const createForm = reactive({
  name: '',
  image: '',
  materialIds: [] as number[],
})

const createFormRef = ref<FormInstance>()
const createFormRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  image: [{ required: true, message: '请上传产品图片', trigger: 'change' }],
  materialIds: [
    {
      required: true,
      type: 'array',
      min: 1,
      message: '请至少输入一个原材料 ID',
      trigger: 'change',
    },
  ],
}

const imageFile = ref<File | null>(null)

const handleCreateSubmit = async () => {
  const valid = await createFormRef.value?.validate().catch(() => false)
  if (!valid) return

  if (!imageFile.value) {
    ElMessage.error('请上传产品图片')
    return
  }

  try {
    const formData = new FormData()
    formData.append('name', createForm.name)
    formData.append('picture', imageFile.value)

    createForm.materialIds.forEach((id) => {
      formData.append('materialIds', id) // ✅ 正确传数组形式
    })

    await createProduct(formData)

    ElMessage.success('产品创建成功')
    createDialogVisible.value = false
    resetCreateForm()
    emit('created')
  } catch (e) {
    ElMessage.error('创建失败')
  }
}

const resetCreateForm = () => {
  createForm.name = ''
  createForm.image = ''
  createForm.materialIds = []
  imageFile.value = null
  createFormRef.value?.clearValidate?.()
}

const formRef = ref<FormInstance>()
const formState = reactive({
  productCode: '',
  productStatus: '',
  createDate: [],
  productName: '',
  creatorName: '',
  otherSearch: '',
})

const importDialogVisible = ref(false)

const onSubmit = () => {
  const params = {
    productCode: formState.productCode || '',
    productName: formState.productName || '',
    productStatus: formState.productStatus || '',
    creatorName: formState.creatorName || '',
    createDate: formState.createDate || [],
    otherSearch: formState.otherSearch || '',
  }
  console.log('onSubmit params:', params)
  emit('search', params)
}

const onClear = () => {
  formRef.value?.resetFields()
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

// 文件校验（限制大小）
const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件（xls/xlsx）')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB')
    return false
  }
  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    const res = await importProductFile(formData)
    console.log(res)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
  } catch (e) {
    ElMessage.error('导入失败')
  }
}

const onDownloadTemplate = () => {
  // 下载 Excel 模板，可以是静态文件或接口返回
  const link = document.createElement('a')
  link.href = '/template/import-template.xlsx' // 替换成你的模板文件路径
  link.download = '导入模板.xlsx'
  link.click()
}

const beforeImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB')
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
.search-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

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
