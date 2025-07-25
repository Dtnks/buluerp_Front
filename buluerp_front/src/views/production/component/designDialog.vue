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
import { ref, defineProps, defineEmits, watch, onMounted } from 'vue'
import CustomForm from '@/components/form/CreateForm.vue'
import { getList_pro } from '@/apis/products'

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

// 非响应式变量
let productOptions: any[] = []
let productLoading = false

const formConfig = ref<any[]>([])

const updateFormConfig = () => {
  formConfig.value = [
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
        type: 'inputSelect',
        width: 12,
        required: true,
        placeholder: '请输入产品编码',
        remoteFunc: handleSearchProduct,
        options: productOptions,
        loading: productLoading,
      },
    ],
  ]
}

// 初始化一次
onMounted(() => {
  updateFormConfig()
})

const handleSearchProduct = async (_item, query: string) => {
  if (!query) {
    productOptions = []
    updateFormConfig()
    return
  }
  productLoading = true
  updateFormConfig()

  try {
    const res = await getList_pro({ innerId: query })
    productOptions = (res.rows || []).map((item: any) => ({
      value: item.innerId,
      label: `${item.innerId} - ${item.name || ''}`,
    }))
  } finally {
    productLoading = false
    updateFormConfig()
  }
}

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
  emit('submit', { ...form.value })
}
</script>
