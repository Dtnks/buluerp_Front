<script setup lang="ts">
import { GetMessage } from '@/apis/layout'
const message = ref()
GetMessage().then((res) => {
  message.value = res
})
</script>
<template>
  <div>{{ message.value }}</div>
</template>
