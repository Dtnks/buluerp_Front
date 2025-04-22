<script setup lang="ts">
import { RouterView } from 'vue-router'
import LayoutLeft from '@/views/layout/LayoutLeft.vue'
import LayoutTop from '@/views/layout/LayoutTop.vue'
import { ref } from 'vue'
const isCollapse = ref(0)
const handleHiddenMenu = () => {
  isCollapse.value = !isCollapse.value
  console.log(1111)
}
</script>

<template>
  <div class="row">
    <LayoutLeft :isCollapse="isCollapse" />
    <div class="col" style="flex: 1">
      <LayoutTop :handleHiddenMenu="handleHiddenMenu"></LayoutTop>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
