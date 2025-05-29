<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>物料查询</span>
      </div>
    </template>

    <el-row>
      <el-form :model="formState" label-width="100px" class="search-form" style="flex: 1;">
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
            <el-form-item label="搜索关键字">
              <el-input v-model="formState.keyword" placeholder="请输入关键字" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-col :span="4" style="text-align: right; padding: 20px">
        <el-space direction="vertical">
          <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleClear">重置</el-button>
          </el-row>
          <el-row>
            <el-button type="primary" @click="handleCreate">新建</el-button>
            <el-button @click="handleImport">导入</el-button>
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

    <!-- 新建模具弹窗 -->
    <MaterialDialog
      v-model="dialogVisible"
      :isEdit="false"
      @submit="handleCreateSubmit"
    />
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getMaterialList, importMaterialFile, addMaterial, getMaterialTemplate } from '@/apis/materials'
import { messageBox } from '@/components/message/messageBox'
import MaterialDialog from '@/views/production/component/materialDialog.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { downloadBinaryFile } from '@/utils/file/base64'

const emit = defineEmits(['search'])

const formState = reactive({
  mouldManufacturer: '',
  keyword: '',
  mouldNumber: '',
})

const mouldNumberOptions = ref<{ label: string; value: string }[]>([])
const mouldManufacturerOptions = ref<{ label: string; value: string }[]>([])

const fetchMaterialOptions = async () => {
  try {
    const res = await getMaterialList({})
    const rows = res.rows || []

    mouldNumberOptions.value = [...new Set(rows.map(item => item.mouldNumber))].map(val => ({
      label: String(val),
      value: String(val),
    }))
    mouldManufacturerOptions.value = [...new Set(rows.map(item => item.mouldManufacturer))].map(val => ({
      label: String(val),
      value: String(val),
    }))
  } catch (error) {
    console.error('获取物料失败:', error)
  }
}

onMounted(() => {
  fetchMaterialOptions()
})

const importDialogVisible = ref(false)
const dialogVisible = ref(false)

const handleSearch = () => {
  emit('search', { ...formState })
}

const handleClear = () => {
  formState.mouldManufacturer = ''
  formState.mouldNumber = ''
  formState.keyword = ''
}

const handleCreate = () => {
  dialogVisible.value = true
}

const handleCreateSubmit = async (formData: any) => {
  try {
    await addMaterial(formData)
    messageBox('success', null, '新建成功', '', '')
    dialogVisible.value = false
    emit('search') // 刷新列表
  } catch (error) {
    messageBox('error', null, '', '新建失败', '')
  }
}

const handleImport = () => {
  importDialogVisible.value = true
}

const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  if (!isExcel) {
    messageBox('error', null, '', '只能上传excel文件', '')
    return false
  }
  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)
  try {
    const res = await importMaterialFile(formData)
    if (res.code === 200) {
      messageBox('success', null, '导入成功', '', '')
      importDialogVisible.value = false
    } else {
      ElMessage.error(res.msg)
      const error_text = res.data
        .map((ele) => {
            return '第' + ele.rowNum + '行：' + ele.errorMsg
        })
        .join('<br>')
        ElMessageBox.alert(error_text, '数据格式出现问题', {
            confirmButtonText: '继续',
            type: 'error',
            dangerouslyUseHTMLString: true,
        })
    }
  } catch (e) {
    messageBox('error', null, '', '导入失败', '')
  }
}


const handleDownloadTemplate = async () => {
  try {
    const res = await getMaterialTemplate()
    downloadBinaryFile(res, '模具模板.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  } catch (e) {
    ElMessage.error('下载失败')
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
