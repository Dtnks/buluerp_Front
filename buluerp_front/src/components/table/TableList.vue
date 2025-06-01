<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>展示</span>
        <div>
          <el-button type="primary" @click="exportFunc(select!.getSelectionRows())">导出</el-button>
          <el-button type="danger" @click="DeleteFunc(select!.getSelectionRows())" :disabled="control[2].disabled">删除</el-button>
        </div>
      </div>
    </template>
    <div>
      <el-table :data="listData" border style="width: 100%" ref="select">
        <el-table-column type="selection" width="55" />

        <el-table-column
          :prop="item.value"
          :label="item.label"
          v-for="item in tableData"
          :key="item.value"
        >
      <template #default="{ row }">
        <span v-if="item.type === 'picture'">
              <el-image
                v-if="row[item.value]"
                :src="getFullImageUrl(row[item.value])"
                style="width: 50px; height: 50px"
              />
            </span>
            <span v-if="item.type === 'fileList'">
              <!-- <a v-for="(subItem) in row[item.value]" :href="getFullImageUrl(subItem[item.key])" :download="subItem[item.key].split('/').pop()" target="_blank">{{ subItem[item.key].split('/').pop()}}</a> -->
              <el-button 
              type="primary" text v-for="(subItem) in row[item.value]" @click="donwLoadFile(getFullImageUrl(subItem[item.key]),item.miniType)">
                {{ subItem[item.key].split('/').pop()}}
              </el-button>
            </span>
            <span v-else-if="item.type == 'text'">{{ row[item.value] }}</span>
            </template>
      </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              text
              :disabled="operation.disabled"
              @click="operation.func(row)"
              v-for="operation in operations"
              >{{ operation.value }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <slot></slot>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
defineProps(['tableData', 'operations', 'listData', 'exportFunc', 'DeleteFunc' , 'control'])
const select = ref()
const BASE_IMAGE_URL = 'http://154.201.77.135:8080'
const getFullImageUrl = (path: string) => {
  // 防止多余斜杠：/profile//2025/... => /profile/2025/...
  return BASE_IMAGE_URL + path.replace('//', '/')
}
const donwLoadFile =async  (Fileurl,miniType) => {
  let content=await axios.get(Fileurl,{responseType: 'blob'})
  const blob = new Blob([content.data], { type:miniType  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = Fileurl.split('/').pop()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}
span .el-button+.el-button {
  margin-left:0 ;
}
</style>
