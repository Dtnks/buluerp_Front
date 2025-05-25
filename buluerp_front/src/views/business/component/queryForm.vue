<template>
  <Form :data="data" :title="title" :onSubmit="onSubmit" :onClear="resetForm" :onCreate="onCreate" :onImport="onImport"
    :onDownloadTemplate="onDownloadTemplate" :searchForm="searchForm"></Form>
  <el-dialog v-model="dialogFormVisible" title="Shipping address" width="500">
    <el-form :model="dialogForm">
      <el-form-item label="createdBy">
        <el-input v-model="dialogForm.createdBy" autocomplete="off" />
      </el-form-item>
      <el-form-item label="status">
        <el-select v-model="dialogForm.status" placeholder="Please select the status">
          <el-option label="初始状态" value=0 />
          <el-option label="设计中" value=1 />
          <el-option label="已完成" value=2 />
          <el-option label="作废" value=3 />
          <el-option label="布产中" value=4 />
          <el-option label="生产中" value=5 />
        </el-select>
      </el-form-item>
      <el-form-item label="customerName">
        <el-input v-model="dialogForm.customerName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="information">
        <el-input v-model="dialogForm.information" autocomplete="off" />
      </el-form-item>
      <el-form-item label="createTime">
        <el-date-picker v-model="dialogForm.createTime" type="datetime" placeholder="Pick a date" />
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onAddConfirm">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import BordShow from '@/components/board/SecBoard.vue';
import type { FormInstance } from 'element-plus';
// import type { ElForm } from 'element-plus';
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from 'element-plus';
// import { Search } from '@element-plus/icons-vue';
import Form from '@/components/form/Form.vue';
import { addOrder, searchOrders } from '../apis/oders';
import { id } from 'element-plus/es/locale';
import { dayjs } from 'element-plus';
import { useQueryTableDataStore } from '@/stores/queryTableData';
import { number } from 'echarts';
const dialogFormVisible = ref(false);
const tableStores = useQueryTableDataStore();
const tableData = computed(() => {
  return tableStores.tableData;
});
const emit = defineEmits(['onSubmit', 'onAdd']);

const dialogForm = reactive({
  status: 0,
  createTime: '',
  customerName: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
  information: '',
  operatorId: '0',
  quantity: 0,
  customerId: 0,
  productId: 0,
  productName: '',

})

const title = '查询表单';

// data: 表单数据
const data = reactive([
  [
    {
      label: '业务订单ID',
      type: 'input', // 确保 type 不为空
      key: 'orderId', // 确保 key 对应 searchForm 的字段
      value: '',
    },
    {
      label: '订单状态',
      type: 'select',
      key: 'status',
      value: '',
      options: [
        { label: '初始状态', value: '0' },
        { label: '设计中', value: '1' },
        { label: '已完成', value: '2' },
        { label: '作废', value: '3' },
        { label: '布产中', value: '4' },
      ],
    },
    {
      label: '创建日期',
      type: 'timer',
      key: 'createTime',
      value: '',
      timerType: 'daterange',
    },
  ],
  [
    {
      label: '客户姓名',
      type: 'input',
      key: 'customerName',
      value: '',
    },
    {
      label: '创建人姓名',
      type: 'input',
      key: 'createdBy',
      value: '',
    },
    {
      label: '其他搜索框',
      type: 'input',
      key: 'otherInfo',
      value: '',
    },
  ],
]);

const formRef = ref<FormInstance>();
// 表单状态
const formState = reactive({
  orderId: '',
  status: null,
  createTime: '',
  customerName: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
  information: '',
  operatorId: '0',
  quantity: 0,
  customerId: 0,
});
defineExpose({ formState })

// searchForm: 查询条件
const searchForm = reactive({
  orderId: '',
  status: '',
  createTime: '',
  customerName: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
});

// // 时间选择框
// const datePicker = ref<[string, string]>(['', '']);


// // onSubmit: 查询表单数据
// const onSubmit = () => {
//   console.log('查询条件', searchForm);
//   // searchOrders(searchForm).then((res) => {
//   //   console.log('查询结果', res);
//   //   // tableData.value = res.data;
//   // });
//     tableStores.setQueryParams(searchForm); // 设置查询条件
//   tableStores.setPage(1); // 查询时重置页码为 1
//   tableStores.getOrders(); // 获取数据

// };
const onSubmit = () => {
  console.log('查询条件', searchForm);
  emit('onSubmit', { ...searchForm });
};

// const resetForm = () => {
//   console.log('重置表单', formRef.value);

//   formRef.value?.resetFields();
//   // // formState.orderId = '';
// };
// resetForm: 重置表单
const resetForm = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = '';
  });
};

const onCreate = () => {
  dialogFormVisible.value = true;
  console.log('点击创建');


};

const onImport = () => {
  console.log('点击导入');
};

const onDownloadTemplate = () => {
  console.log('下载导入模板');

};


// // onAddConfirm: 添加确认, 将表单数据添加到表格中
// const onAddConfirm = async () => {
//   // 格式化时间
//   dialogForm.createTime = dayjs(dialogForm.createTime).format('YYYY-MM-DD HH:mm:ss');

//   console.log('添加确认', dialogForm);

//   const res = await addOrder(dialogForm);
//   console.log('添加结果', res);
//   // 重新获取表格数据
//   await tableStores.getOrders();
//   // 将添加的订单数据添加到表格中
//   // tableStores.addTableData({
//   //   ...dialogForm,
//   //   id: tableData.value.length + 1,
//   // } as any);
//   tableStores.tableData.unshift({
//     ...dialogForm,
//     id: tableData.value.length + 1,
//   } as any );
//   // 重置表单
//   dialogFormVisible.value = false;
//   formRef.value?.resetFields();

// };
const onAddConfirm = () => {
  emit('onAdd', { ...dialogForm });
  dialogFormVisible.value = false;
};
</script>

<style scoped></style>
