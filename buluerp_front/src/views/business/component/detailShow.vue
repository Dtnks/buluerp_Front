<template>
  <div style="flex: 1; background-color: rgba(240, 242, 245, 1); padding: 20px 40px 0 40px">
    <!-- 业务订单基本信息 -->
    <informationCard title="业务订单基本信息">
      <el-row :gutter="16" class="information-row">
        <!-- 订单ID -->
        <el-col :span="6">
          <div class="field">
            <label>订单ID</label>
            <div>{{ detail.innerId }}</div>

          </div>
        </el-col>
        <!-- 创建日期 -->
        <el-col :span="6">
          <div class="field">
            <label>创建日期</label>
            <div>{{ detail.createdTime }}</div>
          </div>
        </el-col>
        <!-- 订单状态 -->
        <el-col :span="6">
          <div class="field">
            <label>订单状态</label>
            <div>{{ detail.status }}</div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="16" style="margin: 46px 0 16px 0" class="information-row">
        <!-- 客户姓名 -->
        <el-col :span="6">
          <div class="field">
            <label>客户姓名</label>
            <el-input placeholder="请输入" />
          </div>
        </el-col>
        <!-- 支付日期 -->
        <el-col :span="6">
          <div class="field">
            <label>支付日期</label>
            <el-date-picker v-model="payDate" type="daterange"  start-placeholder="开始日期" end-placeholder="结束日期" style="width: 300px;"/>
          </div>
        </el-col>
        <!-- 其他基本信息 -->
        <el-col :span="6">
          <div class="field">
            <label>其他基本信息</label>
            <el-select placeholder="请选择" style="width: 100%">
              <el-option label="选项1" value="1" />
              <el-option label="选项2" value="2" />
            </el-select>
          </div>
        </el-col>
      </el-row>
    </informationCard>

    <!-- 订单详情 -->
    <informationCard title="订单详情">
      <el-table :data="orderDetails" style="width: 100%">
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="totalPrice" label="总价" />
      </el-table>
    </informationCard>

    <!-- 关联订单 -->
    <informationCard title="关联订单">
      <template #content>
        <div>内容</div>
      </template>
    </informationCard>
  </div>
</template>

<script setup lang="ts">
import informationCard from './informationCard.vue';
import { ref } from 'vue';

// Props
// defineProps(['innerId', 'customerName', 'status', 'createdTime']);
const props = defineProps<{
  detail: any;
}>();

// 支付日期
const payDate = ref([]);

// 订单详情数据
const orderDetails = ref([
  { productName: '产品1', quantity: 10, unitPrice: 100, totalPrice: 1000 },
  { productName: '产品2', quantity: 5, unitPrice: 200, totalPrice: 1000 },
]);
</script>

<style scoped lang="less">
.information-row {
  padding-left: 4px;

  * {
    margin-right: 11px;
  }
}
.field {
  margin-bottom: 16px;
}
</style>
