<template>
  <div ref="ragRef"></div>
</template>
<script setup>
import { ElLoading } from 'element-plus'
import { ref } from 'vue'
//定义div的ref
const ragRef = ref()
const ragRefInstance = ref()
ragRefInstance.value = ElLoading.service({
  target: ragRef.value,
  body: true,
  text: 'Loading...',
})
</script>
