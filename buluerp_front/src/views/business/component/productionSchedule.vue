<template>
  <div>
    productionSchedule

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
    data: { orderId: number}
}>();
</script>

<style scoped></style>
