<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>展示</span>
        <el-button type="primary" @click="exportFunc(select!.getSelectionRows())">导出</el-button>
      </div>
    </template>
    <div>
      <el-table :data="listData" border style="width: 100%" ref="select">
        <el-table-column type="selection" width="55" />

        <el-table-column
          :prop="item.value"
          :label="item.label"
          v-for="item in tableData"
          :key="item.value"
        />
        <el-table-column label="操作" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              text
              @click="operation.func(row.id)"
              v-for="operation in operations"
              >{{ operation.value }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <slot></slot>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineProps(['tableData', 'operations', 'listData', 'exportFunc'])
const select = ref()
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
