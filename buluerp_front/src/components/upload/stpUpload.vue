<template>
  <el-upload
    ref="upload"
    :before-upload="beforeUpload"
    :on-change="handleFileChange"
    :on-remove="handleFileRemove"
    :on-exceed="handleFileExceed"
    :auto-upload="false"
    :limit="1"
    :show-file-list="false"
    accept=".stp,.step"
    style="margin: 20px; display: inline-block; text-align: center"
  >
    <div v-if="fileName" style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
      <div class="file-info" style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; border: 1px dashed #d9d9d9; border-radius: 6px; padding: 10px; word-break: break-all;">
        <span style="font-size: 14px; color: #606266; text-align: center;">{{ fileName }}</span>
      </div>
      <el-button type="primary" size="small">重新上传模型</el-button>
    </div>
    <div v-else style="width: 150px; height: 150px; display: flex;justify-content: center;">
      <el-button type="primary">上传 STP 模型</el-button>
    </div>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, watch, defineExpose } from 'vue'
import { genFileId, ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const props = defineProps<{
  setFile: (file: File | null) => void
  initialUrl?: string
}>()

const upload = ref()
const fileName = ref('')

//监听初始 URL (如果后端有初始模型路径，这里只提取文件名显示)
watch(
  () => props.initialUrl,
  (url) => {
    if (url) {
      // 假设 URL 包含文件名，提取最后一部分显示
      const parts = url.split('/')
      fileName.value = parts[parts.length - 1]
    } else {
      fileName.value = ''
      if (upload.value) {
        upload.value.clearFiles() // 清除已上传文件
      }
    }
  },
  { immediate: true },
)

// 上传前校验：只能是 STP/STEP 文件
const beforeUpload = (file: File) => {
  const extension = file.name.split('.').pop()?.toLowerCase()
  const isStp = extension === 'stp' || extension === 'step'
  if (!isStp) {
    ElMessage.error('只能上传 STP 或 STEP 格式的 3D 模型文件')
  }
  return isStp
}

//文件变化时设置 file 和文件名
const handleFileChange = (file, fileList) => {
  const rawFile = file.raw
  const extension = rawFile.name.split('.').pop()?.toLowerCase()
  if (extension === 'stp' || extension === 'step') {
    props.setFile(rawFile)
    fileName.value = rawFile.name
  } else {
    handleFileRemove()
  }
}

//删除文件时重置
const handleFileRemove = () => {
  fileName.value = ''
  props.setFile(null)
}

//超出限制时自动替换第一个
const handleFileExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

//父组件可调用的清空方法
const clear = () => {
  upload.value?.clearFiles()
  fileName.value = ''
  props.setFile(null)
}

defineExpose({ clear })
</script>