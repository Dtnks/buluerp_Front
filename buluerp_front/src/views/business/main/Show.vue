<script setup lang="ts">
const data = []
import numberCard from '../component/numberCard.vue'
const number1 = 126650
const number2 = 6560
const number3 = 12
const number4 = 0.85
</script>

<template>
  <div class="col" style="flex: 1; background-color: rgba(240, 242, 245, 1)">
    <div class="row">
      <numberCard
        text-top="营收情况"
        :number="number1.toLocaleString()"
        :data-top="[12, -21]"
        :data-bottom="[12423]"
      ></numberCard>
      <numberCard
        :data-top="[12, -21, 32]"
        text-top="已交付订单笔数"
        :number="number2.toLocaleString()"
      ></numberCard>
      <numberCard
        :data-top="[12, -21, 23]"
        text-top="未交付订单"
        :number="number3.toLocaleString()"
      ></numberCard>
      <numberCard
        :data-top="[85]"
        text-top="订单准时交付率"
        :number="number4 * 100 + '%'"
        :data-bottom="[12, 31]"
      ></numberCard>
    </div>
    <div id="boxShow"></div>
    <div id="chart"></div>
  </div>
</template>
<style>
#boxShow {
  height: 40vh;
  background-color: aquamarine;
  margin: 30px;
}
#chart {
  height: 60vh;
  margin: 30px;
  width: 45vw;
  background-color: bisque;
}
</style>
