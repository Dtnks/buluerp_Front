<script setup lang="ts">
const props = defineProps({
  textTop: { type: String },
  number: { type: String },
  dataTop: { type: Array },
  dataBottom: { type: Array },
})
import { ref } from 'vue'
const barChart = ref(null)
</script>
<template>
  <div class="showNumber">
    <div class="row" style="justify-content: flex-end">
      <el-text style="flex: 1">{{ textTop }}</el-text>
      <img src="@/assets/icon/u52.png" class="icon" />
    </div>
    <div class="Number">{{ number }}</div>
    <div v-if="dataTop?.length == 1" ref="barChart" class="box col">
      <el-progress :show-text="false" :percentage="dataTop[0]" :stroke-width="15" />
    </div>
  </div>
</template>
<style scoped>
.showNumber {
  background-color: white;
  flex: 1;
  margin: 30px;
  height: 18vh;
  padding: 25px;

  box-shadow: var(--el-box-shadow-light);
}
.el-text {
  margin-right: 10px;
}
.Number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 2vh;
}
.box {
  border-bottom: 2px solid rgba(240, 242, 245, 1);
  padding-bottom: 3vh;
  height: 4vh;
  justify-content: flex-end;
  width: 100%;
}
.smallRow {
  height: 14px;
  width: 14px;
  margin: 0 6px;
}
.icon {
  width: 16px;
  height: 16px;
}
:deep(.el-progress-bar__outer),
:deep(.el-progress-bar__inner) {
  border-radius: inherit;
}
</style>
