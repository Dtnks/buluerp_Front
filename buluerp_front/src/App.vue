<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  document.body.style.setProperty('--el-text-color-secondary', 'black')
  document.body.style.setProperty('--el-text-color-regular', 'black')
})
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped></style>
