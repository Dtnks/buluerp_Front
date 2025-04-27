<script setup lang="ts">
import { RouterView } from 'vue-router'
import LayoutLeft from '@/views/layout/main/LayoutLeft.vue'
import LayoutTop from '@/views/layout/main/LayoutTop.vue'
import { ref } from 'vue'
const isCollapse = ref(false)
const handleHiddenMenu = () => {
  isCollapse.value = !isCollapse.value
}
</script>
<template>
  <div class="row">
    <LayoutLeft :isCollapse="isCollapse" />
    <div class="col" style="flex: 1; height: 100vh; overflow-y: scroll">
      <LayoutTop :handleHiddenMenu="handleHiddenMenu"></LayoutTop>
      <RouterView />
    </div>
  </div>
</template>
