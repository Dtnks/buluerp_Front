<script setup lang="ts">
import numberCard from '../component/numberCard.vue'
import boxShow from '../component/boxShow.vue'
import pieChart from '../component/pieChart.vue'
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
        :data-top="[12, 21, 32, 43, 8, 34, 65, 43, 21, 75, 32, 43, 8, 34, 32, 43, 8]"
        text-top="已交付订单笔数"
        :number="number2.toLocaleString()"
      ></numberCard>
      <numberCard
        :data-top="[12, 1, 23, 43, 8, 65, 23, 43, 8, 65, 23, 43, 8, 65, 23, 43, 8, 65]"
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
    <boxShow />
    <pieChart />
  </div>
</template>
<style></style>
