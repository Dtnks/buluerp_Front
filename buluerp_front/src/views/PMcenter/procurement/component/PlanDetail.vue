<template>
  {{ data }}
  <div class="greyBack">
    <el-card>
      <el-row gutter="20">
        <el-col span="20"
          ><img
            :src="getFullImageUrl(data.pictureUrl)"
            style="width: 100%; height: 100%"
            v-if="data.pictureUrl"
        /></el-col>
        <el-col span="20">
          <div><span>ID:</span>{{ data.id }}</div>
          <div><span>操作人:</span>{{ data.operator }}</div>
          <div><span>产品ID:</span>{{ data.productId }}</div>
          <div><span>颜色编号:</span>{{ data.colorCode }}</div>
          <div><span>料别:</span>{{ data.materialType }}</div>
          <div><span>采购重量:</span>{{ data.purchaseWeight }}</div>
          <div><span>单重:</span>{{ data.singleWeight }}</div>
          <div><span>规格:</span>{{ data.specification }}</div>
          <div><span>数量:</span>{{ data.purchaseQuantity }}</div>
          <div><span>模具编号:</span>{{ data.mouldNumber }}</div>
        </el-col>
        <el-col span="20">
          <div><span>预交时间:</span>{{ data.deliveryDate }}</div>
          <div><span>创建时间:</span>{{ data.creationTime }}</div>
          <div><span>下单时间:</span>{{ data.orderTime }}</div>
          <div><span>供应商:</span>{{ data.supplier }}</div>
          <div><span>备注:</span>{{ data.remarks }}</div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { getFullImageUrl } from '@/utils/image/getUrl'
const props = defineProps(['data'])
</script>
<style scoped>
div span {
  display: inline-block;
  width: 80px;
  text-align: right;
  padding-right: 10px;
}
.el-col {
  margin-right: 60px;
}
</style>
