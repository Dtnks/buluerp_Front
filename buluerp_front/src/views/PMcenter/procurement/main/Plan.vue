<script setup lang="ts">
import { getList } from '@/apis/produceControl/purchase/purchasePlan'
getList().then((res) => console.log(res, 'list'))
</script>
<template>
  <div></div>
</template>
