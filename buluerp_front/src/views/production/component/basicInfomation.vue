<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import axios from 'axios'

const props = defineProps<{
  detail: any
  materialData: any[]
}>()

const mainFormRef = ref<FormInstance>()
const mainFormState = reactive({
  productPrice: '',
  productName: '',
  productIntro: '',
  otherInfo: '',
})

// ✅ 关键：包括 raw 原始文件
const fileList = ref<{ url: string; raw?: File }[]>([])

watch(() => props.detail, (val) => {
  if (val) {
    mainFormState.productName = val.name || ''
    mainFormState.otherInfo = val.designStatus || ''
  }
}, { immediate: true })

watch(() => props.materialData, (val) => {
  if (val) {
    tableData.value = val
  }
}, { immediate: true })

const dummyRequest = (options: any) => {
  const { onSuccess } = options
  setTimeout(() => {
    onSuccess('ok')
  }, 1000)
}

// ✅ 关键：存储 raw 文件
const handleChange = (file: any) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    fileList.value = [{
      url: e.target?.result as string,
      raw: file.raw,
    }]
  }
  reader.readAsDataURL(file.raw)
}

const removeImage = (index: number) => {
  fileList.value.splice(index, 1)
}

const submitMainForm = async () => {
  if (!mainFormRef.value) return
  await mainFormRef.value.validate()

  const formData = new FormData()
  formData.append('id', props.detail?.id)
  formData.append('name', mainFormState.productName)
  // formData.append('productIntro', mainFormState.productIntro)
  // formData.append('productPrice', mainFormState.productPrice)
  // formData.append('otherInfo', mainFormState.otherInfo)

  const rawFile = fileList.value[0]?.raw
  if (rawFile) {
    formData.append('picture', rawFile)
  }

  try {
    const res = await axios.put('http://154.201.77.135:8080/system/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    ElMessage.success('提交成功')
  } catch (err) {
    console.error('提交失败', err)
    ElMessage.error('提交失败')
  }
}

const onClear = () => {
  mainFormRef.value?.resetFields()
  fileList.value = []
}

const onCancel = () => {
  console.log('取消按钮点击')
}

interface MaterialItem {
  materialCode: string
  materialName: string
  color: string
  size: string
  source: string
  quantity: number
}

const tableData = ref<MaterialItem[]>([])
const dialogVisible = ref(false)
const editingIndex = ref<number | null>(null)
const materialFormRef = ref<FormInstance>()
const materialFormState = reactive<MaterialItem>({
  materialCode: '',
  materialName: '',
  color: '',
  size: '',
  source: '',
  quantity: 1,
})

const materialRules = reactive<FormRules>({
  materialCode: [{ required: true, message: '请输入物料编号', trigger: 'blur' }],
  materialName: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
  color: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
  size: [{ required: true, message: '请输入物料尺寸', trigger: 'blur' }],
  source: [{ required: true, message: '请输入物料来源', trigger: 'blur' }],
  quantity: [{ required: true, type: 'number', message: '请输入数量', trigger: 'change' }],
})

const openDialog = () => {
  editingIndex.value = null
  resetMaterialForm()
  dialogVisible.value = true
}

const submitMaterial = async () => {
  await materialFormRef.value?.validate()
  if (editingIndex.value !== null) {
    tableData.value.splice(editingIndex.value, 1, { ...materialFormState })
    ElMessage.success('编辑成功')
  } else {
    tableData.value.push({ ...materialFormState })
    ElMessage.success('新增成功')
  }
  dialogVisible.value = false
}

const onDelete = (index: number) => {
  tableData.value.splice(index, 1)
  ElMessage.success('删除成功')
}

const onEdit = (row: MaterialItem, index: number) => {
  editingIndex.value = index
  Object.assign(materialFormState, row)
  dialogVisible.value = true
}

const resetMaterialForm = () => {
  materialFormState.materialCode = ''
  materialFormState.materialName = ''
  materialFormState.color = ''
  materialFormState.size = ''
  materialFormState.source = ''
  materialFormState.quantity = 1
}

const active = ref(1)
</script>

<template>
  <el-form ref="mainFormRef" :model="mainFormState" label-width="120px" class="search-form">
    <el-card>
      <template #header><div class="card-header">业务订单基础信息</div></template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品编码">
            <el-text line-clamp="2">{{ props.detail?.id || '-' }}</el-text>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建日期">
            <el-text line-clamp="2">{{ props.detail?.createTime || '-' }}</el-text>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品定价" prop="productPrice">
            <el-input v-model="mainFormState.productPrice" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="mainFormState.productName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品介绍" prop="productIntro">
            <el-input v-model="mainFormState.productIntro" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="其他基本信息" prop="otherInfo">
            <el-select v-model="mainFormState.otherInfo" placeholder="请选择">
              <el-option label="设计中" value="doing" />
              <el-option label="已完成" value="done" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <el-form-item label="上传图片" prop="uploadImage">
            <el-upload
              class="upload-demo"
              action="#"
              :http-request="dummyRequest"
              :show-file-list="false"
              :on-change="handleChange"
            >
              <el-button icon="el-icon-upload">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <div class="preview-container">
            <div v-for="(item, index) in fileList" :key="index" class="preview-item">
              <img :src="item.url" alt="预览" class="preview-image" />
              <el-button type="danger" size="small" @click="removeImage(index)">删除</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-divider></el-divider>

    <el-card>
      <template #header><div class="card-header">产品详情</div></template>

      <el-steps :active="1" align-center>
        <el-step title="填写产品组装物料信息" />
        <el-step title="填写产品包装信息" />
        <el-step title="完成" />
      </el-steps>

      <el-table :data="tableData" style="width: 100%" max-height="400">
        <el-table-column prop="materialCode" label="物料编号" width="150" />
        <el-table-column prop="materialName" label="物料名称" width="150" />
        <el-table-column prop="color" label="颜色" width="120" />
        <el-table-column prop="size" label="物料尺寸" width="120" />
        <el-table-column prop="source" label="物料来源" width="150" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="onEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button link type="danger" size="small" @click="onDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button class="mt-4" style="width: 100%" @click="openDialog">新增物料</el-button>

      <el-dialog v-model="dialogVisible" title="新建物料" width="600px">
        <el-form ref="materialFormRef" :model="materialFormState" label-width="100px" :rules="materialRules">
          <el-form-item label="物料编号" prop="materialCode">
            <el-input v-model="materialFormState.materialCode" placeholder="请输入物料编号" />
          </el-form-item>
          <el-form-item label="物料名称" prop="materialName">
            <el-input v-model="materialFormState.materialName" placeholder="请输入物料名称" />
          </el-form-item>
          <el-form-item label="颜色" prop="color">
            <el-input v-model="materialFormState.color" placeholder="请输入颜色" />
          </el-form-item>
          <el-form-item label="物料尺寸" prop="size">
            <el-input v-model="materialFormState.size" placeholder="请输入物料尺寸" />
          </el-form-item>
          <el-form-item label="物料来源" prop="source">
            <el-input v-model="materialFormState.source" placeholder="请输入物料来源" />
          </el-form-item>
          <el-form-item label="数量" prop="quantity">
            <el-input-number v-model="materialFormState.quantity" :min="1" />
          </el-form-item>
        </el-form>

        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMaterial">确定</el-button>
        </template>
      </el-dialog>
    </el-card>

    <div style="text-align: right; margin-top: 20px;">
      <el-space>
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="submitMainForm">提交</el-button>
        <el-button @click="onClear">重置</el-button>
      </el-space>
    </div>
  </el-form>
</template>

<style scoped>
.search-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.card-header {
  font-weight: bold;
  font-size: 16px;
}
.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.preview-item {
  width: 120px;
  text-align: center;
}
.preview-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.mt-4 {
  margin-top: 16px;
}
</style>
