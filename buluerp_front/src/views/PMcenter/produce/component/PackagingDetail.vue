<template>
  <div class="col">
    <BordShow content="分包详情页" path="生产管理/采购/分包表/分包详情页" />
    <div class="greyBack">
      <el-card class="detail-card">
        <template #header>
          <div class="card-header">分包详情</div>
        </template>
        <div class="detail-row" v-for="(row, index) in chunkedDisplayData" :key="index">
          <div v-for="(value, key) in row" :key="key" class="detail-item">
            <span class="detail-label">{{ getLabel(key) }}：</span>
            <span class="detail-value">
              {{ formatValue(value, key) }}
            </span>
          </div>
        </div>
      </el-card>
      <subCardPackaging :id="data.id" :bagList="data.bagList"></subCardPackaging>
    </div>
  </div>
</template>

<script setup lang="js">
import BordShow from '@/components/board/SecBoard.vue'
import { ElCard } from 'element-plus'
import subCardPackaging from '@/views/PMcenter/produce/component/subCardPackaging.vue'
const props = defineProps(['data'])

// 定义字段映射，包含标签和类型信息
const fieldMap = {
  id: { label: 'ID', type: 'text' },
  orderCode: { label: '订单编号', type: 'text' },
  creationTime: { label: '创建时间', type: 'date' },
  operator: { label: '操作人', type: 'text' },
  productId: { label: '产品编号', type: 'text' },
  productNameCn: { label: '产品名称', type: 'text' },
  releaseDate: { label: '发布日期', type: 'date' },
  accessoryType: { label: '配件种类', type: 'text' },
  accessoryTotal: { label: '配件数量/PCS', type: 'text' },
  productionLine: { label: '生产线', type: 'text' },
}

// 过滤掉值为 null 的字段
const displayData = {}
for (const key in props.data) {
  if (Object.keys(fieldMap).includes(key)) {
    displayData[key] = props.data[key]
  }
}

// 将 displayData 拆分成每行包含多个字段的数组，这里每行展示 3 个字段
const chunkedDisplayData = []
const chunkSize = 3
const keys = Object.keys(displayData)
for (let i = 0; i < keys.length; i += chunkSize) {
  const chunk = {}
  for (let j = 0; j < chunkSize && i + j < keys.length; j++) {
    const key = keys[i + j]
    chunk[key] = displayData[key]
  }
  chunkedDisplayData.push(chunk)
}

// 根据 key 获取对应的标签
const getLabel = (key) => {
  return fieldMap[key]?.label || key
}

// 格式化值
const formatValue = (value, key) => {
  const field = fieldMap[key]
  if (value === undefined || value === null) return ''
  if (field?.type === 'date') {
    return new Date(value).toLocaleString()
  }
  if (field?.type === 'Maptext') {
    return field.map[value] || value
  }
  if (Array.isArray(value) && value.length === 0) {
    return '无'
  }
  return value
}
</script>

<style scoped>
.detail-card {
  width: 100%;
}

.detail-row {
  display: flex;
  margin: 10px 0;
  /* 允许换行 */
  flex-wrap: wrap;
}

.detail-item {
  /* 每行展示 3 个，每个占 33.33% 宽度，减去间距 */
  width: calc(33.33% - 10px);
  margin-right: 10px;
  box-sizing: border-box;
}

/* 最后一个元素不添加右边距 */
.detail-item:last-child {
  margin-right: 0;
}

.detail-label {
  width: 120px;
  font-weight: bold;
  display: inline-block;
}

.detail-value {
  flex: 1;
}
</style>
