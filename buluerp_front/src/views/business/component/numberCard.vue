<script setup lang="ts">
const props = defineProps({
  textTop: { type: String },
  number: { type: String },
  dataTop: { type: Array },
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
    <div
      v-if="dataTop.length == 2"
      class="row"
      style="border-bottom: 1px solid gray; padding-bottom: 3vh"
    >
      <el-text style="flex: 1"
        >周同比:<img class="smallRow" v-if="dataTop[0] > 0" src="@/assets/icon/u58.png" /><img
          v-else
          class="smallRow"
          src="@/assets/icon/u62.png"
        />{{ dataTop[0] }}</el-text
      >
      <el-text style="flex: 1"
        >日环比:<img class="smallRow" v-if="dataTop[1] > 0" src="@/assets/icon/u58.png" /><img
          v-else
          class="smallRow"
          src="@/assets/icon/u62.png"
        />{{ dataTop[1] }}</el-text
      >
    </div>
    <div v-else-if="dataTop?.length == 1"></div>
    <div v-if="dataBottom" class="row" style="margin-top: 8px">
      <div v-if="dataBottom.length == 2">
        <el-text style="flex: 1"
          >周同比:<img class="smallRow" v-if="dataBottom[0] > 0" src="@/assets/icon/u58.png" /><img
            v-else
            class="smallRow"
            src="@/assets/icon/u62.png"
          />{{ dataBottom[0] }}</el-text
        >
        <el-text style="flex: 1"
          >日环比:<img class="smallRow" v-if="dataBottom[1] > 0" src="@/assets/icon/u58.png" /><img
            v-else
            class="smallRow"
            src="@/assets/icon/u62.png"
          />{{ dataBottom[1] }}</el-text
        >
      </div>
      <el-text v-else>月均营收额:{{ dataBottom[0].toLocaleString() }}</el-text>
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
}
.el-text {
  margin-right: 10px;
}
.Number {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 3vh;
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
</style>
