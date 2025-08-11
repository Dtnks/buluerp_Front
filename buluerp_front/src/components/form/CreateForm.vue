<template>
  <div v-if="title" style="width: 100%; height: 80px;">
    <div>{{ title }}</div>
      <!-- 使用 v-for 渲染列表数据 -->
    <el-row :gutter="20" align="middle" v-for="(list, index) in data" :key="index">
      <el-col :span="ele.width || 12" v-for="ele in list" :key="ele.label">
        {{ele.label}}:{{ Formvalue[ele.key] }}
      </el-col>
    </el-row>
      
  </div>
  <el-form v-else ref="formRef" :model="Formvalue" :rules="formRules" label-width="120px">
    <el-row :gutter="20" align="middle" v-for="(list, index) in data" :key="index">
      <el-col :span="ele.width || 12" v-for="ele in list" :key="ele.label">
        <el-form-item
          :label="ele.label"
          v-if="ele.type === 'input' && !ele.children"
          :prop="ele.key"
        >
          <el-input v-model="Formvalue[ele.key]" />
        </el-form-item>
        <el-form-item
          :label="ele.label"
          v-if="ele.type === 'textarea' && !ele.children"
          :prop="ele.key"
        >
          <el-input v-model="Formvalue[ele.key]" type="textarea" />
        </el-form-item>
        <!-- <el-form-item v-else-if="ele.children" :label="ele.children[0].label">
          <el-input v-model="searchForm.customer[ele.children[0].key]" />
          {{searchForm.customer['name'] }}
        </el-form-item> -->
        <el-form-item
          :label="ele.label"
          v-else-if="ele.type === 'select'"
          clearable
          :prop="ele.key"
        >
          <el-select
            v-model="Formvalue[ele.key]"
            clearable
            @clear="
              () => {
                Formvalue[ele.key] = ''
              }
            "
          >
            <el-option
              v-for="option in ele.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'inputSelect'" :prop="ele.key">
          <el-select
            v-model="Formvalue[ele.key]"
            filterable
            remote
            reserve-keyword
            :remote-method="
              (queryString) => {
                ele.remoteFunc(ele, queryString)
              }
            "
            default-first-option
            :loading="ele.loading"
          >
            <el-option
              v-for="item in ele.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="ele.label"
          v-else-if="ele.type === 'mutilInputSelect'"
          :prop="ele.key"
        >
          <el-select
            v-model="Formvalue[ele.key]"
            filterable
            multiple
            remote
            reserve-keyword
            :remote-method="
              (queryString) => {
                ele.remoteFunc(ele, queryString)
              }
            "
            default-first-option
            :loading="ele.loading"
          >
            <el-option
              v-for="item in ele.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'timer'" :prop="ele.key">
          <el-date-picker
            v-model="Formvalue[ele.key]"
            :type="ele.timerType"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'image'" :prop="ele.key">
          <upload
            :setFile="
              (file: File) => {
                Formvalue[ele.key] = file
              }
            "
            :setImgUrl="
              (url) => {
                Formvalue[ele.key + 'Url'] = url
              }
            "
            :ImgUrl="Formvalue[ele.key + 'Url']"
          />
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'fileList'" :prop="ele.key">
          <el-upload
            class="upload-demo"
            multiple
            :auto-upload="false"
            :on-change="(file) => handleFileChange(file, ele.key)"
            :on-remove="(file) => onRemove(file, ele.key)"
            ><el-button>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'number'" :prop="ele.key">
          <el-input-number v-model="Formvalue[ele.key]" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item :label="ele.label" v-else-if="ele.type === 'fileListShow'" :prop="ele.key">
          <el-select
            v-model="Formvalue[ele.key]"
            multiple
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in ele.options"
              :key="item.value"
              :label="item.invoiceUrl.split('/').pop(-1)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, nextTick } from 'vue'
import upload from '../upload/uploadImage.vue'
import type { FormInstance } from 'element-plus'

const formRef = ref<FormInstance | null>(null)
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  Formvalue: {
    type: Object,
    required: true,
  },
  title:{
    type:String,
    default:''
  }
})
// 从 data 中提取所有规则
const formRules = computed(() => {
  const rules: Record<string, any[]> = {}
  props.data.flat().forEach((ele) => {
    if (ele.rules) {
      rules[ele.key] = ele.rules
    }
  })
  return rules
})

// 暴露表单校验方法给父组件
const validateForm = (callback: (valid: boolean) => void) => {
  nextTick(() => {
    if (formRef.value) {
      formRef.value.validate((valid: boolean, fields: Record<string, any>[]) => {
        callback(valid)
      })
    } else {
      callback(false, '表单实例获取失败')
    }
  })
}

const clearValidate = () => {
  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

defineExpose({
  validateForm,
  clearValidate,
})
</script>

<style scoped></style>
