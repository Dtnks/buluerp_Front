<template>
  <el-form :ref="formRef" :model="formState" label-width="100px" class="search-form">
    <el-row :gutter="20" align="middle" v-for="(list, index) in data" :key="index">
      <el-col :span="ele.width" v-for="ele in list" :key="ele.label">
        <el-form-item :label="ele.label" v-if="ele.type === 'input' && !ele.children">
          <el-input v-model="Formvalue[ele.key]" />
        </el-form-item>
        <el-form-item :label="ele.label" v-if="ele.type === 'textarea' && !ele.children">
          <el-input v-model="Formvalue[ele.key]" type="textarea" />
        </el-form-item>
        <!-- <el-form-item v-else-if="ele.children" :label="ele.children[0].label">
          <el-input v-model="searchForm.customer[ele.children[0].key]" />
          {{searchForm.customer['name'] }}
        </el-form-item> -->
        <el-form-item :label="ele.label" v-else-if="ele.type === 'select'">
          <el-select v-model="Formvalue[ele.key]">
            <el-option
              v-for="option in ele.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'timer'">
          <el-date-picker
            v-model="Formvalue[ele.key]"
            :type="ele.timerType"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'image'">
          <upload
            :setFile="
              (file: File) => {
                Formvalue[ele.key] = file
              }
            "
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import upload from '../upload/uploadImage.vue'
defineProps(['data', 'formState', 'formRef', 'Formvalue'])
</script>

<style scoped>
.search-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
}
</style>
