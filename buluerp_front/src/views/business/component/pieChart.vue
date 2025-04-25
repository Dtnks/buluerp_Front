<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
const chartDom = ref(null)
const data = [
  { value: 1048, name: '家用电器' },
  { value: 735, name: '食用酒水' },
  { value: 580, name: '个护健康' },
  { value: 484, name: '服饰箱包' },
  { value: 300, name: '母婴产品' },
  { value: 642, name: '其 他    ' },
]
onMounted(() => {
  const myChart = echarts.init(chartDom.value)
  const option = {
    color: ['#3aa0ff', '#36cbcb', '#4dcb73', '#fad337', '#f2637b', '#975fe4'],
    tooltip: {
      trigger: 'item',
    },
    legend: {
      icon: 'circle',
      orient: 'vertical',
      x: 'right',
      align: 'left',
      y: 'center',
      textStyle: {
        color: '#666',
      },
      itemGap: 30,
      formatter: function (name) {
        // 添加
        let total = 0
        let target
        for (let i = 0; i < data.length; i++) {
          total += data[i].value
          if (data[i].name === name) {
            target = data[i].value
          }
        }
        const arr = [name, '|  ' + ((target / total) * 100).toFixed(2) + '%', '       ¥ ' + target]
        return arr.join('  ')
      },
    },
    series: [
      {
        name: '物料消耗占比',
        type: 'pie',
        radius: ['48%', '60%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 5,

        label: {
          show: false,
          normal: {
            show: true,
            position: 'center',
            color: '#9A9EBA',
            fontSize: 25,
            formatter: `销售额\n¥ ${Number(2133421).toLocaleString()}`,
          },
          emphasis: {
            //中间文字显示
            show: true,
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  }

  option && myChart.setOption(option)
})
const active = ref()
const handleActive = (value) => {
  active.value = value
}
</script>
<template>
  <div id="chart" class="col">
    <div class="header row">
      <div>物料消耗占比</div>
      
    </div>
    <div class="cate row">
      <span :class="active == 0 ? 'active' : 'nonActive'" @click="handleActive(0)">内部物料</span>
      <span :class="active == 1 ? 'active' : 'nonActive'" @click="handleActive(1)">外购物料</span>
      <span :class="active == 2 ? 'active' : 'nonActive'" @click="handleActive(2)">染料</span>
    </div>
    <div ref="chartDom" class="chartDom"></div>
  </div>
</template>
<style scoped>
#chart {
  height: 60vh;
  margin: 30px;
  width: 36vw;
  background-color: white;
}
.chartDom {
  width: 36vw;
  height: 50vh;
}
.header {
  height: 6vh;
  line-height: 6vh;
  padding: 0 24px;
  justify-content: space-between;
  border-bottom: 2px solid rgba(240, 242, 245, 1);
}
.cate {
  padding: 20px;
}
.cate span:first-child {
  border-left: 1px solid gray;
}
.active {
  border: 1.5px solid #1991ff !important;
  color: #1991ff;
  cursor: pointer;
  user-select: none;
  padding: 4px;
}
.nonActive {
  border: 1px solid gray;
  cursor: pointer;
  user-select: none;
  padding: 4px;
}
</style>
