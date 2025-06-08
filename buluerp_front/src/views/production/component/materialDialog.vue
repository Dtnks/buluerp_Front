<template>
  <el-dialog
    :title="isEdit ? '编辑模具' : '新建模具'"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >

    <ImageUpload :initialUrl="imageUrl" :setFile="setDrawingFile" />

    <CustomForm
      :data="formConfig"
      :formState="formState"
      :formRef="formRef"
      :Formvalue="form"
    />

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import CustomForm from '@/components/form/CreateForm.vue' // 替换为你封装组件的路径
import ImageUpload from '@/components/upload/editUpload.vue'

const props = defineProps<{
  modelValue: boolean
  isEdit: boolean
  currentData?: Record<string, any>
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => (visible.value = val))
watch(() => visible.value, (val) => emit('update:modelValue', val))

const formRef = ref()
const formState = ref({})
const form = ref<Record<string, any>>({
  mouldNumber: '',
  specificationName: '',
  cavityCount: null,
  materialType: '',
  standardCode: '',
  singleWeight: null,
  mouldStatus: '',
  mouldManufacturer: '',
  cycleTime: null,
  sampleLocation: '',
  remarks: '',
  spareCode: '',
  drawingReferenceFile: null
})

const drawingFile = ref<File | null>(null)
const setDrawingFile = (file: File | null) => {
  drawingFile.value = file
  if (file) {
    form.value.drawingReferenceFile = ''  // 清除旧图片路径，避免提交旧图
  } else {
    form.value.drawingReferenceFile = null
    imageUrl.value = ''  // 删除图片时清空回显地址
  }
}


const imageUrl = ref('')

const formConfig = [
  [
    {
      label: '模具编号',
      key: 'mouldNumber',
      type: 'input',
      width: 8
    },{
      label: '规格名称',
      key: 'specificationName',
      type: 'input',
      width: 8
    },{
      label: '腔口数量',
      key: 'cavityCount',
      type: 'number',
      width: 8
    }
  ],
  [
    {
      label: '材料类型',
      key: 'materialType',
      type: 'input',
      width: 12
    },{
      label: '单重',
      key: 'singleWeight',
      type: 'number',
      width: 8
    }
  ],
  [
    {
      label: '模具状态',
      key: 'mouldStatus',
      type: 'input',
      width: 8
    },{
      label: '样品库位',
      key: 'sampleLocation',
      type: 'input',
      width: 8
    }
  ],
  [
    {
      label: '模具厂商',
      key: 'mouldManufacturer',
      type: 'input',
      width: 12
    },{
      label: '生产周期',
      key: 'cycleTime',
      type: 'number',
      width: 12
    }
  ],
  [
    {
      label: '备注',
      key: 'remarks',
      type: 'textarea',
      width: 12
    },{
      label: '备用编码',
      key: 'spareCode',
      type: 'input',
      width: 8
    }
  ],
]

watch(
  () => props.currentData,
  (data) => {
    if (data) {
      form.value = {
        mouldNumber: data.mouldNumber || '',
        id: data.id || '',
        specificationName: data.specificationName || '',
        cavityCount: data.cavityCount || null,
        materialType: data.materialType || '',
        standardCode: data.standardCode || '',
        singleWeight: data.singleWeight || null,
        mouldStatus: data.mouldStatus || '',
        mouldManufacturer: data.mouldManufacturer || '',
        cycleTime: data.cycleTime || null,
        sampleLocation: data.sampleLocation || '',
        remarks: data.remarks || '',
        spareCode: data.spareCode || '',
        drawingReferenceFile: data.drawingReference || null,
      }

      if (data.drawingReference) {
        imageUrl.value = getFullImageUrl(data.drawingReference)
        drawingFile.value = null  // 旧图片，不是新上传文件
      } else {
        imageUrl.value = ''
        drawingFile.value = null
      }
    }
  },
  { immediate: true }
)

const getFullImageUrl = (path: string) => {
  const BASE_IMAGE_URL = 'http://154.201.77.135:8080'
  return BASE_IMAGE_URL + path.replace('//', '/')
}

watch(
  () => form.value.drawingReferenceFile,
  (newFile) => {
    if (newFile instanceof File) {
      drawingFile.value = newFile
    }
  }
)

const handleClose = () => {
  visible.value = false
}

const handleSubmit = async () => {
  try {
    const formData = new FormData()

    for (const key in form.value) {
      if (key === 'drawingReferenceFile') {
        if (drawingFile.value) {
          // 新上传的图片
          formData.append('drawingReferenceFile', drawingFile.value)
        } else if (
          typeof form.value.drawingReferenceFile === 'string' &&
          form.value.drawingReferenceFile !== ''
        ) {
          // 旧图片路径，保持不变
          formData.append('drawingReference', form.value.drawingReferenceFile)
        }
        continue
      }

      const value = form.value[key]
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v))
      } else if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    }

    emit('submit', formData)
    handleClose()
  } catch (err) {
    console.error('表单提交失败:', err)
  }
}
</script>
