<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import informationCard from '../component/informationCard.vue';
import { reactive } from 'vue';
</script>

<template>
  <div class="col">
    <BordShow content="业务订单详情页" path="业务中心/详情" />
    <div style="flex: 1; background-color: rgba(240, 242, 245, 1) ; padding: 20px 40px 0 40px;">
      <informationCard title="业务订单基本信息">
        <a-row gutter="16" class="information-row">
          <!-- 订单ID -->
          <a-col :span="6">
            <div class="field">
              <label>订单ID</label>
              <div>1234567890000000</div>
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

        <a-row gutter="16" style="margin: 46px 0 16px 0;" class="information-row">
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
              <a-select placeholder="请选择" style="width: 100%;">
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
      <informationCard title="关联订单">
        <template #content>
          <div>内容</div>
        </template>
      </informationCard>

    </div>

  </div>
</template>

<style scoped lang="less">
.information-row {

  padding-left: 4px;

  * {

    margin-right: 11px;
  }
}
</style>
