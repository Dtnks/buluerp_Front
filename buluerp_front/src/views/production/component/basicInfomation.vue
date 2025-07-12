<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { FormInstance, } from 'element-plus'
import { updateProduct } from '@/apis/products.js'
import { searchMaterial } from '@/apis/materials'
import { searchDesignDetail } from '@/apis/designs.js'
import { messageBox } from '@/components/message/messageBox' // 替换弹窗组件
import { getFullImageUrl } from '@/utils/image/getUrl'
import  uploadPicture  from '@/components/upload/editUpload.vue'
import useTabStore from '@/stores/modules/tabs'

const props = defineProps<{
  detail: any
  materialData: any[]
  control: Array<object>
}>()

const tableData = ref<MaterialItem[]>([])
const dialogVisible = ref(false)
const editingIndex = ref<number | null>(null)

interface DesignMaterialItem {
  mouldNumber: string
  lddNumber: string
  mouldCategory: string
  mouldId: string
  pictureUrl: string
  color: string
  productName: string
  quantity: number
  material: string
}

const tabStore = useTabStore()
const originalProductName = ref('')

const mainFormRef = ref<FormInstance>()
const mainFormState = reactive({
  productPrice: '',
  orderId: '',
  productName: '',
  productIntro: '',
  innerId: '',
  outerId: '',
  designStatus: 0,
})

const fileList = ref<{ url: string; raw?: File }[]>([])
const pictureFile = ref<File | null>(null)
const pictureUrl = ref('')

const setFile = (file: File | null) => {
  pictureFile.value = file
}

const refreshData = async () => {
  const val = props.detail
  if (val) {
    mainFormState.productName = val.name || ''
    originalProductName.value = val.name || ''
    mainFormState.orderId = val.orderId || ''
    mainFormState.designStatus = Number(val.designStatus ?? 0)
    mainFormState.innerId = val.innerId || ''
    mainFormState.outerId = val.outerId || ''

    if (val.pictureUrl) {
      pictureUrl.value = getFullImageUrl(val.pictureUrl)
      pictureFile.value = null
    }

    try {
      const res = await searchDesignDetail(val.id)
      tableData.value = flattenDesignDetail(res.data)
    } catch (err) {
      console.error('获取设计明细失败', err)
      tableData.value = []
      messageBox('error', null, '', '获取设计明细失败', '')
    }
  }
}
defineExpose({ refreshData })  // 关键！允许父组件访问此方法


function flattenDesignDetail(data: any): DesignMaterialItem[] {
  const length = Math.max(
    data.mouldNumber?.length || 0,
    data.lddNumber?.length || 0,
    data.mouldCategory?.length || 0,
    data.mouldId?.length || 0,
    data.pictureUrl?.length || 0,
    data.color?.length || 0,
    data.productName?.length || 0,
    data.material?.length || 0,
  )

  const result: DesignMaterialItem[] = []

  for (let i = 0; i < length; i++) {
    result.push({
      mouldNumber: data.mouldNumber?.[i] || '',
      lddNumber: data.lddNumber?.[i] || '',
      mouldCategory: data.mouldCategory?.[i] || '',
      mouldId: data.mouldId?.[i] || '',
      pictureUrl: data.pictureUrl?.[i] || '',
      color: data.color?.[i] || '',
      productName: data.productName?.[i] || '',
      quantity: data.quantity ?? 0, // 公共字段
      material: data.material?.[i] || '',
    })
  }

  return result
}

// const BASE_URL = 'http://154.201.77.135:8080'

// function resolveImageUrl(path: string) {
//   if (!path) return ''
//   return `${BASE_URL}${path.replace('//', '/')}`
// }

watch(
  () => props.detail,
  () => {
    refreshData()
  },
  { immediate: true },
)

const removeImage = (index: number) => {
  fileList.value.splice(index, 1)
}

const submitMainForm = async () => {
  if (!mainFormRef.value) return
  try {
    await mainFormRef.value.validate()

    // const rawFile = fileList.value[0]?.raw ?? null

    await updateProduct({
      id: Number(props.detail?.id),
      name: mainFormState.productName,
      orderId: mainFormState.orderId,
      designStatus: Number(mainFormState.designStatus),
      picture: pictureFile.value ?? null,
      innerId: mainFormState.innerId,
      outerId: mainFormState.outerId,
    })
    tabStore.freshTab('产品查询')

    if (mainFormState.productName !== originalProductName.value) {
      const oldTabName = `详情页-${originalProductName.value}`
      const newTabName = `详情页-${mainFormState.productName}`
      tabStore.changeTabName(oldTabName, newTabName)

      originalProductName.value = mainFormState.productName
    }
    messageBox('success', null, '提交成功', '', '')
  } catch (err) {
    console.error('提交失败', err)
    messageBox('error', null, '', '提交失败', '')
  }
}

const onClear = () => {
  mainFormRef.value?.resetFields()
  fileList.value = []
}

const onCancel = () => {
  console.log('取消按钮点击')
}

interface MaterialItem {
  mouldNumber: number
  specificationName: string
  materialType: string
  standardCode: number
  singleWeight: number
}

</script>

<template>
  <el-form ref="mainFormRef" :model="mainFormState" label-width="120px" class="greyBack">
    <el-card>
      <template #header><div class="card-header">业务订单基础信息</div></template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品编码">
            <el-text line-clamp="2">{{ props.detail?.id || '-' }}</el-text>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建日期">
            <el-text line-clamp="2">{{ props.detail?.createTime || '-' }}</el-text>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内部编号" prop="innerId">
            <el-input v-model="mainFormState.innerId" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="mainFormState.productName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品设计状态" prop="otherInfo">
            <el-select v-model="mainFormState.designStatus" placeholder="请选择">
              <el-option label="设计中" :value="0" />
              <el-option label="已完成" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="外部编号" prop="outerId">
            <el-input v-model="mainFormState.outerId" placeholder="请输入" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="8">
          <el-form-item label="上传图片" prop="uploadImage">
            <uploadPicture :setFile="setFile" :initialUrl="pictureUrl" />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <div class="preview-container">
            <div v-for="(item, index) in fileList" :key="index" class="preview-item">
              <img :src="item.url" alt="预览" class="preview-image" />
              <el-button type="danger" size="small" @click="removeImage(index)">删除</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <div style="text-align: right; margin-top: 20px">
        <el-space>
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="submitMainForm" :disabled="control[1].disabled"
            >提交</el-button
          >
          <el-button @click="onClear">重置</el-button>
        </el-space>
      </div>
    </el-card>

    <el-card>
      <template #header><div class="card-header">产品详情</div></template>

      <el-steps :active="1" align-center>
        <el-step title="填写产品组装物料信息" />
        <el-step title="完成" />
      </el-steps>

      <el-table :data="tableData" style="width: 100%" max-height="400">
        <el-table-column prop="mouldNumber" label="模具编号" width="120" />
        <el-table-column prop="lddNumber" label="LDD编号" width="120" />
        <el-table-column prop="mouldCategory" label="模具分类" width="120" />
        <el-table-column prop="mouldId" label="模具ID" width="120" />
        <el-table-column prop="pictureUrl" label="图片">
          <template #default="scope">
            <el-image :src="getFullImageUrl(scope.row.pictureUrl)" style="width: 80px; height: 80px;" />
          </template>
        </el-table-column>
        <el-table-column prop="color" label="颜色" width="100" />
        <el-table-column prop="productName" label="产品名称" width="120" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="material" label="原材料" width="120" />

      </el-table>
    </el-card>

  </el-form>
</template>

<style scoped>
.card-header {
  font-weight: bold;
  font-size: 16px;
}
.preview-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.preview-item {
  width: 120px;
  text-align: center;
}
.preview-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
}
.mt-4 {
  margin-top: 16px;
}
</style>
