<template>
  <div class="col">
    <BordShow content="审核" path="用户中心/审核" />
    <div class="greyBack">
      <el-card style="margin: 0 20px;">
        <template #header>
          <div class="card-header">
            <span style="font-weight: bold;">审核列表</span>
            <el-select v-model="type" placeholder="请选择" style="width: 120px;" size="small">
              <el-option v-for="item in TypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
        </template>
        <el-table :data="tableData[type]" border style="width: 100%; margin-top: 10px;">
          <el-table-column type="selection" width="55" />
          <el-table-column v-for="col in columns[type]" :key="col.prop" :prop="col.prop" :label="col.label"
            :width="col.width" />
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button size="small" type="primary" @click="onAudit(scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
          <el-pagination background layout="prev, pager, next, jumper, ->, total, sizes"
            :total="tableData[type]?.length || 0" :page-size="10" />
        </div>
      </el-card>
    </div>
  </div>
</template>


<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import FormSearch from '@/components/form/Form.vue'
import TableList from '@/components/table/TableList.vue'
import { tableData, formData, TypeOptions, columns } from './data/auditData'
import { ref } from 'vue'
import { ElOption, ElSelect, ElPagination } from 'element-plus'
const props = defineProps(['control'])
const type = ref('order')
const onCreate = () => {
  console.log('Create clicked')
}

const onSubmit = () => {
  console.log('Submit clicked')
}

const onImport = () => {
  console.log('Import clicked')
}

const onDownloadTemplate = () => {
  console.log('Download Template clicked')
}


</script>

<style scoped lang="less">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
