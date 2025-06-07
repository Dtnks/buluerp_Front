<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>设计总表查询</span>
      </div>
    </template>

    <el-row>
      <el-form :model="formState" label-width="120px" class="search-form" style="flex: 1;">
        <el-row :gutter="20" align="middle">
          <el-col :span="12">
            <el-form-item label="PMC确认状态">
              <el-select v-model="formState.confirm" placeholder="请选择确认状态">
                <el-option label="未确认" :value="0" />
                <el-option label="已确认" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建用户ID">
              <el-input v-model="formState.createUserId" placeholder="请输入用户ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" align="middle">
          <el-col :span="12">
            <el-form-item label="订单ID">
              <el-input v-model="formState.orderId" placeholder="请输入订单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="formState.productId" placeholder="请输入产品编码" />
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

    <!-- 新建弹窗 -->
    <DesignDialog
      v-model="dialogVisible"
      :isEdit="false"
      @submit="handleCreateSubmit"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox } from 'element-plus'
import { importDesignFile, getDesignTemplate, addDesign } from '@/apis/designs'
import { downloadBinaryFile } from '@/utils/file/base64'
import DesignDialog from '@/views/production/component/designDialog.vue'

const emit = defineEmits(['search','created'])

const formState = reactive({
  confirm: '',
  createUserId: '',
  orderId: '',
  productId: '',
})

const importDialogVisible = ref(false)
const dialogVisible = ref(false)

const handleSearch = () => {
  emit('search', { ...formState })
}

const handleClear = () => {
  formState.confirm = ''
  formState.createUserId = ''
  formState.orderId = ''
  formState.productId = ''
}

const handleCreate = () => {
  dialogVisible.value = true
}

const handleCreateSubmit = async (formData: any) => {
  try {
    const res = await addDesign(formData)
    if (res.code === 200) {
      messageBox('success', null, '新建成功', '', '')
      dialogVisible.value = false
      emit('search', { ...formState }) 
    } else {
      messageBox('error', null, '', res.msg || '新建失败', '')
    }
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
    messageBox('error', null, '', '只能上传 Excel 文件', '')
    return false
  }

  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    const res = await importDesignFile(formData)

    if (res.code === 200) {
      messageBox('success', null, '导入成功', '', '')
      importDialogVisible.value = false
      emit('created')
    } else {
      const error_text = res.data
        .map((ele) => '第' + ele.rowNum + '行：' + ele.errorMsg)
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
    const res = await getDesignTemplate()
    downloadBinaryFile(
      res,
      '设计总表模板.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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
