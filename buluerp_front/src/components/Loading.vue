<template>
  <div ref="ragRef"></div>
</template>
<script setup>
import { ElLoading } from 'element-plus'
import { ref, onUnmounted } from 'vue'
// 定义 div 的 ref
const ragRef = ref()
const ragRefInstance = ref()

ragRefInstance.value = ElLoading.service({
  target: ragRef.value,
  body: true,
  text: '加载中',
})

// 在组件卸载时关闭 ElLoading 实例
onUnmounted(() => {
  if (ragRefInstance.value) {
    ragRefInstance.value.close()
  }
})
</script>
