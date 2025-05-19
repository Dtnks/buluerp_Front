<template>
  <div>
    <el-card shadow="never">
      <!-- 搜索框 -->
      <template #header>
        <div>
          <span>查询</span>
        </div>
      </template>
      <!-- 查询表单 -->
      <el-row :gutter="20">
        <!-- 业务订单ID -->
        <el-col :span="6">
          <el-form-item label="业务订单ID">
            <el-input v-model="formState.name" placeholder="请输入" />
          </el-form-item>
        </el-col>

        <!-- 订单状态 -->
        <el-col :span="6">
          <el-form-item label="订单状态">
            <!-- todo: 动态渲染 -->
            <el-select v-model="formState.region" placeholder="订单状态">
              <el-option label="初始状态" value="shanghai" />
              <el-option label="设计中" value="beijing" />
              <el-option label="已完成" value="beijing2" />
              <el-option label="作废" value="beijing3" />
              <el-option label="布产中" value="beijing4" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 创建日期 -->
        <el-col :span="7">
          <el-form-item label="创建日期">
            <el-date-picker v-model="datePicker" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
              style="width: 100%" />
          </el-form-item>
        </el-col>

        <!-- 查询和重置按钮 -->
        <el-col :span="5" class="form-buttons">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-col>
      </el-row>


      <el-row :gutter="20">
        <!-- 客户姓名 -->
        <el-col :span="6">
          <el-form-item label="客户姓名">
            <el-input v-model="formState.fieldB" placeholder="请输入" />
          </el-form-item>
        </el-col>

        <!-- 创建人姓名 -->
        <el-col :span="6">
          <el-form-item label="创建人姓名">
            <el-input v-model="formState.fieldB" placeholder="请输入" />
          </el-form-item>
        </el-col>

        <!-- 其他搜索框 -->
        <el-col :span="6">
          <el-form-item label="其他搜索框">
            <el-input v-model="formState.fieldB" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <!-- 新建和导入按钮 -->
        <el-col :span="6" class="form-buttons">
          <el-button type="primary" @click="onCreate">新建</el-button>
          <el-button @click="onImport">导入</el-button>
        </el-col>
      </el-row>
      <!-- 按钮 -->
      <el-row>
        <el-col :span="24" class="form-buttons">


          <el-button type="text" @click="onDownloadTemplate">下载导入模板</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
// import BordShow from '@/components/board/SecBoard.vue';
import type { FormInstance } from 'element-plus';
// import type { ElForm } from 'element-plus';
import { ElInput, ElSelect, ElOption, ElDatePicker, ElButton } from 'element-plus';
// import { Search } from '@element-plus/icons-vue';

const formRef = ref<FormInstance>();
// 表单状态
const formState = reactive({
  name: '',
  region: undefined,
  fieldB: '',
});

// 时间选择框
// const datePicker = ref<[string, string] | null>(null);
const datePicker = ref<[string, string]>(['', '']);



// 表单操作
const onSubmit = () => {
  console.log('查询表单数据：', formState);
};

const resetForm = () => {
  // formState.name = '';
  // formState.region = undefined;
  // formState.fieldB = '';
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
