<template>
  <el-upload
    ref="upload"
    :on-change="handleFileChange"
    :on-remove="handleFileRemove"
    :on-exceed="handleFileExceed"
    style="margin: 20px; width: 200px; height: 200px; text-align: center"
    :auto-upload="false"
    :limit="1"
  >
    <img v-if="imgShowUrl" :src="imgShowUrl" class="cover" style="width: 150px; height: 150px" />
    <div v-else class="centerText">上传样例图</div>
  </el-upload>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { genFileId } from 'element-plus'
import { getFullImageUrl } from '@/utils/image/getUrl'

const props = defineProps(['setFile', 'ImgUrl', 'setImgUrl'])
const imgShowUrl = ref('')
const upload = ref()
watch(
  () => props.ImgUrl,
  (newImgUrl) => {
    if (newImgUrl != 'created') {
      imgShowUrl.value = newImgUrl ? getFullImageUrl(newImgUrl) : ''
    }

    if (!newImgUrl && upload.value) {
      upload.value.clearFiles()
    }
  },
)
imgShowUrl.value = props.ImgUrl ? getFullImageUrl(props.ImgUrl) : ''
const handleFileChange = (file, fileList) => {
  props.setFile(file.raw)
  imgShowUrl.value = URL.createObjectURL(file.raw)
  props.setImgUrl('created')
}
const handleFileRemove = () => {
  imgShowUrl.value = ''
}
const handleFileExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}
</script>
