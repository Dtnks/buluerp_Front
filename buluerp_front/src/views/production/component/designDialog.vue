<template>
  <el-dialog
    :title="isEdit ? '编辑模具' : '新建模具'"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >
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
const setDrawingFile = (file: File) => {
  drawingFile.value = file
  form.value.drawingReferenceFile = file
}

const imageUrl = ref('')

const formConfig = [
  [
    {
      label: '胶件图引',
      key: 'drawingReferenceFile',
      type: 'image',
      width: 24
    }
  ],
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
      label: '腔口数量',
      key: 'cavityCount',
      type: 'number',
      width: 8
    }
  ],
  [
    {
      label: '单重',
      key: 'singleWeight',
      type: 'number',
      width: 8
    },{
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
        drawingReferenceFile: null
      }

      drawingFile.value = null

      if (data.drawingReference) {
        imageUrl.value = getFullImageUrl(data.drawingReference)
      } else {
        imageUrl.value = ''
      }
    }
  },
  { immediate: true }
)

const getFullImageUrl = (path: string) => {
  const BASE_IMAGE_URL = 'http://154.201.77.135:8080'
  return BASE_IMAGE_URL + path.replace('//', '/')
}

const handleClose = () => {
  visible.value = false
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate?.()

    const formData = new FormData()
    for (const key in form.value) {
      formData.append(key, form.value[key])
    }

    emit('submit', formData)
    handleClose()
  } catch (err) {
    console.error('校验失败', err)
  }
}
</script>
