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
  deliveredCount.value = res.data.deliveredCount
  UndeliveredCount.value = res.data.totalCount - res.data.deliveredCount
  punctualPercent.value = ((res.data.punctualCount / res.data.deliveredCount) * 100 ).toFixed(2)
  orderStateCountList.value = [res.data.punctualRateWeekOnWeek, res.data.punctualRateDayOnDay]
  orderStateCount.value = res.data.statusCount
})

const value = ref('')
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
      </div>
      <div style="flex: 1; position: relative; overflow: auto">
        <div class="flowchart-wrapper">
          <div class="box col" style="top: 86px; left: 77px">
            <div>创建(未审核)</div>
            <div>{{ orderStateCount['创建(未审核)']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 140px; left: 192px"></div>
          <div class="arrow-right" style="top: 129px; left: 288px"></div>

          <div class="box col" style="top: 86px; left: 307px">
            <div>待设计</div>
            <div>{{ orderStateCount['待设计'] || 0 }}笔</div>
          </div>
          <div class="toright" style="top: 140px; left: 422px"></div>
          <div class="arrow-right" style="top: 129px; left: 518px"></div>

          <div class="box col" style="top: 86px; left: 538px">
            <div>设计中</div>
            <div>{{ orderStateCount['设计中']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 140px; left: 653px"></div>
          <div class="arrow-right" style="top: 129px; left: 749px"></div>

          <div class="box col" style="top: 86px; left: 768px">
            <div>待布产</div>
            <div>{{ orderStateCount['待制定布产计划']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 140px; left: 883px"></div>
          <div class="arrow-right" style="top: 129px; left: 979px"></div>

          <div class="box col" style="top: 86px; left: 998px">
            <div>待排产</div>
            <div>{{ orderStateCount['待排产']||0}}笔</div>
          </div>
          <div class="toright" style="top: 140px; left: 1113px"></div>
          <div class="arrow-right" style="top: 129px; left: 1209px"></div>

          <div class="box col" style="top: 86px; left: 1228px">
            <div>排产中</div>
            <div>{{ orderStateCount['排产中']||0}}笔</div>
          </div>
          <div class="box col" style="top: 86px; left: 1460px">
            <div>待采购</div>
            <div>{{ orderStateCount['生产完成(待采购完成)']||0}}笔</div>
          </div>
          <div class="toright" style="top: 140px; left: 1344px"></div>
          <div class="arrow-right" style="top: 129px; left: 1440px"></div>

          <div class="tobottom" style="top: 194px; left: 1517px"></div>
          <div class="arrow-bottom" style="top: 259px; left: 1507px"></div>
          <div class="box col" style="top: 281px; left: 1460px">
              <div>齐料入库</div>
              <div>{{ orderStateCount['已齐料入库(待套料)']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 335px; left: 1344px"></div>
          <div class="arrow-left" style="top: 324px; left: 1344px"></div>

          <div class="box col" style="top: 281px; left: 1228px">
            <div>套料中</div>
            <div>{{ orderStateCount['套料中']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 335px; left: 1113px"></div>
          <div class="arrow-left" style="top: 324px; left: 1113px"></div>

          <div class="box col" style="top: 281px; left: 998px">
            <div>待拉线</div>
            <div>{{ orderStateCount['套料完成(待拉线)']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 335px; left: 883px"></div>
          <div class="arrow-left" style="top: 324px; left: 883px"></div>

          <div class="box col" style="top: 281px; left: 768px">
            <div>拉线组包中</div>
            <div>{{ orderStateCount['拉线组包中']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 335px; left: 653px"></div>
          <div class="arrow-left" style="top: 324px; left: 653px"></div>

          <div class="box col" style="top: 281px; left: 538px">
            <div>分包已入库</div>
            <div>{{ orderStateCount['拉线完成(分包已入库)']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 335px; left: 422px"></div>
          <div class="arrow-left" style="top: 324px; left: 422px"></div>

          <div class="box col" style="top: 281px; left: 307px">
            <div>包装中</div>
            <div>{{ orderStateCount['包装中']||0 }}笔</div>
          </div>
          <div class="toright" style="top: 335px; left: 192px"></div>
          <div class="arrow-left" style="top: 324px; left: 192px"></div>

          <div class="box col" style="top: 281px; left: 77px">
            <div>已发货</div>
            <div>{{ orderStateCount['已发货']||0 }}笔</div>
          </div>
          <div class="tobottom" style="top: 389px; left: 134px"></div>
          <div class="arrow-bottom" style="top: 454px; left: 125px"></div>

          <div class="box col" style="top: 475px; left: 77px">
            <div>已完成</div>
            <div>{{ orderStateCount['已完成']||0 }}笔</div>
          </div>

          <div class="box col" style="top: 475px; left: 307px">
            <div>审核不通过</div>
            <div>{{ orderStateCount['审核不通过'] || 0 }}笔</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#boxShow {
  height: 648px;
  background-color: white;
  margin: 30px;
  box-shadow: var(--el-box-shadow-light);
}
.header {
  height: 65px;
  line-height: 65px;
  padding: 0 24px;
  justify-content: space-between;
  border-bottom: 2px solid rgba(240, 242, 245, 1);
}
.timeSelect span {
  margin: 0 12px;
}
.box {
  width: 115px;
  height: 108px;
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
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  border-left: 19px solid gray;
  position: absolute;
}
.toright {
  width: 115px;
  height: 1px;
  background-color: gray;
  position: absolute;
}
.arrow-bottom {
  width: 0;
  height: 0;
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-top: 19px solid gray;
  position: absolute;
}

.arrow-left {
  width: 0;
  height: 0;
  border-right: 19px solid gray;
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  position: absolute;
}
.tobottom {
  width: 1px;
  height: 86px;
  background-color: gray;
  position: absolute;
}
.flowchart-wrapper {
  transform-origin: top left;
  transform: scale(0.85);
}

</style>
