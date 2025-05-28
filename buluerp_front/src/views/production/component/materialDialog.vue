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
      <el-form-item label="创建时间" prop="creatTime">
        <el-date-picker v-model="form.creatTime" type="datetime" style="width: 100%" />
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker v-model="form.updateTime" type="datetime" style="width: 100%" />
      </el-form-item>
      <el-form-item label="胶件图引" prop="drawingReference">
        <el-input v-model="form.drawingReference" />
      </el-form-item>
      <el-form-item label="模具编号" prop="id">
        <el-input v-model="form.id" />
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
const form = ref<Record<string, any>>({
  creatTime: '',
  updateTime: '',
  drawingReference: '',
  id: '',
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
      form.value = { ...data }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  visible.value = false
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    emit('submit', { ...form.value })
    handleClose()
  } catch (err) {
    console.error('校验失败', err)
  }
}
</script>
