<template>
  <el-dialog
    title="新建物料"
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
import { ref, watch, reactive } from 'vue'
import CustomForm from '@/components/form/CreateForm.vue'
import ImageUpload from '@/components/upload/editUpload.vue'
import { Delete } from '@element-plus/icons-vue'
import { searchFunc } from '@/utils/search/search'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => (visible.value = val))
watch(() => visible.value, (val) => emit('update:modelValue', val))

const formRef = ref<any>(null)
const formState = ref({})
// 使用 reactive 来创建表单对象，不需要 .value
const form = reactive({
  cavityCount: null,
  cycleTime: null,
  drawingReferenceFile: null,
  materialType: '',
  mouldStatus: '',
  mouldManufacturer: '',
  mouldNumber: '',
  sampleLocation: '',
  remarks: '',
  specificationName: '',
  standardCode: '',
  singleWeight: null,
  spareCode: '',
  deleteDrawingReference: false
})

const drawingFile = ref<File | null>(null)
const imageUrl = ref('')

const setDrawingFile = (file: File | null) => {
  drawingFile.value = file
  if (file) {
    form.drawingReferenceFile = ''
    form.deleteDrawingReference = false
  } else {
    form.drawingReferenceFile = null
    form.deleteDrawingReference = true
    imageUrl.value = ''
  }
}

const removeImage = () => setDrawingFile(null)

const formConfig = reactive([
  [
    { label: '模具编号', key: 'mouldNumber', type: 'input', width: 8, required: true, rules: [{ required: true, message: '请输入模具编号', trigger: 'blur' }] },
    { label: '规格名称', key: 'specificationName', type: 'input', width: 8 },
    { label: '腔口数量', key: 'cavityCount', type: 'number', width: 8 }
  ],
  [
    { type: 'inputSelect', label: '料型', key: 'materialType', width: 12,
      remoteFunc: searchFunc('system/material-type/list', 'name'),
      options: reactive([]),
      loading: ref(false),
      showKey:[{key:'name',label:"名称"},{key:'colorCode',label:"颜色编码"},{key:'colorWeight',label:"色粉重量"}],
      rules: [{ required: true, message: '请输入料型', trigger: 'blur' }]
    },
    { label: '单重', key: 'singleWeight', type: 'number', width: 12 }
  ],
  [
    { label: '样品库位', key: 'sampleLocation', type: 'input', width: 12 },
    { label: '常规编码', key: 'standardCode', type: 'input', width: 12, rules: [{number: true, message: '请输入数字',trigger:'blur'}] }
  ],
  [
    { label: '生产周期', key: 'cycleTime', type: 'number', width: 12 },
    { label: '产品ID', key: 'productCode', type: 'input', width: 12 }
  ],
  [
    { label: '备注', key: 'remarks', type: 'textarea', width: 12 },
    { label: '备用编码', key: 'spareCode', type: 'input', width: 12 }
  ]
])

const handleClose = () => {
  // 重置 form 对象，不需要 .value
  Object.assign(form, {
    cavityCount: null,
    cycleTime: null,
    drawingReferenceFile: null,
    materialType: '',
    mouldStatus: '',
    mouldManufacturer: '',
    mouldNumber: '',
    sampleLocation: '',
    remarks: '',
    specificationName: '',
    standardCode: '',
    singleWeight: null,
    spareCode: '',
    deleteDrawingReference: false
  })

  imageUrl.value = ''
  drawingFile.value = null
  visible.value = false
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validateForm((valid: boolean) => {
    if (!valid) return

    const formData = new FormData()
    for (const key in form) {
      if (key === 'drawingReferenceFile') {
        if (drawingFile.value) formData.append('drawingReferenceFile', drawingFile.value)
        else if (typeof form.drawingReferenceFile === 'string') formData.append('drawingReference', form.drawingReferenceFile)
        continue
      }
      if (form.deleteDrawingReference) formData.append('deleteDrawingReference', 'true')
      const value = form[key]
      if (Array.isArray(value)) value.forEach(v => formData.append(key, v))
      else if (value !== null && value !== undefined) formData.append(key, value)
    }

    emit('submit', formData)
    handleClose()
  })
}
</script>
