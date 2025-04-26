<script setup lang="ts">
import { ref } from 'vue'
const value = ref('')

const defaultTime = new Date(2000, 1, 1, 12, 0, 0)
</script>

<template>
  <div id="boxShow" class="col">
    <div class="row header">
      <div class="title">公司业务订单情况</div>
      <div class="timeSelect">
        <span>今日</span><span>本周</span><span>本月</span><span>全年</span
        ><el-date-picker
          v-model="value"
          type="daterange"
          start-placeholder="Start date"
          end-placeholder="End date"
          :default-time="defaultTime"
          style="width: 250px"
        />
      </div>
    </div>
    <div style="flex: 1; position: relative">
      <div class="box col" style="top: 8vh; left: 4vw">
        <div>初始状态</div>
        <div>{{ 21 }}笔</div>
      </div>
      <div class="toright" style="top: 13vh; left: 12vw"></div>
      <div class="arrow-right" style="top: 12vh; left: 17.5vw"></div>

      <div class="box col" style="top: 8vh; left: 18vw">
        <div>设计中</div>
        <div>{{ 3 }}笔</div>
      </div>
      <div class="toright" style="top: 13vh; left: 26vw"></div>
      <div class="arrow-right" style="top: 12vh; left: 31.5vw"></div>

      <div class="box col" style="top: 8vh; left: 32vw">
        <div>生产计划设计中</div>
        <div>{{ 5 }}笔</div>
      </div>
      <div class="toright" style="top: 13vh; left: 40vw"></div>
      <div class="arrow-right" style="top: 12vh; left: 45.5vw"></div>

      <div class="box col" style="top: 8vh; left: 46vw">
        <div>生产中</div>
        <div>{{ 3 }}笔</div>
      </div>
      <div class="toright" style="top: 13vh; left: 54vw"></div>
      <div class="arrow-right" style="top: 12vh; left: 59.5vw"></div>

      <div class="box col" style="top: 8vh; left: 60vw">
        <div>拉线中</div>
        <div>{{ 3 }}笔</div>
      </div>
      <div class="toright" style="top: 13vh; left: 68vw"></div>
      <div class="arrow-right" style="top: 12vh; left: 73.5vw"></div>

      <div class="box col" style="top: 8vh; left: 74vw">
        <div>已收货</div>
        <div>{{ 12 }}笔</div>
      </div>

      <div class="box col" style="top: 26vh; left: 32vw">
        <div>采购中</div>
        <div>{{ 3 }}笔</div>
      </div>
      <div class="tobottom" style="top: 18vh; left: 36vw"></div>
      <div class="arrow-bottom" style="top: 25.2vh; left: 35.5vw"></div>
    </div>
  </div>
</template>
<style scoped>
#boxShow {
  height: 50vh;
  background-color: white;
  margin: 30px;
}
.header {
  height: 6vh;
  line-height: 6vh;
  padding: 0 24px;
  justify-content: space-between;
  border-bottom: 2px solid rgba(240, 242, 245, 1);
}
.timeSelect span {
  margin: 0 12px;
}
.box {
  width: 8vw;
  height: 10vh;
  border: 1px solid black;
  position: absolute;
  justify-content: center;
}
.box div {
  text-align: center;
}
.arrow-right {
  width: 0;
  height: 0;
  border-top: 1vh solid transparent;
  border-bottom: 1vh solid transparent;
  border-left: 1vh solid gray;
  position: absolute;
}
.toright {
  width: 6vw;
  height: 1px;
  background-color: gray;
  position: absolute;
}
.arrow-bottom {
  width: 0;
  height: 0;
  border-left: 1vh solid transparent;
  border-right: 1vh solid transparent;
  border-top: 1vh solid gray;
  position: absolute;
}
.tobottom {
  width: 1px;
  height: 8vh;
  background-color: gray;
  position: absolute;
}
</style>
