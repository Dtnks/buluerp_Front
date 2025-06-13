<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>{{ title }}</span>
        <slot></slot>
      </div>
    </template>
    <el-row>
      <InputForm :data="data" :formState="formState" :searchForm="searchForm" />
      <el-col :span="4" style="text-align: right; padding: 20px 0; align-items: right">
        <el-space direction="vertical" alignment="normal">
          <el-row>
            <el-button type="primary" @click="onSubmit" v-if="onSubmit">查询</el-button>
            <el-button @click="onClear">重置</el-button>
          </el-row>
          <el-row>
            <el-button
              type="primary"
              @click="onCreate"
              :disabled="control[0].disabled"
              style="width: auto"
              v-if="onCreate"
              >新建</el-button
            >
            <el-button @click="onImport" v-if="onImport">导入</el-button>
          </el-row>
        </el-space>

        <div style="text-align: right; margin-top: 8px">
          <el-link type="primary" @click="onDownloadTemplate" v-if="onDownloadTemplate"
            >下载导入模板</el-link
          >
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts" setup>
import InputForm from './InputForm.vue'

const props = defineProps([
  'data',
  'title',
  'onSubmit',
  'onImport',
  'onCreate',
  'onDownloadTemplate',
  'formState',
  'searchForm',
  'control',
])
const onClear = () => {
  // props.searchForm = {}
  Object.keys(props.searchForm)?.forEach((key) => {
    props.searchForm[key] = ''
  })
}
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
