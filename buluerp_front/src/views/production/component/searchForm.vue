<template>
  <el-card style="width: 100%; margin: 0 20px;">
    <template #header>
      <div class="card-header">
        <span>查询</span>
      </div>
      </template>
      
        <div>
          <el-form
            ref="formRef"
            :model="formState"
            label-width="100px"
            class="search-form"
          >
            <!-- 第一行 -->
            <el-row :gutter="20" align="middle">
              <el-col :span="6">
                <el-form-item label="产品编码" prop="productCode">
                  <el-input v-model="formState.productCode" placeholder="请输入产品编码" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="产品状态" prop="productStatus">
                  <el-select v-model="formState.productStatus" placeholder="请选择产品状态">
                    <el-option label="设计中" value="doing" />
                    <el-option label="已完成" value="done" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建日期" prop="createDate">
                  <el-date-picker
                    v-model="formState.createDate"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6" style="text-align: right;">
                <el-space>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                  <el-button @click="onClear">重置</el-button>
                </el-space>
              </el-col>
            </el-row>

            <!-- 第二行 -->
            <el-row :gutter="20" align="middle" style="margin-top: 16px;">
              <el-col :span="6">
                <el-form-item label="产品名称" prop="productName">
                  <el-input v-model="formState.productName" placeholder="请输入产品名称" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人姓名" prop="creatorName">
                  <el-input v-model="formState.creatorName" placeholder="请输入创建人姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="其他搜索" prop="otherSearch">
                  <el-input v-model="formState.otherSearch" placeholder="请输入其他搜索条件" />
                </el-form-item>
              </el-col>
              <el-col :span="6" style="text-align: right;">
                <el-space>
                  <el-button type="primary" @click="onCreate">新建</el-button>
                  <el-button @click="onImport">导入</el-button>
                </el-space>
              </el-col>
            </el-row>

            <div style="text-align: right; margin-top: 8px;">
              <el-link type="primary" @click="onDownloadTemplate">下载导入模板</el-link>
            </div>
          </el-form>
        </div>
      
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import type { FormInstance } from 'element-plus';

const formRef = ref<FormInstance>();
const formState = reactive({
  productCode: '',
  productStatus: '',
  createDate: [],
  productName: '',
  creatorName: '',
  otherSearch: '',
});

const onSubmit = () => {
  console.log('提交的表单值:', formState);
};

const onClear = () => {
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

<style scoped>
.search-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.search-result-list {
  margin-top: 20px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background: #f5f7fa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
</style>