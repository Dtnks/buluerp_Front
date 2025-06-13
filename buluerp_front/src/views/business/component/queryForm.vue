<template>
  <Form :data="data" :title="title" :onSubmit="onSubmit" :onCreate="onCreate" :onImport="onImport"
    :onDownloadTemplate="onDownloadTemplate" :searchForm="searchForm" :control="control"></Form>
  <el-dialog v-model="dialogFormVisible" title="新增订单" width="500">
    <el-form :model="dialogForm">
      <el-form-item label="订单状态">
        <el-select v-model="dialogForm.status" placeholder="请选择">
          <el-option label="初始状态" :value="Status.Initial" />
          <el-option label="设计中" :value="Status.Designing" />
          <el-option label="已完成" :value="Status.Completed" />
          <el-option label="作废" :value="Status.Canceled" />
          <el-option label="布产中" :value="Status.Producing" />
        </el-select>
      </el-form-item>
      <el-form-item label="客户姓名">
        <el-input v-model="dialogForm.customerName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="其他信息">
        <el-input v-model="dialogForm.remark" autocomplete="off" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onAddConfirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="importDialogVisible" title="导入 Excel" width="400px">
    <el-upload class="upload-demo" drag :show-file-list="false" :before-upload="beforeUpload"
      :http-request="handleUpload" accept=".xlsx,.xls">
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
import type { FormInstance } from 'element-plus'
import {
  ElInput,
  ElSelect,
  ElOption,
  ElMessageBox,
  ElButton,
  ElDialog,
  ElUpload,
  ElMessage,
} from 'element-plus'
import Form from '@/components/form/Form.vue'
import { importOrderFile, getProductTemplate } from '@/apis/orders'
import { getStatusText, Status } from '../utils/statusMap'
import { downloadBinaryFile } from '@/utils/file/base64'
import { messageBox } from '@/components/message/messageBox'

const dialogFormVisible = ref(false)

// const tableStores = useQueryTableDataStore()

const emit = defineEmits(['onSubmit', 'onAdd'])
defineProps(['control'])
const dialogForm = reactive({
  status: Status.Initial, // 确保 status 有默认值
  createTime: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
  id: 14,
  remark: '',
  operatorId: '0',
  quantity: 0,
  productId: 0,
  productName: '',
  customerName: '',
})

const statusText = computed(() => {
  return getStatusText(dialogForm.status)
})

const title = '查询表单'

// data: 表单数据
const data = reactive([
  [
    {
      label: '业务订单ID',
      type: 'input', // 确保 type 不为空
      key: 'id', // 确保 key 对应 searchForm 的字段
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
      label: '创建时间',
      type: 'timer',
      key: 'createTime',
      timerType: 'daterange',
    },
  ],
  [
    {
      label: '客户姓名',
      type: 'input',
      key: 'customerName',
    },
    {
      label: '创建人姓名',
      type: 'input',
      key: 'createdBy',
    },
    {
      label: '其他搜索框',
      type: 'input',
      key: 'remark',
    },
  ],
])

const formRef = ref<FormInstance>()
// 表单状态
const formState = reactive({
  // orderId: '',
  status: null,
  createTime: '',
  createdBy: '',
  otherInfo: '',
  innerId: '',
  id: 14,
  remark: '',
  operatorId: '0',
  quantity: 0,
  customerId: 0,
  customerName: '',
})

// searchForm: 查询条件
const searchForm = ref({
  id: null,
  status: null,
  createTime: '',
  createdBy: '',
  customerName: '',
  remark: '',
})
defineExpose({ formState, formRef, searchForm })




// onSubmit: 提交查询条件
const onSubmit = () => {
  emit('onSubmit', searchForm.value)
  console.log('查询条件eq2eq2q：', searchForm.value)
}

// onCreate: 点击新建按钮
const onCreate = () => {
  dialogFormVisible.value = true
}

// onAddConfirm: 确认新增订单
const onAddConfirm = () => {
  emit('onAdd', { ...dialogForm })
  console.log('新增订单数据：', { ...dialogForm })
  dialogFormVisible.value = false
}

const importDialogVisible = ref(false)

const onImport = () => {
  importDialogVisible.value = true
}

// 文件校验（限制大小）
const beforeUpload = (file: File) => {
  console.log('beforeUpload file:mmmmmmm');

  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isExcel) {
    console.log('beforeUpload file: !isExcel');
    messageBox('error', null, null, '只能上传 xls/xlsx 文件')
    return false
  }
  if (!isLt5M) {
    console.log('beforeUpload file: !isLt5M');
    messageBox('error', null, null, '文件大小不能超过 5MB')
    return false
  }
  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)
  const res = await importOrderFile(formData)
  if (res.code == 200) {
    messageBox('success', null, res.msg || '导入成功')
  } else {
    ElMessage.error(res.msg || '导入失败')
    console.log('导入失败2222:', res);
    if (res.data && Array.isArray(res.data)) {
      const error_text = res.data
        .map((ele: any) => {
          return '第' + ele.rowNum + '行：' + ele.errorMsg
        })
        .join('<br>')
      ElMessageBox.alert(error_text, {
        confirmButtonText: '继续',
        type: 'error',
        dangerouslyUseHTMLString: true,
      })
    }
  }

  importDialogVisible.value = false

}

const onDownloadTemplate = () => {
  getProductTemplate().then((res) => {
    downloadBinaryFile(res, '订单信息模板.xlsx')
  })
}


</script>

<style scoped></style>
