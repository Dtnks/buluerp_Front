<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { updateProduct } from '@/apis/products.js'
import { addMaterial, searchMaterial } from '@/apis/materials'
import { messageBox } from '@/components/message/messageBox' // 替换弹窗组件
import  uploadPicture  from '@/components/upload/editUpload.vue'

const props = defineProps<{
  detail: any
  materialData: any[]
  control: Array<object>
}>()

const tableData = ref<MaterialItem[]>([])
const dialogVisible = ref(false)
const editingIndex = ref<number | null>(null)
const materialFormRef = ref<FormInstance>()
const materialFormState = reactive<MaterialItem>({
  mouldNumber: 0,
  specificationName: '',
  materialType: '',
  standardCode: 0,
  singleWeight: 0,
})

const mainFormRef = ref<FormInstance>()
const mainFormState = reactive({
  productPrice: '',
  productName: '',
  productIntro: '',
  designStatus: 0,
})

const fileList = ref<{ url: string; raw?: File }[]>([])
const pictureFile = ref<File | null>(null)
const pictureUrl = ref('')

const setFile = (file: File | null) => {
  pictureFile.value = file
}

const BASE_URL = 'http://154.201.77.135:8080'

function resolveImageUrl(path: string) {
  if (!path) return ''
  return `${BASE_URL}${path.replace('//', '/')}`
}
const materialIds = ref<number[]>([])

watch(
  () => props.detail,
  async (val) => {
    if (val) {
      mainFormState.productName = val.name || ''
      mainFormState.designStatus = Number(val.designStatus ?? 0)
      if (val.pictureUrl) {
        pictureUrl.value = resolveImageUrl(val.pictureUrl) 
        pictureFile.value = null  
      }

      if (Array.isArray(val.materialIds) && val.materialIds.length > 0) {
        materialIds.value = [...val.materialIds]
        try {
          const idsStr = materialIds.value.join(',')
          const res = await searchMaterial({ ids: idsStr })
          tableData.value = res.data || []
        } catch (err) {
          console.error('获取物料信息失败', err)
          messageBox('error', null, '', '获取物料信息失败', '')
        }
      } else {
        materialIds.value = []
        tableData.value = []
      }
    }
  },
  { immediate: true }
)

const dummyRequest = (options: any) => {
  const { onSuccess } = options
  setTimeout(() => {
    onSuccess('ok')
  }, 1000)
}

const handleChange = (file: any) => {
  fileList.value = [
    {
      url: URL.createObjectURL(file.raw),
      raw: file.raw,
    },
  ]
}

const removeImage = (index: number) => {
  fileList.value.splice(index, 1)
}

const submitMainForm = async () => {
  if (!mainFormRef.value) return
  try {
    await mainFormRef.value.validate()

    // const rawFile = fileList.value[0]?.raw ?? null

    await updateProduct({
      id: Number(props.detail?.id),
      name: mainFormState.productName,
      designStatus: Number(mainFormState.designStatus),
      picture: pictureFile.value ?? null,
    })

    messageBox('success', null, '提交成功', '', '')
  } catch (err) {
    console.error('提交失败', err)
    messageBox('error', null, '', '提交失败', '')
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
  mouldNumber: number
  specificationName: string
  materialType: string
  standardCode: number
  singleWeight: number
}

const materialRules = reactive<FormRules>({
  mouldNumber: [{ required: true, message: '请输入模具编号', trigger: 'blur' }],
  specificationName: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  materialType: [{ required: true, message: '请输入料别', trigger: 'blur' }],
  standardCode: [{ required: true, message: '请输入标准编码', trigger: 'blur' }],
  singleWeight: [{ required: true, message: '请输入单重', trigger: 'blur' }],
})

const openDialog = () => {
  editingIndex.value = null
  resetMaterialForm()
  dialogVisible.value = true
}

const submitMaterial = async () => {
  await materialFormRef.value?.validate()
  const formData = new FormData()
  try {
    formData.append('mouldNumber', materialFormState.mouldNumber.toString())
    formData.append('specificationName', materialFormState.specificationName)
    formData.append('materialType', materialFormState.materialType)
    formData.append('standardCode', materialFormState.standardCode.toString())
    formData.append('singleWeight', materialFormState.singleWeight.toString())
    const res = await addMaterial(formData)
    const newId = res.data

    if (!newId) {
      throw new Error('新增物料返回无效 id')
    }

    const oldIds = props.detail.materialIds || []
    const newIds = [...oldIds, newId]

    await updateProduct({
      ...props.detail,
      materialIds: newIds,
    })

    const queryRes = await searchMaterial({ ids: newIds.join(',') })
    tableData.value = queryRes.data || []

    dialogVisible.value = false
    messageBox('success', null, '新增物料并关联产品成功', '', '')

    props.detail.materialIds = newIds
  } catch (err) {
    console.error('新建物料失败', err)
    messageBox('error', null, '', '新建物料失败', '')
  }
}

const onDelete = async (materialId: number) => {
  const deleteAction = async () => {
    const oldIds = props.detail.materialIds || []
    const newIds = oldIds.filter(id => id !== materialId)

    await updateProduct({
      ...props.detail,
      materialIds: newIds,
    })

    const queryRes = await searchMaterial({ ids: newIds.join(',') })
    tableData.value = queryRes.data || []
    props.detail.materialIds = newIds
  }

  messageBox(
    'warning',
    deleteAction,
    '删除物料并更新产品成功',
    '删除物料失败',
    '确认删除该物料吗？'
  )
}

const onEdit = (row: MaterialItem, index: number) => {
  editingIndex.value = index
  Object.assign(materialFormState, row)
  dialogVisible.value = true
}

const resetMaterialForm = () => {
  materialFormState.mouldNumber = 0
  materialFormState.specificationName = ''
  materialFormState.materialType = ''
  materialFormState.standardCode = 0
  materialFormState.singleWeight = 0
}

</script>

<template>
  <el-form ref="mainFormRef" :model="mainFormState" label-width="120px" class="greyBack">
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
          <el-form-item label="产品设计状态" prop="otherInfo">
            <el-select v-model="mainFormState.designStatus" placeholder="请选择">
              <el-option label="设计中" :value="0" />
              <el-option label="已完成" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="8">
          <el-form-item label="上传图片" prop="uploadImage">
            <uploadPicture :setFile="setFile" :initialUrl="pictureUrl" />
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

    <el-card>
      <template #header><div class="card-header">产品详情</div></template>

      <el-steps :active="1" align-center>
        <el-step title="填写产品组装物料信息" />
        <el-step title="填写产品包装信息" />
        <el-step title="完成" />
      </el-steps>

      <el-table :data="tableData" style="width: 100%" max-height="400">
        <el-table-column prop="mouldNumber" label="模具编号" width="150" />
        <el-table-column prop="specificationName" label="规格名称" width="150" />
        <el-table-column prop="materialType" label="料别" width="120" />
        <el-table-column prop="standardCode" label="常规编码" width="120" />
        <el-table-column prop="singleWeight" label="单重" width="150" />
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="onEdit(scope.row, scope.$index)" :disabled="control[1].disabled"
              >编辑</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="onDelete(scope.row.id)"
              :disabled="control[1].disabled"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-button class="mt-4" style="width: 100%" @click="openDialog"  :disabled="control[1].disabled">新增物料</el-button>
      <div style="text-align: right; margin-top: 20px">
        <el-space>
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="submitMainForm" :disabled="control[1].disabled">提交</el-button>
          <el-button @click="onClear">重置</el-button>
        </el-space>
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" title="新建物料" width="600px">
      <el-form
        ref="materialFormRef"
        :model="materialFormState"
        label-width="100px"
        :rules="materialRules"
      >
        <el-form-item label="模具编号" prop="mouldNumber">
          <el-input v-model="materialFormState.mouldNumber" placeholder="请输入模具编号" />
        </el-form-item>
        <el-form-item label="规格名称" prop="specificationName">
          <el-input v-model="materialFormState.specificationName" placeholder="请输入规格名称" />
        </el-form-item>
        <el-form-item label="料别" prop="materialType">
          <el-input v-model="materialFormState.materialType" placeholder="请输入料别" />
        </el-form-item>
        <el-form-item label="常规编码" prop="standardCode">
          <el-input v-model="materialFormState.standardCode" placeholder="请输入常规编码" />
        </el-form-item>
        <el-form-item label="单重" prop="singleWeight">
          <el-input v-model="materialFormState.singleWeight" placeholder="请输入单重" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitMaterial">确定</el-button>
      </template>
    </el-dialog>
  </el-form>
</template>

<style scoped>
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
