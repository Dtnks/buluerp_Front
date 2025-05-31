<template>
  <el-dialog
    :title="isEdit ? '编辑模具' : '新建模具'"
    v-model="visible"
    width="600px"
    @close="handleClose"
  >
    <el-form
      :model="form"
      ref="formRef"
      label-width="120px"
      :rules="rules"
      status-icon
    >
      <el-form-item label="胶件图引" prop="drawingReferenceFile">
        <ImageUpload :setFile="setDrawingFile" :initial-url="imageUrl" />
      </el-form-item>
      <el-form-item label="模具编号" prop="mouldNumber">
        <el-input v-model="form.mouldNumber" />
      </el-form-item>
      <el-form-item label="规格名称" prop="specificationName">
        <el-input v-model="form.specificationName" />
      </el-form-item>
      <el-form-item label="腔口数量" prop="cavityCount">
        <el-input-number v-model="form.cavityCount" :min="1" style="width: 100%" />
      </el-form-item>
      <el-form-item label="材料类型" prop="materialType">
        <el-input v-model="form.materialType" />
      </el-form-item>
      <el-form-item label="常规编码" prop="standardCode">
        <el-input v-model="form.standardCode" />
      </el-form-item>
      <el-form-item label="单重" prop="singleWeight">
        <el-input-number v-model="form.singleWeight" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="模具状态" prop="mouldStatus">
        <el-input v-model="form.mouldStatus" />
      </el-form-item>
      <el-form-item label="模具厂商" prop="mouldManufacturer">
        <el-input v-model="form.mouldManufacturer" />
      </el-form-item>
      <el-form-item label="生产周期" prop="cycleTime">
        <el-input-number v-model="form.cycleTime" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="样品库位" prop="sampleLocation">
        <el-input v-model="form.sampleLocation" />
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input type="textarea" v-model="form.remarks" />
      </el-form-item>
      <el-form-item label="备用编码" prop="spareCode">
        <el-input v-model="form.spareCode" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import ImageUpload from '@/components/upload/editUpload.vue'
const props = defineProps<{
  modelValue: boolean
  isEdit: boolean
  currentData?: Record<string, any>
}>()

const drawingFile = ref<File | null>(null)
const setDrawingFile = (file: File) => {
  drawingFile.value = file
}

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (val) => (visible.value = val))
watch(() => visible.value, (val) => emit('update:modelValue', val))
const imageUrl = ref('')

const formRef = ref()
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
})

const rules = {
  specificationName: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
  mouldNumber: [{ required: true, message: '请输入模具编号', trigger: 'blur' }],
}

watch(
  () => props.currentData,
  (data) => {
    if (data) {
      const {
        mouldNumber,
        id,
        specificationName,
        cavityCount,
        materialType,
        standardCode,
        singleWeight,
        mouldStatus,
        mouldManufacturer,
        cycleTime,
        sampleLocation,
        remarks,
        spareCode,
        drawingReference
      } = data

      form.value = {
        mouldNumber,
        id,
        specificationName,
        cavityCount,
        materialType,
        standardCode,
        singleWeight,
        mouldStatus,
        mouldManufacturer,
        cycleTime,
        sampleLocation,
        remarks,
        spareCode,
      }

      drawingFile.value = null
      
      if (drawingReference) {
        imageUrl.value = getFullImageUrl(drawingReference)
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
    await formRef.value.validate()

    const formData = new FormData()
    for (const key in form.value) {
      formData.append(key, form.value[key])
    }

    if (drawingFile.value) {
      formData.append('drawingReferenceFile', drawingFile.value)
    }

    emit('submit', formData)
    handleClose()
  } catch (err) {
    console.error('校验失败', err)
  }
}

</script>
