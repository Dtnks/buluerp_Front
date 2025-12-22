<template>
  <el-dialog
    title="编辑物料"
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
import { ref, watch, nextTick , reactive} from 'vue'
import CustomForm from '@/components/form/CreateForm.vue'
import ImageUpload from '@/components/upload/editUpload.vue'
import { Delete } from '@element-plus/icons-vue'
import { searchFunc } from '@/utils/search/search'
import { getFullImageUrl } from '@/utils/image/getUrl'

const props = defineProps<{ modelValue: boolean, currentData: Record<string, any> }>()
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => (visible.value = val))
watch(() => visible.value, (val) => emit('update:modelValue', val))

const formRef = ref<any>(null)
const formState = ref({})
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
    form.drawingReferenceFile = null
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
    { label: '模具编号', key: 'mouldNumber', type: 'input', width: 8, required: true,
      rules: [{ required: true, message: '请输入模具编号', trigger: 'blur' }]
    },
    { label: '规格名称', key: 'specificationName', type: 'input', width: 8 },
    { label: '腔口数量', key: 'cavityCount', type: 'number', width: 8 }
  ],
  [
    { type: 'inputSelect', label: '料型', key: 'materialType', width: 12,
      remoteFunc: searchFunc('system/material-type/list', 'name'),
      options: reactive([]),   // <--- 改为响应式
      loading: ref(false),     // <--- 改为响应式
      showKey:[{key:'name',label:"名称"},{key:'colorCode',label:"颜色编码"},{key:'colorWeight',label:"色粉重量"}],
      rules: [{ required: true, message: '请输入模具编号', trigger: 'blur' }]
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
// 打开编辑弹窗时回显数据 + 初始化远程选项
watch(visible, async (val) => {
  if (val && props.currentData) {
    await nextTick()
    Object.assign(form, props.currentData)
    // 图片回显
    if (props.currentData.drawingReference) {
      imageUrl.value = getFullImageUrl(props.currentData.drawingReference)
      drawingFile.value = null
      form.deleteDrawingReference = false
    } else {
      imageUrl.value = ''
      drawingFile.value = null
      form.deleteDrawingReference = true
    }
  }
})

const handleClose = () => {
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
        else if (typeof form.drawingReferenceFile === 'string') formData.append('drawingReference', form.value.drawingReferenceFile)
        continue
      }

      const value = form[key]
      if (Array.isArray(value)) value.forEach(v => formData.append(key, v))
      else if (value !== null && value !== undefined) formData.append(key, value)
    }
    if (form.deleteDrawingReference) {
        formData.append('deleteDrawingReference', 'true')
      }

    emit('submit', formData)
    handleClose()
  })
}
</script>
