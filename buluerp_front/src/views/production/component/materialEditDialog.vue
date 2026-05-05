<template>
  <el-dialog
    title="编辑物料"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >
    <div style="display: flex; gap: 20px; margin-bottom: 16px;">
      <!-- 图片上传 -->
      <div style="position: relative; display: inline-block;">
        <ImageUpload v-if="visible" :initialUrl="imageUrl" :setFile="setDrawingFile" />
        <el-button
          v-if="imageUrl"
          type="danger"
          size="small"
          style="position: absolute; top: 4px; right: 4px; z-index: 0;"
          @click="removeImage"
          circle
        ><el-icon><Delete /></el-icon></el-button>
      </div>

      <!-- STP 模型上传 -->
      <div style="position: relative; display: inline-block;">
        <StpUpload v-if="visible" :initialUrl="stpUrl" :setFile="setStpFile" />
        <el-button
          v-if="stpUrl"
          type="danger"
          size="small"
          style="position: absolute; top: 4px; right: 4px; z-index: 0;"
          @click="removeStp"
          circle
        ><el-icon><Delete /></el-icon></el-button>
      </div>
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
import StpUpload from '@/components/upload/stpUpload.vue'
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
  cavityCount: null,//腔口数量
  cycleTime: null,//生产周期
  drawingReferenceFile: null,//样例图
  modelFile: null,//STP文件
  materialType: '',//料别
  materialCode: '',//物料编码
  materialName: '',//物料名称
  unit: '',//单位
  // mouldStatus: '',
  // mouldManufacturer: '',
  mouldNumber: '',//模具编号
  sampleLocation: '',//样品库位,
  remarks: '',//备注
  specificationName: '',//规格名称
  standardCode: '',//常规编码
  singleWeight: null,//单重
  // spareCode: '',
  deleteDrawingReference: false,
  deleteStpReference: false,
  // productCode: ''
})
const drawingFile = ref<File | null>(null)
const imageUrl = ref('')

const stpFile = ref<File | null>(null)
const stpUrl = ref('')

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

const setStpFile = (file: File | null) => {
  stpFile.value = file
  if (file) {
    form.modelFile = null
    form.deleteStpReference = false
  } else {
    form.modelFile = null
    form.deleteStpReference = true
    stpUrl.value = ''
  }
}

const removeImage = () => setDrawingFile(null)
const removeStp = () => setStpFile(null)
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
    { label: '物料编码', key: 'materialCode', type: 'input', width: 12, required: true, rules: [{ required: true, message: '请输入物料编码', trigger: 'blur' }] },
    { label: '物料名称', key: 'materialName', type: 'input', width: 12, required: true, rules: [{ required: true, message: '请输入物料名称', trigger: 'blur' }] },
  ],
  [
    { label: '样品库位', key: 'sampleLocation', type: 'input', width: 12 },
    { label: '常规编码', key: 'standardCode', type: 'input', width: 12, rules: [{number: true, message: '请输入数字',trigger:'blur'}] }
  ],
  [
    { label: '备注', key: 'remarks', type: 'textarea', width: 12 },
    { label: '生产周期', key: 'cycleTime', type: 'number', width: 12 },
  ],
  [
    { label: '单位', key: 'unit', type: 'number', width: 12 },
  ]
])
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

    // STP 模型回显/清空，避免沿用上一次打开弹窗时的缓存文件名
    if (props.currentData.modelFile) {
      stpUrl.value = getFullImageUrl(props.currentData.modelFile)
      stpFile.value = null
      form.modelFile = props.currentData.modelFile
      form.deleteStpReference = false
    } else {
      stpUrl.value = ''
      stpFile.value = null
      form.modelFile = null
      form.deleteStpReference = true
    }
  }
})

const handleClose = () => {
  stpUrl.value = ''
  stpFile.value = null
  form.modelFile = null
  form.deleteStpReference = false
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

      if (key === 'modelUrl') {
        if (stpFile.value) formData.append('modelFile', stpFile.value)
        else if (typeof form.modelFile === 'string') formData.append('modelFile', form.modelFile)
        continue
      }

      const value = form[key]
      if (Array.isArray(value)) value.forEach(v => formData.append(key, v))
      else if (value !== null && value !== undefined && key !== 'deleteDrawingReference' && key !== 'deleteStpReference') formData.append(key, value)
    }
    
    if (form.deleteDrawingReference) formData.append('deleteDrawingReference', 'true')
    if (form.deleteStpReference) formData.append('deleteStpReference', 'true')

    emit('submit', formData)
    handleClose()
  })
}
</script>
