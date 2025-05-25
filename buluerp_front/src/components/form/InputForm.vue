<template>
  <el-form :ref="formRef" :model="formState" label-width="100px" class="search-form">
    <!-- 第一行 -->
    <el-row :gutter="20" align="middle" v-for="(list, index) in data" :key="index">
      <el-col :span="list.length == 3 ? 8 : 12" v-for="ele in list" :key="ele.label">
        <el-form-item :label="ele.label" v-if="ele.type === 'input'">
          <el-input v-model.number="searchForm[ele.key]" />
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'select'">
          <el-select v-model="ele.value">
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
            v-model="searchForm[ele.key]"
            :type="ele.timerType"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
defineProps(['data', 'formState', 'formRef', 'searchForm'])
</script>

<style scoped>
.search-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
}
</style>
