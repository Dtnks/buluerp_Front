<template>
  <el-upload
    ref="upload"
    :before-upload="beforeUpload"
    :on-change="handleFileChange"
    :on-remove="handleFileRemove"
    :on-exceed="handleFileExceed"
    :auto-upload="false"
    :limit="1"
    style="margin: 20px; width: 200px; height: 200px; text-align: center"
  >
    <img v-if="imgShowUrl" :src="imgShowUrl" class="cover" style="width: 150px; height: 150px" />
    <div v-else class="centerText">上传样例图</div>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, watch, defineExpose } from 'vue'
import { genFileId, ElMessage } from 'element-plus'

const props = defineProps<{
  setFile: (file: File | null) => void
  initialUrl?: string
}>()

const upload = ref()
const imgShowUrl = ref('')

//监听初始 URL
watch(
  () => props.initialUrl,
  (url) => {
    imgShowUrl.value = url || ''
    if (!url && upload.value) {
      upload.value.clearFiles() // 清除已上传文件
    }
  },
  { immediate: true },
)

// 上传前校验：只能是图片
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片格式（如 JPG、PNG）')
  }
  return isImage
}

//文件变化时设置 URL 和 file
const handleFileChange = (file, fileList) => {
  const rawFile = file.raw
  props.setFile(rawFile)
  imgShowUrl.value = URL.createObjectURL(rawFile)
}

//删除文件时重置
const handleFileRemove = () => {
  imgShowUrl.value = ''
  props.setFile(null)
}

//超出限制时自动替换第一张
const handleFileExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

//父组件可调用的清空方法
const clear = () => {
  upload.value?.clearFiles()
  imgShowUrl.value = ''
  props.setFile(null)
}

defineExpose({ clear })
</script>
