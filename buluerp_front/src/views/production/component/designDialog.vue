<template>
  <el-dialog
    :title="isEdit ? '编辑设计' : '新建设计'"
    v-model="visible"
    width="600px"
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
import CustomForm from '@/components/form/CreateForm.vue'

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
  orderId: '',
  productId: '',
})

const formConfig = [
  [
    {
      label: '订单ID',
      key: 'orderId',
      type: 'input',
      width: 12,
      required: true,
      placeholder: '请输入订单ID',
    },
    {
      label: '产品编码',
      key: 'productId',
      type: 'input',
      width: 12,
      required: true,
      placeholder: '请输入产品编码',
    },
  ],
]

watch(
  () => props.currentData,
  (data) => {
    if (data) {
      form.value = {
        orderId: data.orderId || '',
        productId: data.productId || '',
      }
    }
  },
  { immediate: true }
)

const resetForm = () => {
  form.value = {
    orderId: '',
    productId: '',
  }
}

const handleClose = () => {
  visible.value = false
  resetForm()
}

const handleSubmit = async () => {
  try {
    emit('submit', { ...form.value })
    // handleClose()
  } catch (err) {
    console.error('校验失败', err)
  }
}
</script>
