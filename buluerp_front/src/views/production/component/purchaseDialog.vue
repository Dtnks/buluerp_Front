<template>
  <el-dialog
    :title="isEdit ? '编辑外购物料' : '新建外购物料'"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >
    <!-- 图片上传 -->
    <div style="position: relative; display: inline-block; margin-bottom: 16px;">
      <ImageUpload :initialUrl="imageUrl" :setFile="setPictureFile" />

      <el-button
        v-if="imageUrl"
        type="danger"
        size="small"
        style="position: absolute; top: 4px; right: 4px; z-index: 0;"
        @click="removeImage"
        circle
      ><el-icon><Delete /></el-icon></el-button>
    </div>

    <!-- 表单 -->
    <CustomForm
      ref="formRef"
      :data="formConfig"
      :formState="formState"
      :Formvalue="form"
    />

    <!-- 底部按钮 -->
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
import { Delete } from '@element-plus/icons-vue'
import { requiredRule } from '@/utils/form/valid'
import { searchFunc } from '@/utils/search/search'
import { getFullImageUrl } from '@/utils/image/getUrl'

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
  materialType: '',
  mouldNumber: '',
  pictureFile: null,
  purchaseCode: '',
  singleWeight: null,
  specificationName: '',
  supplier: '',
  unitPrice: null
})

const pictureFile = ref<File | null>(null)
const setPictureFile = (file: File | null) => {
  pictureFile.value = file
  if (file) {
    form.value.pictureFile = ''
  } else {
    form.value.pictureFile = null
  }
}

const imageUrl = ref('')

const formConfig = [
  [
    {
      label: '采购编码',
      key: 'purchaseCode',
      type: 'input',
      width: 8,
      required: true,
      rules: [{ required: true, message: '请输入采购编码', trigger: 'blur' }]
    },
    {
      label: '规格名称',
      key: 'specificationName',
      type: 'input',
      width: 8
    },
    {
      label: '供应商',
      key: 'supplier',
      type: 'input',
      width: 8
    }
  ],
  [
    {
      type: 'inputSelect',
      label: '材料类型',
      key: 'materialType',
      width: 12,
      rules: [requiredRule],
      remoteFunc: searchFunc('system/material-type/list', 'name'),
      options: [],
      loading: false,
    },
    {
      label: '单重',
      key: 'singleWeight',
      type: 'number',
      width: 12
    }
  ],
  [
    {
      label: '单价',
      key: 'unitPrice',
      type: 'number',
      width: 12,
      rules: [{ type: 'number', message: '请输入有效的数字', trigger: 'blur' }]
    },
    {
      label: '模具编号',
      key: 'mouldNumber',
      type: 'input',
      width: 12
    }
  ],
  [
    {
      label: '图片',
      key: 'pictureFile',
      type: 'file',
      width: 12,
    }
  ]
]

watch(
  () => props.currentData,
  (data) => {
    if (data) {
      form.value = {
        materialType: data.materialType || '',
        purchaseCode: data.purchaseCode || '',
        specificationName: data.specificationName || '',
        supplier: data.supplier || '',
        singleWeight: data.singleWeight || null,
        unitPrice: data.unitPrice || null,
        mouldNumber: data.mouldNumber || '',
        pictureFile: data.pictureFile || null,
      }

      if (data.pictureFile) {
        imageUrl.value = getFullImageUrl(data.pictureFile)
        pictureFile.value = null
      } else {
        imageUrl.value = ''
        pictureFile.value = null
      }
    }
  },
  { immediate: true }
)

const handleClose = () => {
  form.value={
    materialType: '',
    mouldNumber: '',
    pictureFile: null,
    purchaseCode: '',
    singleWeight: null,
    specificationName: '',
    supplier: '',
    unitPrice: null
  }
  visible.value = false
}

const removeImage = () => {
  setPictureFile(null)
}

const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validateForm((valid: boolean) => {
    if (!valid) return

    const formData = new FormData()

    for (const key in form.value) {
      if (key === 'pictureFile') {
        if (pictureFile.value) {
          formData.append('pictureFile', pictureFile.value)
        }
        continue
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
