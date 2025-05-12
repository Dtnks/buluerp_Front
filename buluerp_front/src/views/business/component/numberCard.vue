<script setup lang="ts">
const props = defineProps({
  textTop: { type: String },
  number: { type: String },
  dataTop: { type: Array },
  dataBottom: { type: Array },
})
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
const barChart = ref(null)
const progressChart = ref(null)
onMounted(() => {
  if (props.dataTop.length > 2) {
    const myChart = echarts.init(progressChart.value)
    const option = {
      color: ['#1991ff'],
      grid: {
        left: '0%',
        right: '0%',
        bottom: '3%',
        containLabel: true,
        width: '100%',
        height: '3vh',
      },
      xAxis: [
        {
          show: false,
          data: props.dataTop,
        },
      ],
      yAxis: [
        {
          show: false,
          type: 'value',
          inverse: true,
          axisLabel: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: props.dataTop,
        },
      ],
      axisLabel: {
        show: false, // 不显示坐标轴上的文字
      },
    }

    option && myChart.setOption(option)
  }
})
</script>
<template>
  <div class="showNumber">
    <div class="row" style="justify-content: flex-end">
      <el-text style="flex: 1">{{ textTop }}</el-text>
      <img src="@/assets/icon/u52.png" class="icon" />
    </div>
    <div class="Number">{{ number }}</div>
    <div v-if="dataTop.length == 2" class="row box">
      <el-text style="flex: 1"
        >周同比:<img class="smallRow" v-if="dataTop[0] > 0" src="@/assets/icon/u58.png" /><img
          v-else
          class="smallRow"
          src="@/assets/icon/u62.png"
        />{{ Math.abs(dataTop[0]) }}%</el-text
      >
      <el-text style="flex: 1"
        >日环比:<img class="smallRow" v-if="dataTop[1] > 0" src="@/assets/icon/u58.png" /><img
          v-else
          class="smallRow"
          src="@/assets/icon/u62.png"
        />{{ Math.abs(dataTop[1]) }}%</el-text
      >
    </div>
    <div v-else-if="dataTop?.length == 1" ref="barChart" class="box col">
      <el-progress :show-text="false" :percentage="dataTop[0]" :stroke-width="15" />
    </div>
    <div v-else ref="progressChart" class="box"></div>
    <div v-if="dataBottom" class="row" style="margin-top: 8px">
      <div v-if="dataBottom.length == 2" class="row" style="width: 100%">
        <el-text style="flex: 1"
          >周同比:<img class="smallRow" v-if="dataBottom[0] > 0" src="@/assets/icon/u58.png" /><img
            v-else
            class="smallRow"
            src="@/assets/icon/u62.png"
          />{{ Math.abs(dataBottom[0]) }}%</el-text
        >
        <el-text style="flex: 1"
          >日环比:<img class="smallRow" v-if="dataBottom[1] > 0" src="@/assets/icon/u58.png" /><img
            v-else
            class="smallRow"
            src="@/assets/icon/u62.png"
          />{{ Math.abs(dataBottom[1]) }}%</el-text
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
