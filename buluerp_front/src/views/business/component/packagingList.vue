<template>
  <div>
    <Form :data="packagingListData" :formState="formState" :title="packagingTitle" :searchForm="searchForm"></Form>
    <el-card style="margin: 20px;">
      <template #header>
        <div class="card-header">
          <span>分包列表</span>
        </div>
      </template>
      <el-table :data="packagingList" border style="width: 100%">
        <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
          <!-- <template #default="{ row }">
          <span v-if="column.type === 'input'">{{ row[column.key] }}</span>
          <span v-else-if="column.type === 'text'">{{ row[column.key] }}</span>
          <span v-else-if="column.type === 'date'">{{ new Date(row[column.key]).toLocaleDateString() }}</span>
        </template> -->

        </el-table-column>
      </el-table>
    </el-card>

    <!-- <TableList :tableData="tableData" :operations="[]" :listData="packagingListDetail" :DeleteFunc="DeleteFunc"
      :control="props.data.control"></TableList> -->

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import Form from '@/components/form/Form.vue';
import TableList from '@/components/table/TableList.vue';
import { ElTable, ElTableColumn, ElMessage, ElCard } from 'element-plus';
import { getPackagingListByOrderId } from '../function/oders';

const props = defineProps<{
  data: any
}>();


const packagingTitle = '分包列表';
const packagingListData = ref([
  {
    label: '包装ID',
    key: 'id',
    type: 'input',
  }, {
    label: '包装时间',
    key: 'creationTime',
    type: 'input',
  },
  {
    label: '包装数量',
    key: 'packageQuantity',
    type: 'input',
  },
]);

// const formState = ref({
//   formRef: null,
//   Formvalue: {},
// });

const formState = reactive({
  id: 0,
  creationTime: '',
  packageQuantity: 0,
})


const searchForm = reactive({
  id: '',
  creationTime: '',
  packageQuantity: '',
});

const columns = ref([
  {
    label: '包装ID',
    prop: 'id',
  },
  {
    label: '包装时间',
    prop: 'creationTime',
  },
  {
    label: '包装数量',
    prop: 'packageQuantity',
  },
]);

// 分包列表数据
const packagingList = ref([]);
// getPackagingList: 根据订单ID获取分包表数据
const getPackagingList = async () => {
  const res = await getPackagingListByOrderId(props.data.orderId);
  console.log('getPackagingList:resa', res);
  console.log('sadas', res.code);

  if (res.code === 200) {
    // packagingList.value = res.data || [];
    console.log('获取分包表数据成功', packagingList.value);
  }
  // else {
  //   ElMessage.error('获取分包表数据失败');
  //   console.error('获取分包表数据失败', res);
  // }
}


onMounted(() => {
  console.log('packagingList:data', props.data.packagingList);
  console.log('packagingList:id', props.data.orderId);
  console.log(props.data);

  // getPackagingList(props.data.orderId);
  getPackagingList();


})


</script>

<style scoped></style>
