<template>
  <el-dialog
    :title="isEdit ? '编辑外购物料' : '新建外购物料'"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >
    <div style="display: flex; gap: 20px; margin-bottom: 16px;">
      <!-- 图片上传 -->
      <div style="position: relative; display: inline-block;">
        <ImageUpload v-if="visible" :initialUrl="imageUrl" :setFile="setPictureFile" />
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
import StpUpload from '@/components/upload/stpUpload.vue'
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
import { reactive } from 'vue'

const form = reactive({
  materialType: '',
  mouldNumber: '',
  pictureFile: null,
  purchaseCode: '',
  singleWeight: null,
  specificationName: '',
  supplier: '',
  unitPrice: null,
  modelFile: null,
  productCode: ''
})


const pictureFile = ref<File | null>(null)
const imageUrl = ref('')

const stpFile = ref<File | null>(null)
const stpUrl = ref('')

const setPictureFile = (file: File | null) => {
  pictureFile.value = file
  // 只在 file 为 null 时清空 imageUrl
  if (!file) {
    imageUrl.value = ''
    form.pictureFile = null
  }
}

const setStpFile = (file: File | null) => {
  stpFile.value = file
  if (file) {
    form.modelFile = null
  } else {
    form.modelFile = null
    stpUrl.value = ''
  }
}

const formConfig = ref([
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
      showKey:[{key:'name',label:"名称"},{key:'colorCode',label:"颜色编码"},{key:'colorWeight',label:"色粉重量"}],
      loading: false
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
      required: true,
      rules: [{ required: true, message: '请输入模具编号', trigger: 'blur' }],
      width: 12
    }
  ],
  [
    {
      label: '图片',
      key: 'pictureFile',
      type: 'file',
      width: 12
    }
  ],
  [
    {
      label: '产品编码',
      key: 'productCode',
      type: 'input',
      width: 12
    }
  ],
])


watch(
  () => props.currentData,
  (data) => {
    if (!data) return

    Object.assign(form, {
      materialType: data.materialType || '',
      purchaseCode: data.purchaseCode || '',
      specificationName: data.specificationName || '',
      supplier: data.supplier || '',
      singleWeight: data.singleWeight || null,
      unitPrice: data.unitPrice || null,
      mouldNumber: data.mouldNumber || '',
      pictureFile: data.pictureFile || null,
      stpReferenceFile: data.stpReferenceFile || null,
      deleteStpReference: false
    })

    if (data.pictureFile) {
      imageUrl.value = getFullImageUrl(data.pictureFile)
      pictureFile.value = null
    } else {
      imageUrl.value = ''
      pictureFile.value = null
    }

    if (data.stpReferenceFile) {
      stpUrl.value = getFullImageUrl(data.stpReferenceFile)
      stpFile.value = null
    } else {
      stpUrl.value = ''
      stpFile.value = null
    }
  },
  { immediate: true }
)

const resetForm = () => {
  Object.assign(form, {
    materialType: '',
    mouldNumber: '',
    pictureFile: null,
    stpReferenceFile: null,
    deleteStpReference: false,
    purchaseCode: '',
    singleWeight: null,
    specificationName: '',
    supplier: '',
    unitPrice: null
  })
}


const handleClose = () => {
  resetForm()
  imageUrl.value = ''
  pictureFile.value = null
  stpUrl.value = ''
  stpFile.value = null
  visible.value = false
}


const removeImage = () => {
  setPictureFile(null)
}

const removeStp = () => {
  setStpFile(null)
}

const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validateForm((valid: boolean) => {
    if (!valid) return

    const formData = new FormData()

    for (const key in form) {
      if (key === 'pictureFile') {
        if (pictureFile.value) {
          formData.append('pictureFile', pictureFile.value)
        }
        continue
      }
      if (key === 'modelFile') {
        if (stpFile.value) {
          formData.append('modelFile', stpFile.value)
        } else if (typeof form.modelFile === 'string') {
          formData.append('modelFile', form.modelFile)
        }
        continue
      }

      const value = form[key]
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v))
      } else if (value !== null && value !== undefined && key !== 'deleteStpReference') {
        formData.append(key, value)
      }
    }

    emit('submit', formData)
    handleClose()
  })
}
</script>
