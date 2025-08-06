<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>物料查询</span>
      </div>
    </template>

    <el-row>
      <el-form :model="formState" label-width="100px" class="search-form" style="flex: 1">
        <el-row :gutter="20" align="middle">
          <el-col :span="8">
            <el-form-item label="模具编号">
              <el-select v-model="formState.mouldNumber" placeholder="请选择模具编号">
                <el-option
                  v-for="item in mouldNumberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="模具厂家">
              <el-select v-model="formState.mouldManufacturer" placeholder="请选择模具厂家">
                <el-option
                  v-for="item in mouldManufacturerOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否外购" prop="purchased">
              <el-select v-model="formState.purchased" placeholder="请选择">
                <el-option label="否" :value=false />
                <el-option label="是" :value=true />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

<el-col :span="4" style="text-align: right; padding: 20px">
  <el-space direction="vertical">
    <!-- 查询和重置按钮 -->
    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleClear">重置</el-button>
    </el-row>

    <!-- 新建和导入按钮 -->
    <el-row>
      <el-space wrap :size=12>
        <el-dropdown @command="handleCreateCommand">
          <el-button type="primary">
            新建
          </el-button>
          <template v-slot:dropdown>
            <el-dropdown-item command="internal">新建内部物料</el-dropdown-item>
            <el-dropdown-item command="external">新建外购物料</el-dropdown-item>
          </template>
        </el-dropdown>

        <el-dropdown @command="handleImportCommand">
          <el-button>
            导入
          </el-button>
          <template v-slot:dropdown>
            <el-dropdown-item command="internal">导入内部物料</el-dropdown-item>
            <el-dropdown-item command="external">导入外购物料</el-dropdown-item>
          </template>
        </el-dropdown>
      </el-space>
    </el-row>
  </el-space>

  <div style="text-align: right; margin-top: 8px">
    <el-link type="primary" @click="handleDownloadTemplate">下载导入模板</el-link>
  </div>
</el-col>

    </el-row>

    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="导入 Excel" width="400px">
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handleUpload"
        accept=".xlsx,.xls"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
        </template>
      </el-upload>
    </el-dialog>
        <el-dialog v-model="importPurDialogVisible" title="导入 Excel" width="400px">
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handlePurUpload"
        accept=".xlsx,.xls"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 新建模具弹窗 -->
    <MaterialDialog v-model="dialogVisible" :isEdit="false" @submit="handleCreateSubmit" />
    <PurchaseDialog v-model="purchasedialogVisible" :isEdit="false" @submit="handleCreatePurSubmit" />
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import {
  getMaterialList,
  importMaterialFile,
  addMaterial,
  getMaterialTemplate,
  addPurMaterial,
  importPurMaterialFile
} from '@/apis/materials'
import { messageBox } from '@/components/message/messageBox'
import MaterialDialog from '@/views/production/component/materialDialog.vue'
import { ElMessageBox } from 'element-plus'
import { downloadBinaryFile } from '@/utils/file/base64'
import PurchaseDialog from './purchaseDialog.vue'

const emit = defineEmits(['search'])

const formState = reactive({
  mouldManufacturer: '',
  keyword: '',
  mouldNumber: '',
  purchased: null
})

const mouldNumberOptions = ref<{ label: string; value: string }[]>([])
const mouldManufacturerOptions = ref<{ label: string; value: string }[]>([])

const fetchMaterialOptions = async () => {
  try {
    const res = await getMaterialList({})
    const rows = res.rows || []

    mouldNumberOptions.value = [...new Set(rows.map((item) => item.mouldNumber))].map((val) => ({
      label: String(val),
      value: String(val),
    }))
    mouldManufacturerOptions.value = [...new Set(rows.map((item) => item.mouldManufacturer))].map(
      (val) => ({
        label: String(val),
        value: String(val),
      }),
    )
  } catch (error) {
    messageBox('error', null, '', '获取物料失败', '')
  }
}

onMounted(() => {
  fetchMaterialOptions()
})

const importDialogVisible = ref(false)
const importPurDialogVisible = ref(false)
const dialogVisible = ref(false)
const purchasedialogVisible = ref(false)

const handleSearch = () => {
  emit('search', { ...formState })
}

const handleClear = () => {
  formState.mouldManufacturer = ''
  formState.mouldNumber = ''
  formState.purchased = null
}

const handleCreateCommand = (command: string) => {
  if (command === 'internal') {
    handleCreateInternal()  // 调用新建内部物料的处理函数
  } else if (command === 'external') {
    handleCreateExternal()  // 调用新建外购物料的处理函数
  }
}

const handleCreateInternal = () => {
  dialogVisible.value = true
}
const handleCreateExternal = () => {
  purchasedialogVisible.value = true
}

const handleCreatePurSubmit = async (formData: any) => {
    const res = await addPurMaterial(formData)

    if (res.code === 200) {
      messageBox('success', null, '新建成功', '', '')
      dialogVisible.value = false
      handleSearch()
    } else {
      messageBox('error', null, '', res.msg || '新建失败', '')
    }
}

const handleCreateSubmit = async (formData: any) => {
    const res = await addMaterial(formData)

    if (res.code === 200) {
      messageBox('success', null, '新建成功', '', '')
      dialogVisible.value = false
      handleSearch()
    } else {
      messageBox('error', null, '', res.msg || '新建失败', '')
    }
}

const handleImportCommand = (command: string) => {
  if (command === 'internal') {
    handleImport()  // 调用导入内部物料的处理函数
  } else if (command === 'external') {
    handleImportExternal()  // 调用导入外购物料的处理函数
  }
}
const handleImport = () => {
  importDialogVisible.value = true
}
const handleImportExternal = () => {
  importPurDialogVisible.value = true
}

const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  if (!isExcel) {
    messageBox('error', null, '', '只能上传 Excel 文件', '')
    return false
  }

  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)
  const res = await importMaterialFile(formData)

  if (res.code === 200) {
      messageBox('success', null, '导入成功', '', '')
      dialogVisible.value = false
      handleSearch()
    } else {
      messageBox('error', null, '', res.msg || '导入失败', '')
    }
}
const handlePurUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)
  const res = await importPurMaterialFile(formData)

  if (res.code === 200) {
      messageBox('success', null, '导入成功', '', '')
      dialogVisible.value = false
      handleSearch()
    } else {
      messageBox('error', null, '', res.msg || '导入失败', '')
    }
}

const handleDownloadTemplate = async () => {
  try {
    const res = await getMaterialTemplate()
    downloadBinaryFile(
      res,
      '模具模板.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
  } catch (e) {
    messageBox('error', null, '', '下载失败', '')
  }
}
</script>

<style scoped>
.search-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
}
</style>
