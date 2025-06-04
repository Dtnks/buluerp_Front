<script setup lang="ts">
import upload from '@/components/upload/uploadImage.vue'
let fileValue = {}
const setFile = (file: any) => {
  fileValue = file
}
</script>
<template>
  <div>dwadwa</div>
  <upload :setFile="setFile" />
</template>
