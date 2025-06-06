<template>
  <el-dialog
    :title="isEdit ? '编辑造型表' : '新建造型表'"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >
    <CustomForm :data="formConfig" :formState="formState" :formRef="formRef" :Formvalue="form" />

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import CustomForm from '@/components/form/CreateForm.vue'
import { toRaw } from 'vue'


const props = defineProps<{ modelValue: boolean; isEdit: boolean; currentData?: Record<string, any> }>()
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => visible.value = val)
watch(() => visible.value, val => emit('update:modelValue', val))

const formRef = ref()
const formState = ref({})
const form = ref<Record<string, any>>({
  color: '',
  groupId: '',
  lddNumber: '',
  material: '',
  mouldCategory: '',
  mouldId: '',
  mouldNumber: '',
  picture: null,
  productName: '',
  quantity: null
})

const defaultForm = () => ({
  color: '',
  groupId: '',
  lddNumber: '',
  material: '',
  mouldCategory: '',
  mouldId: '',
  mouldNumber: '',
  picture: null,
  productName: '',
  quantity: null
})


const formConfig = [
  [{ label: '产品名称', key: 'productName', type: 'input', width: 12 }, { label: '颜色', key: 'color', type: 'input', width: 12 }],
  [{ label: '数量', key: 'quantity', type: 'number', width: 8 }, { label: '材料', key: 'material', type: 'input', width: 8 }, { label: '模具编号', key: 'mouldNumber', type: 'input', width: 8 }],
  [{ label: 'LDD编号', key: 'lddNumber', type: 'input', width: 12 }, { label: '模具类型', key: 'mouldCategory', type: 'input', width: 12 }],
  [{ label: '模具ID', key: 'mouldId', type: 'input', width: 12 }, { label: '组ID', key: 'groupId', type: 'input', width: 12 }],
  [{ label: '图片', key: 'picture', type: 'image', width: 24 }]
]

watch(() => props.currentData, data => {
  if (data && Object.keys(data).length > 0) {
    // 是编辑模式，设置数据
    form.value = { ...defaultForm(), ...data }
  } else {
    // 是新建模式或需要清空
    form.value = defaultForm()
  }
}, { immediate: true })


const handleClose = () => {
  visible.value = false
  form.value = defaultForm()
}

const handleSubmit = async () => {
  try {
    const formData = new FormData()
    for (const key in form.value) {
      formData.append(key, form.value[key])
    }
    console.log('提交数据：', form.value)
    emit('submit', toRaw(form.value))
    handleClose()
  } catch (err) {
    console.error('校验失败', err)
  }
}
</script>
