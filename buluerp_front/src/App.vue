<script setup lang="ts">
import { RouterView } from 'vue-router'
import LayoutLeft from '@/views/layout/LayoutLeft.vue'
import LayoutTop from '@/views/layout/LayoutTop.vue'
</script>

<template>
  <div class="row">
    <LayoutLeft />
    <div class="col">
      <LayoutTop></LayoutTop>
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
