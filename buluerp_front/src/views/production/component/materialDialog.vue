<template>
  <el-dialog
    :title="isEdit ? '编辑模具' : '新建模具'"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >

    <div style="position: relative; display: inline-block; margin-bottom: 16px;">
      <ImageUpload :initialUrl="imageUrl" :setFile="setDrawingFile" />

      <el-button
        v-if="imageUrl"
        type="danger"
        size="small"
        style="position: absolute; top: 4px; right: 4px; z-index: 0;"
        @click="removeImage"
        circle
      ><el-icon><Delete /></el-icon></el-button>
    </div>

      <CustomForm
        ref="formRef"
        :data="formConfig"
        :formState="formState"
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
import { getFullImageUrl } from '@/utils/image/getUrl'
import { Delete } from '@element-plus/icons-vue'
import { number } from 'echarts'

const props = defineProps<{
  modelValue: boolean
  isEdit: boolean
  currentData?: Record<string, any>
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => (visible.value = val))
watch(() => visible.value, (val) => emit('update:modelValue', val))

const formRef = ref<any>(null)
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
  drawingReferenceFile: null,
  deleteDrawingReference: false
})

const drawingFile = ref<File | null>(null)
const setDrawingFile = (file: File | null) => {
  drawingFile.value = file
  if (file) {
    form.value.drawingReferenceFile = ''
    form.value.deleteDrawingReference = false  // 新图上传，不删除旧图
  } else {
    form.value.drawingReferenceFile = null
    form.value.deleteDrawingReference = true   // 删除图片
    imageUrl.value = ''
  }
}



const imageUrl = ref('')

const formConfig = [
  [
    {
      label: '模具编号',
      key: 'mouldNumber',
      type: 'input',
      width: 8,
      required: true,
      rules: [{ required: true, message: '请输入模具编号', trigger: 'blur' }]
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
      width: 12,
      required: true,
      rules: [{ required: true, message: '请输入模具编号', trigger: 'blur' }]
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
    },{
      label: '常规编码',
      key: 'standardCode',
      type: 'input',
      width: 8,
      rules: [{number: true, message: '请输入数字',trigger:'blur'}]
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
        drawingFile.value = null
        form.value.deleteDrawingReference = false  // 回显时不删除
      } else {
        imageUrl.value = ''
        drawingFile.value = null
        form.value.deleteDrawingReference = false
      }

    }
  },
  { immediate: true }
)

// const getFullImageUrl = (path: string) => {
//   const BASE_IMAGE_URL = 'http://154.201.77.135:8080'
//   return BASE_IMAGE_URL + path.replace('//', '/')
// }

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
const removeImage = () => {
  setDrawingFile(null)
}

const handleSubmit = () => {
  if (!formRef.value) return

  // 使用回调方式
  formRef.value.validateForm((valid: boolean) => {
    if (!valid) return

    const formData = new FormData()

    for (const key in form.value) {
      if (key === 'drawingReferenceFile') {
        if (drawingFile.value) {
          formData.append('drawingReferenceFile', drawingFile.value)
        } else if (
          typeof form.value.drawingReferenceFile === 'string' &&
          form.value.drawingReferenceFile !== ''
        ) {
          formData.append('drawingReference', form.value.drawingReferenceFile)
        }
        continue
      }

      if (form.value.deleteDrawingReference) {
        formData.append('deleteDrawingReference', 'true')
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
  })
}


</script>
