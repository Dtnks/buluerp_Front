<script setup lang="ts">
import useTabStore from '@/stores/modules/tabs'
const store = useTabStore()
</script>
<template>
  <div
    @click="
      () => {
        store.changeTabName('产品查询', '产品查询修改')
      }
    "
  ></div>
</template>
