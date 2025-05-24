<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
      </div>
    </template>
    <el-row>
      <InputForm :data="data" :formState="formState" />
      <el-col :span="4" style="text-align: right; padding: 20px">
        <el-space direction="vertical">
          <el-row>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onClear">重置</el-button>
          </el-row>
          <el-row>
            <el-button type="primary" @click="onCreate">新建</el-button>
            <el-button @click="onImport">导入</el-button>
          </el-row>
        </el-space>

        <div style="text-align: right; margin-top: 8px">
          <el-link type="primary" @click="onDownloadTemplate">下载导入模板</el-link>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import InputForm from './InputForm.vue'
import { defineProps } from 'vue'
const props = defineProps([
  'data',
  'title',
  'onSubmit',
  'onImport',
  'onCreate',
  'onDownloadTemplate',
  'formState',
])
const onClear = () => {
  props.data.forEach((element) => {
    element.forEach((ele) => {
      ele.value = ''
    })
  })
}
</script>

<style scoped></style>
