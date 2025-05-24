<template>
<<<<<<< HEAD
  <div class="greyBack">
    <informationCard title="业务订单基本信息">
      <a-row gutter="16" class="information-row">
        <!-- 订单ID -->
        <a-col :span="6">
          <div class="field">
            <label>订单ID</label>
            <div>data.innerId</div>
          </div>
        </a-col>
        <!-- 创建日期 -->
        <a-col :span="6">
          <div class="field">
            <label>创建日期</label>
            <div>2025-04-01 23:11:11</div>
          </div>
        </a-col>

        <!-- 订单状态 -->
        <a-col :span="6">
          <div class="field">
            <label>订单状态</label>
            <div>初始状态</div>
          </div>
        </a-col>
      </a-row>

      <a-row gutter="16" style="margin: 46px 0 16px 0" class="information-row">
        <!-- 客户姓名 -->
        <a-col :span="6">
          <div class="field">
            <label>客户姓名</label>
            <a-input placeholder="请输入" />
          </div>
        </a-col>

        <!-- 支付日期 -->
        <a-col :span="6">
          <div class="field">
            <label>支付日期</label>
            <a-range-picker />
          </div>
        </a-col>

        <!-- 其他基本信息 -->
        <a-col :span="6">
          <div class="field">
            <label>其他基本信息</label>
            <a-select placeholder="请选择" style="width: 100%">
              <a-select-option value="1">选项1</a-select-option>
              <a-select-option value="2">选项2</a-select-option>
            </a-select>
          </div>
        </a-col>
      </a-row>
    </informationCard>
    <informationCard title="订单详情">
      <a-table>
        <a-table-column title="产品名称" dataIndex="productName" />
        <a-table-column title="数量" dataIndex="quantity" />
        <a-table-column title="单价" dataIndex="unitPrice" />
        <a-table-column title="总价" dataIndex="totalPrice" />
      </a-table>
    </informationCard>
=======
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
            <div>{{ detail.createTime || '暂无数据' }}</div>
          </div>
        </el-col>
        <!-- 订单状态 -->
        <el-col :span="6">
          <div class="field">
            <label>订单状态</label>
            <div>{{ status }}</div>
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
>>>>>>> 3fd9737a41b20e9369b4964877d44dac7339d7b5
    <informationCard title="关联订单">
      <template #content>
        <div>内容</div>
      </template>
    </informationCard>
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD
import informationCard from './informationCard.vue'
import { onMounted, ref } from 'vue'
import { getOderDetail } from '@/apis/orders.js'
=======
import informationCard from './informationCard.vue';
import { onMounted, ref } from 'vue';
import { getStatusText } from '../utils/statusMap';


// Props
// defineProps(['innerId', 'customerName', 'status', 'createdTime']);
const props = defineProps<{
  detail: any;
}>();


onMounted(() => {

  // 组件挂载后执行的逻辑
  console.log('DetailShow.vue-mount');
  console.log('DetailShow.vue-props.detail.createdTime', props.detail.createdTime);
});
// 订单状态
const status = ref(getStatusText(props.detail.status));

// 支付日期
const payDate = ref([]);

// 订单详情数据
const orderDetails = ref([
  { productName: '产品1', quantity: 10, unitPrice: 100, totalPrice: 1000 },
  { productName: '产品2', quantity: 5, unitPrice: 200, totalPrice: 1000 },
]);
>>>>>>> 3fd9737a41b20e9369b4964877d44dac7339d7b5
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
