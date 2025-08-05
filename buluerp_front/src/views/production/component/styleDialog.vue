<template>
  <el-dialog
    :title="isEdit ? '编辑造型表' : '新建造型表'"
    v-model="visible"
    width="800px"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="form.productName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="颜色" prop="color">
            <el-input v-model="form.color" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数量" prop="quantity">
            <el-input-number v-model="form.quantity" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="材料" prop="material">
            <el-input v-model="form.material" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模具编号" prop="mouldNumber">
            <el-select
              v-model="form.mouldNumber"
              filterable
              remote
              reserve-keyword
              placeholder="请输入模具编号"
              :remote-method="handleSearchMaterial"
              :loading="materialLoading"
              style="width: 100%"
            >
              <el-option
                v-for="item in materialOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div class="el-form-item__extra" style="color: #409EFF; font-size: 13px;">
              提示：填写模具编号后会自动填写物料ID，模具类型与图片
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物料ID" prop="materialId">
            <el-input v-model="form.materialId" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具类型" prop="mouldCategory">
            <el-input v-model="form.mouldCategory" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="LDD编号" prop="lddNumber">
            <el-input-number v-model="form.lddNumber" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组ID" prop="groupId">
            <el-input-number v-model="form.groupId" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片">
            <ImageUpload ref="uploadRef" :setFile="setPictureFile" :initialUrl="imageUrl" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import ImageUpload from '@/components/upload/editUpload.vue'
import { getFullImageUrl } from '@/utils/image/getUrl'
import { getMaterialList } from '@/apis/materials'
import { toRaw } from 'vue'

const props = defineProps<{ modelValue: boolean; isEdit: boolean; currentData?: Record<string, any> }>()
const emit = defineEmits(['update:modelValue', 'submit'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, val => visible.value = val)
watch(() => visible.value, val => emit('update:modelValue', val))

const formRef = ref()
const form = ref({
  color: '',
  groupId: '',
  lddNumber: '',
  material: '',
  mouldCategory: '',
  mouldNumber: '',
  picture: null,
  productName: '',
  quantity: null,
  materialId: null
})

const defaultForm = () => ({
  color: '',
  groupId: '',
  lddNumber: '',
  material: '',
  mouldCategory: '',
  mouldNumber: '',
  picture: null,
  productName: '',
  quantity: null,
  materialId: null
})

const rules = {
  productName: [{ required: true, message: '必填', trigger: 'blur' }],
  color: [{ required: true, message: '必填', trigger: 'blur' }],
  quantity: [{ required: true, type: 'number', message: '请输入数字', trigger: 'blur' }],
  material: [{ required: true, message: '必填', trigger: 'blur' }],
  materialId: [{ required: true, type: 'number', message: '请输入物料ID', trigger: 'blur' }],
  mouldNumber: [{ required: true, message: '必填', trigger: 'blur' }]
}

const pictureFile = ref<File | null>(null)
const imageUrl = ref('')
const materialLoading = ref(false)
const materialOptions = ref<any[]>([])

const setPictureFile = (file: File | null) => {
  pictureFile.value = file
  if (!file) form.value.picture = ''
}

const handleSearchMaterial = async (query: string) => {
  if (!query) return
  materialLoading.value = true
  try {
    const res = await getMaterialList({ mouldNumber: query })
    materialOptions.value = (res.rows || []).map(m => ({
      value: m.mouldNumber,
      label: `${m.mouldNumber} - ${m.materialType || ''}`,
      materialId: m.id,
      mouldCategory: m.materialType
    }))
  } finally {
    materialLoading.value = false
  }
}

watch(() => form.value.mouldNumber, (newVal) => {
  const matched = materialOptions.value.find(opt => opt.value === newVal)
  if (matched) {
    form.value.materialId = matched.materialId || null
    form.value.mouldCategory = matched.mouldCategory || ''
  }
})

watch(() => props.currentData, data => {
  if (data && Object.keys(data).length > 0) {
    form.value = { ...defaultForm(), ...data }
    imageUrl.value = data.pictureUrl ? getFullImageUrl(data.pictureUrl) : ''
  } else {
    form.value = defaultForm()
    imageUrl.value = ''
    pictureFile.value = null
  }
}, { immediate: true })

const uploadRef = ref()

const handleClose = () => {
  visible.value = false
  form.value = defaultForm()
  imageUrl.value = ''
  pictureFile.value = null
  materialOptions.value = []
  uploadRef.value?.clear?.()
}

const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return

    const rawForm = toRaw(form.value)
    const pictureValue = pictureFile.value || rawForm.picture

    emit('submit', {
      ...rawForm,
      picture: pictureValue
    })

    handleClose()
  })
}

</script>
