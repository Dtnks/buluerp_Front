<script setup lang="ts">
import numberCard from '../component/numberCard.vue'
import { getOrdersData } from '@/apis/orderShow'
import { ref } from 'vue'
const deliveredCount = ref(0)
const UndeliveredCount = ref(0)
const punctualPercent = ref(0)
const orderStateCount = ref({})
const orderStateCountList = ref([])
getOrdersData().then((res) => {
  console.log(res)
  deliveredCount.value = res.data.deliveredCount
  UndeliveredCount.value = res.data.totalCount - res.data.deliveredCount
  punctualPercent.value = (res.data.punctualCount / res.data.deliveredCount) * 100
  orderStateCountList.value = [res.data.punctualRateWeekOnWeek, res.data.punctualRateDayOnDay]
})
const value = ref('')
// const defaultTime = new Date(2025, 7, 1, 12, 0, 0)
</script>

<template>
  <div class="col" style="flex: 1; background-color: rgba(240, 242, 245, 1)">
    <div class="row">
      <numberCard text-top="已交付订单笔数" :number="deliveredCount.toLocaleString()"></numberCard>
      <numberCard text-top="未交付订单" :number="UndeliveredCount.toLocaleString()"></numberCard>
      <numberCard
        :data-top="[punctualPercent]"
        text-top="订单准时交付率"
        :number="punctualPercent + '%'"
        :data-bottom="orderStateCountList"
      ></numberCard>
    </div>
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
            style="width: 250px"
          />
        </div>
      </div>
      <div style="flex: 1; position: relative; overflow: scroll">
        <div class="box col" style="top: 8vh; left: 4vw">
          <div>待设计</div>
          <div>{{ orderStateCount['创建(未审核)'] }}笔</div>
        </div>
        <div class="toright" style="top: 13vh; left: 12vw"></div>
        <div class="arrow-right" style="top: 12vh; left: 17vw"></div>

        <div class="box col" style="top: 8vh; left: 18vw">
          <div>设计中</div>
          <div>{{ orderStateCount['待设计'] }}笔</div>
        </div>
        <div class="toright" style="top: 13vh; left: 26vw"></div>
        <div class="arrow-right" style="top: 12vh; left: 31vw"></div>

        <div class="box col" style="top: 8vh; left: 32vw">
          <div>待外购布产</div>
          <div>{{ 5 }}笔</div>
        </div>
        <div class="toright" style="top: 13vh; left: 40vw"></div>
        <div class="arrow-right" style="top: 12vh; left: 45vw"></div>

        <div class="box col" style="top: 8vh; left: 46vw">
          <div>外购布产中</div>
          <div>{{ 3 }}笔</div>
        </div>
        <div class="toright" style="top: 13vh; left: 54vw"></div>
        <div class="arrow-right" style="top: 12vh; left: 59vw"></div>

        <div class="box col" style="top: 8vh; left: 60vw">
          <div>齐料入库</div>
          <div>{{ 3 }}笔</div>
        </div>
        <div class="toright" style="top: 13vh; left: 68vw"></div>
        <div class="arrow-right" style="top: 12vh; left: 73vw"></div>

        <div class="box col" style="top: 8vh; left: 74vw">
          <div>套料中</div>
          <div>{{ 12 }}笔</div>
        </div>
        <div class="tobottom" style="top: 18vh; left: 78vw"></div>
        <div class="arrow-bottom" style="top: 24vh; left: 77.5vw"></div>

        <div class="box col" style="top: 26vh; left: 74vw">
          <div>待拉线</div>
          <div>{{ 3 }}笔</div>
        </div>
        <div class="toright" style="top: 31vh; left: 68vw"></div>
        <div class="arrow-left" style="top: 30vh; left: 68vw"></div>

        <div class="box col" style="top: 26vh; left: 60vw">
          <div>拉线组包中</div>
          <div>{{ 3 }}笔</div>
        </div>
        <div class="toright" style="top: 31vh; left: 54vw"></div>
        <div class="arrow-left" style="top: 30vh; left: 54vw"></div>

        <div class="box col" style="top: 26vh; left: 46vw">
          <div>分包已入库</div>
          <div>{{ 3 }}笔</div>
        </div>
        <div class="toright" style="top: 31vh; left: 40vw"></div>
        <div class="arrow-left" style="top: 30vh; left: 40vw"></div>

        <div class="box col" style="top: 26vh; left: 32vw">
          <div>包装中</div>
          <div>{{ 3 }}笔</div>
        </div>
        <div class="toright" style="top: 31vh; left: 26vw"></div>
        <div class="arrow-left" style="top: 30vh; left: 26vw"></div>

        <div class="box col" style="top: 26vh; left: 18vw">
          <div>已发货</div>
          <div>{{ 3 }}笔</div>
        </div>
        <div class="toright" style="top: 31vh; left: 12vw"></div>
        <div class="arrow-left" style="top: 30vh; left: 12vw"></div>

        <div class="box col" style="top: 26vh; left: 4vw">
          <div>已完成</div>
          <div>{{ 3 }}笔</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#boxShow {
  height: 50vh;
  background-color: white;
  margin: 30px;
  box-shadow: var(--el-box-shadow-light);
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
  border: var(--el-border);
  position: absolute;
  box-shadow: var(--el-box-shadow-light);
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
  border-left: 1vw solid gray;
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
  border-top: 1vw solid gray;
  position: absolute;
}
.arrow-left {
  width: 0;
  height: 0;
  border-right: 1vw solid gray;
  border-top: 1vh solid transparent;
  border-bottom: 1vh solid transparent;
  position: absolute;
}
.tobottom {
  width: 1px;
  height: 8vh;
  background-color: gray;
  position: absolute;
}
</style>
