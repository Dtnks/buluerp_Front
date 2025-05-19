<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import { newCustomer } from '@/apis/custom.js'
import { ref } from 'vue'
const data = ref([
  [
    { type: 'input', value: null, label: '用户ID' },
    { type: 'input', value: null, label: '姓名' },
  ],
  [
    { type: 'input', value: null, label: '联系方式' },
    { type: 'input', value: null, label: '邮箱' },
    { type: 'input', value: null, label: '客户备注' },
  ],
])
const importDialogVisible = ref(false)
</script>
<template>
  <div>
    <FormSearch title="查询" :data="data" />
    <FormData />
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
