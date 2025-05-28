<template>
  <Form
    :data="data"
    :title="title"
    :onSubmit="onSubmit"
    :onClear="resetForm"
    :onCreate="onCreate"
    :onImport="onImport"
    :onDownloadTemplate="onDownloadTemplate"
    :searchForm="searchForm"
    :control="control"
  ></Form>
  <el-dialog v-model="dialogFormVisible" title="新增订单" width="500">
    <el-form :model="dialogForm">
      <el-form-item label="创建人姓名">
        <el-input v-model="dialogForm.createdBy" />
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="dialogForm.status" placeholder="Please select the status">
          <el-option label="初始状态" value="0" />
          <el-option label="设计中" value="1" />
          <el-option label="已完成" value="2" />
          <el-option label="作废" value="3" />
          <el-option label="布产中" value="4" />
          <el-option label="生产中" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户姓名">
        <el-input v-model="dialogForm.customer" />
      </el-form-item>
      <el-form-item label="其他信息">
        <el-input v-model="dialogForm.remark" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onAddConfirm"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="importDialogVisible" title="导入 Excel" width="400px">
    <el-upload
      class="upload-demo"
      drag
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="handleUpload"
      accept=".xlsx,.xls"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
      <template v-slot:tip>
        <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// import BordShow from '@/components/board/SecBoard.vue';
import type { FormInstance } from 'element-plus'
// import type { ElForm } from 'element-plus';
import {
  ElInput,
  ElSelect,
  ElOption,
  ElDatePicker,
  ElButton,
  ElDialog,
  ElUpload,
  ElMessage,
} from 'element-plus'
// import { Search } from '@element-plus/icons-vue';
import Form from '@/components/form/Form.vue'
import { addOrder, searchOrders } from '../apis/oders'
import { importOrderFile } from '@/apis/orders'
import { id } from 'element-plus/es/locale'
import { dayjs } from 'element-plus'
import { useQueryTableDataStore } from '@/stores/queryTableData'
import { number } from 'echarts'
const dialogFormVisible = ref(false)
const tableStores = useQueryTableDataStore()
const tableData = computed(() => {
  return tableStores.tableData
})
const emit = ['onSubmit', 'onAdd']
defineProps(['control'])
const dialogForm = reactive({
  status: 0,
  createTime: '',
  customer: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
  remark: '',
  operatorId: '0',
  quantity: 0,
  customerId: 0,
  productId: 0,
  productName: '',
})

const title = '查询表单'

// data: 表单数据
const data = reactive([
  [
    {
      label: '业务订单ID',
      type: 'input', // 确保 type 不为空
      key: 'orderId', // 确保 key 对应 searchForm 的字段
    },
    {
      label: '订单状态',
      type: 'select',
      key: 'status',
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
      timerType: 'daterange',
    },
  ],
  [
    {
      label: '客户姓名',
      type: 'input',
      key: 'customer',
      value: '',
    },
    {
      label: '创建人姓名',
      type: 'input',
      key: 'createdBy',
    },
    {
      label: '其他搜索框',
      type: 'input',
      key: 'otherInfo',
    },
  ],
])

const formRef = ref<FormInstance>()
// 表单状态
const formState = reactive({
  orderId: '',
  status: null,
  createTime: '',
  customer: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
  remark: '',
  operatorId: '0',
  quantity: 0,
  customerId: 0,
})
defineExpose({ formState })

// searchForm: 查询条件
const searchForm = reactive({
  orderId: '',
  status: '',
  createTime: '',
  customer: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
})

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
  console.log('查询条件', searchForm)
  emit('onSubmit', { ...searchForm })
}

// const resetForm = () => {
//   console.log('重置表单', formRef.value);

//   formRef.value?.resetFields();
//   // // formState.orderId = '';
// };
// resetForm: 重置表单
const resetForm = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = ''
  })
}

const onCreate = () => {
  dialogFormVisible.value = true
  console.log('点击创建')
}

// const onImport = () => {
//   console.log('点击导入');
// };

// const onDownloadTemplate = () => {
//   console.log('下载导入模板');

// };

const importDialogVisible = ref(false)
const onImport = () => {
  importDialogVisible.value = true
}

// 文件校验（限制大小）
const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isExcel) {
    ElMessage.error('只能上传 Excel 文件（xls/xlsx）')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过 5MB')
    return false
  }
  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    const res = await importOrderFile(formData)
    console.log(res)
    ElMessage.success('导入成功')
    importDialogVisible.value = false
  } catch (e) {
    ElMessage.error('导入失败')
  }
}

const onDownloadTemplate = () => {
  // 下载 Excel 模板，可以是静态文件或接口返回
  const link = document.createElement('a')
  link.href = '/template/import-order-template.xlsx' // 替换成你的模板文件路径
  link.download = '订单导入模板.xlsx'
  link.click()
}

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
  emit('onAdd', { ...dialogForm })
  dialogFormVisible.value = false
}
</script>

<style scoped></style>
