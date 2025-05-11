<template>
  <el-card style="width: 100%; margin: 0 20px;">
    <template #header>
      <div class="card-header">
        <span>查询</span>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="formState"
      label-width="100px"
      class="search-form"
    >
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
              <el-option label="设计中" value="doing" />
              <el-option label="已完成" value="done" />
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
        <el-col :span="6" style="text-align: right;">
          <el-space>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onClear">重置</el-button>
          </el-space>
        </el-col>
      </el-row>

      <!-- 第二行 -->
      <el-row :gutter="20" align="middle" style="margin-top: 16px;">
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
        <el-col :span="6" style="text-align: right;">
          <el-space>
            <el-button type="primary" @click="onCreate">新建</el-button>
            <el-button @click="onImport">导入</el-button>
          </el-space>
        </el-col>
      </el-row>

      <div style="text-align: right; margin-top: 8px;">
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
      <div class="el-upload__tip" slot="tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from "element-plus";


const emit = defineEmits(['search']) // 关键：用于发送查询参数到父组件

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
    id: Number(formState.productCode) || undefined,
    name: formState.productName || undefined,
  }
  emit('search', params)
}

const onClear = () => {
  formRef.value?.resetFields()
}

const onCreate = () => {
  console.log('点击新建')
}

const onImport = () => {
  importDialogVisible.value = true
}

// 文件校验（限制大小）
const beforeUpload = (file: File) => {
  const isExcel = file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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

// 上传处理（模拟/替换为真实接口）
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    // 替换为你自己的上传接口
    const res = await fetch('/api/import-excel', {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      ElMessage.success('导入成功')
      importDialogVisible.value = false
    } else {
      ElMessage.error('导入失败')
    }
  } catch (e) {
    ElMessage.error('上传出错')
  }
}

const onDownloadTemplate = () => {
  // 下载 Excel 模板，可以是静态文件或接口返回
  const link = document.createElement('a')
  link.href = '/template/import-template.xlsx' // 替换成你的模板文件路径
  link.download = '导入模板.xlsx'
  link.click()
}

</script>

<style scoped>
.search-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
