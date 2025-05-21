<template>
  <Form :data="data" :title="title" :onSubmit="onSubmit" :onClear="resetForm" :onCreate="onCreate" :onImport="onImport"
    :onDownloadTemplate="onDownloadTemplate" :ele="formState"></Form>
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

const title = '查询表单';
const data = [
  [
    {
      label: '业务订单ID',
      type: 'input',
      value: '',
    },
    {
      label: '订单状态',
      type: 'select',
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
      value: '',
    },
  ],
  [
    {
      label: '客户姓名',
      type: 'input',
      value: '',
    },
    {
      label: '创建人姓名',
      type: 'input',
      value: '',
    },
    {
      label: '其他搜索框',
      type: 'input',
      value: '',
    },
  ],

];

const formRef = ref<FormInstance>();
// 表单状态
const formState = reactive({
  name: '',
  region: undefined,
  fieldB: '',
});
defineExpose({ formState })


// // 时间选择框
// const datePicker = ref<[string, string]>(['', '']);


// 表单操作
const onSubmit = () => {
  console.log('查询表单数据：', formState);
};

const resetForm = () => {
  formRef.value?.resetFields();
};
const onCreate = () => {
  console.log('点击新建');
  
};

const onImport = () => {
  console.log('点击导入');
};

const onDownloadTemplate = () => {
  console.log('下载导入模板');


};

</script>

<style scoped></style>
