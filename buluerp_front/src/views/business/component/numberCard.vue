<script setup lang="ts">
const props = defineProps({
  textTop: { type: String },
  number: { type: String },
  dataTop: { type: Array },
  textBottom: { type: String },
  dataBottom: { type: Array },
})
</script>
<template>
  <div class="showNumber">
    <div class="row" style="justify-content: flex-end">
      <el-text style="flex: 1">{{ textTop }}</el-text>
      <img src="@/assets/icon/u52.png" class="icon" />
    </div>

    <div class="Number">{{ number }}</div>
  </div>
</template>
<style scoped>
.showNumber {
  background-color: aqua;
  flex: 1;
  margin: 30px;
  height: 20vh;
  padding: 25px;
}
.Number {
  font-size: 28px;
  font-weight: bold;
}
.icon {
  width: 16px;
  height: 16px;
}
</style>
