<template>
  <Form :data="data" :title="title" :onSubmit="onSubmit" :onCreate="onCreate" :onImport="onImport"
    :onDownloadTemplate="onDownloadTemplate" :searchForm="searchForm" :control="control"></Form>
  <el-dialog v-model="dialogFormVisible" title="新增订单" width="500">
    <el-form :model="dialogForm">
      <!-- <el-form-item label="订单状态">
        <el-select v-model="dialogForm.status" placeholder="请选择">
          <el-option label="初始状态" :value="Status.Initial" />
          <el-option label="设计中" :value="Status.Designing" />
          <el-option label="已完成" :value="Status.Completed" />
          <el-option label="作废" :value="Status.Canceled" />
          <el-option label="布产中" :value="Status.Producing" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="客户姓名">
        <el-autocomplete v-model="dialogForm.customerName" :fetch-suggestions="customerSuggestions" :value-key="'value'"
          @blur="checkCustomerName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="外部编号" required>
        <el-input v-model="dialogForm.outerId" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="内部编号" required>
        <el-input v-model="dialogForm.innerId" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="其他信息">
        <el-input v-model="dialogForm.remark" autocomplete="off" placeholder="请输入" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onAddCancel">取消</el-button>
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
import { computed, onMounted, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElInput, ElButton, ElDialog, ElUpload, ElAutocomplete, ElFormItem } from 'element-plus'
import Form from '@/components/form/Form.vue'
import { importOrderFile, getProductTemplate } from '@/apis/orders'
import { fetchOrderStatusMap, newStatusMap, Status } from '../utils/statusMap'
import { downloadBinaryFile } from '@/utils/file/base64'
import { messageBox } from '@/components/message/messageBox'
import { format } from 'date-fns'
import type { SubmitFormType } from '../types'

const dialogFormVisible = ref(false)

const emit = defineEmits(['onSubmit', 'onAdd', 'checkCustomerName', 'customerSuggestions'])
defineProps(['control'])
const dialogForm = reactive({
  status: Status.Initial, // 确保 status 有默认值
  createTime: '',
  operator: '',
  otherInfo: '',
  innerId: '',
  outerId: '',
  id: 14,
  remark: '',
  operatorId: '0',
  quantity: 1,
  productName: '',
  customerName: '',
  operater: '',
})

onMounted(async () => {
  await fetchOrderStatusMap()
  console.log(newStatusMap.value, 'newStatusMap444')
})

const title = '查询表单'
const statusOptions = computed(() =>
  Object.entries(newStatusMap.value).map(([key, value]) => ({
    label: value,
    value: key,
    key: key,
  })),
)
console.log('statusOptions:4444', statusOptions.value)

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
      options: statusOptions,
      // options: [
      //   { label: '初始状态', value: Status.Initial },
      //   { label: '设计中', value: Status.Designing },
      //   { label: '已完成', value: Status.Completed },
      //   { label: '作废', value: Status.Canceled },
      //   { label: '布产中', value: Status.Producing },
      // ],
    },
    { label: '创建时间', type: 'timer', key: 'createTime', timerType: 'datetimerange' },
  ],
  [
    { label: '客户姓名', type: 'input', key: 'customerName' },
    { label: '创建人姓名', type: 'input', key: 'operator' },
    { label: '备注', type: 'input', key: 'remark' },
  ],
])

const formRef = ref<FormInstance>()
// 表单状态
const formState = reactive({
  // orderId: '',
  status: null,
  createTime: [],
  operator: '',
  otherInfo: '',
  innerId: '',
  id: 14,
  remark: '',
  operatorId: '0',
  quantity: 1,
  customerId: 0,
  customerName: '',
})

// searchForm: 查询条件
const searchForm = ref({
  id: null,
  status: null,
  createTime: [], // 使用数组来存储时间范围
  createTineFrom: '',
  createTimeTo: '',
  deliveryDeadline: '',
  operator: '',
  customerName: '',
  remark: '',
})
defineExpose({ formState, formRef, searchForm })

// onSubmit: 提交查询条件
const onSubmit = () => {
  const createTimeFrom =
    searchForm.value.createTime && searchForm.value.createTime.length > 0
      ? format(new Date(searchForm.value.createTime[0]), 'yyyy-MM-dd HH:mm:ss')
      : null

  const createTimeTo =
    searchForm.value.createTime && searchForm.value.createTime.length > 1
      ? format(new Date(searchForm.value.createTime[1]), 'yyyy-MM-dd HH:mm:ss')
      : null
  const submitForm: SubmitFormType = {
    ...searchForm.value,
    createTimeFrom,
    createTimeTo,
  }
  delete submitForm.createTime // 删除 createTime 属性，避免重复提交
  emit('onSubmit', submitForm)
}

// onCreate: 点击新建按钮
const onCreate = () => {
  dialogFormVisible.value = true
}

const customerSuggestions = (queryString: string, cb) => {
  emit('customerSuggestions', queryString, cb)
}
const checkCustomerName = () => {
  emit('checkCustomerName')
}
// onAddCancel: 取消新增订单
const onAddCancel = () => {
  dialogFormVisible.value = false
  dialogForm.customerName = ''
  dialogForm.innerId = ''
  dialogForm.outerId = ''
  dialogForm.remark = ''
}

// onAddConfirm: 确认新增订单
const onAddConfirm = () => {
  emit('onAdd', { ...dialogForm })
  console.log('新增订单数据：', { ...dialogForm })
  dialogFormVisible.value = false
  dialogForm.customerName = ''
  dialogForm.innerId = ''
  dialogForm.outerId = ''
  dialogForm.remark = ''
}

const importDialogVisible = ref(false)
const onImport = () => {
  importDialogVisible.value = true
}

// 文件校验（限制大小）
const beforeUpload = (file: File) => {
  console.log('beforeUpload file:mmmmmmm')

  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isExcel) {
    console.log('beforeUpload file: !isExcel')
    messageBox('error', null, null, '只能上传 xls/xlsx 文件')
    return false
  }
  if (!isLt5M) {
    console.log('beforeUpload file: !isLt5M')
    messageBox('error', null, null, '文件大小不能超过 5MB')
    return false
  }
  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)
  const res = await importOrderFile(formData)

  messageBox('success', null, res.msg || '导入成功')

  importDialogVisible.value = false
}

const onDownloadTemplate = () => {
  getProductTemplate().then((res) => {
    downloadBinaryFile(res, '订单信息模板.xlsx')
  })
}
</script>

<style scoped></style>
