<script setup lang="ts">
import { storeRecording } from '@/apis/produceControl/inventory/AllInventory'
storeRecording('part').then((res) => {
  console.log(res)
})
</script>
<template>
  <div></div>
</template>
