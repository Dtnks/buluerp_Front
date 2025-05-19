<template>
  <div>
    <el-config-provider :locale="zhCn">
      <BordShow content="业务订单查询列表" path="业务中心/查询" />
      <div class="query-container">
        <el-card class="form-container">
          <QueryForm></QueryForm>
          <QueryTable :queryParams="searchParams" :addTab="props.addTab"></QueryTable>
        </el-card>
      </div>
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import BordShow from '@/components/board/SecBoard.vue';
// import type { FormInstance } from 'element-plus';
// import type { ElForm } from 'element-plus';
// import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton, ElTable, ElTableColumn, ElPagination } from 'element-plus';
// import { Search } from '@element-plus/icons-vue';
import QueryForm from '../component/queryForm.vue';
import QueryTable from '../component/queryTable.vue';

// defineProps({
//   addTab: Function,
// });
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
}>()
const searchParams = ref<Record<string, any>>({}) // 初始为空对象

const handleSearch = (params: Record<string, any>) => {

  const filteredParams = {
    productCode: params.productCode || null,
    productName: params.productName || null,
  }
  searchParams.value = filteredParams
}
</script>

<style scoped lang="less">
.query-container {
  background-color: white;
  padding: 0 30px 20px 30px;

  .form-container {
    background-color: white;
  }
}



// .input {
//   margin-bottom: 20px;
// }

.form-buttons {
  display: flex;
  gap: 0 20px;
  justify-content: flex-end;
  // margin-right: 10px;
  // margin-top: 10px;
}

// .el-table {
//   margin-top: 20px;
// }

::v-deep(.table-container .el-card__body) {
  padding: 0 !important;
}
</style>
