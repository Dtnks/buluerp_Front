<template>
  <el-upload
    ref="upload"
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
import { ref, watch } from 'vue'
import { genFileId } from 'element-plus'

const props = defineProps<{
  setFile: (file: File | null) => void
  initialUrl?: string
}>()

const upload = ref()
const imgShowUrl = ref('')

watch(
  () => props.initialUrl,
  (url) => {
    imgShowUrl.value = url || ''
  },
  { immediate: true },
)

const handleFileChange = (file, fileList) => {
  const rawFile = file.raw
  props.setFile(rawFile)
  imgShowUrl.value = URL.createObjectURL(rawFile)
}

const handleFileRemove = () => {
  imgShowUrl.value = ''
  props.setFile(null)
}

const handleFileExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
</script>
<!-- 支持回显的上传组件 -->
