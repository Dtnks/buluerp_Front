<script setup lang="ts">
import Form from '@/components/form/Form.vue'
import { ref } from 'vue'
const data = ref([
  [
    { type: 'input', value: null, label: '产品编码' },
    {
      type: 'select',
      value: null,
      label: '产品状态',
      options: [
        { value: 1, label: '设计中' },
        { value: 2, label: '已完成' },
      ],
    },
    { type: 'timer', value: null, label: '创建日期' },
  ],
  [
    { type: 'input', value: null, label: '产品名称' },
    { type: 'input', value: null, label: '创建人姓名' },
    { type: 'input', value: null, label: '其他搜索' },
  ],
  [
    { type: 'input', value: null, label: '产品名称' },
    { type: 'input', value: null, label: '创建人姓名' },
  ],
])
const importDialogVisible = ref(false)
</script>
<template>
  <div>
    <Form title="查询" :data="data" />
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
  </div>
</template>
