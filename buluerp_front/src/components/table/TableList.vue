<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>展示</span>
        <div>
          <el-button
            type="primary"
            @click="exportFunc(select!.getSelectionRows())"
            v-if="exportFunc"
            >导出</el-button
          >
          <el-button
            type="danger"
            v-if="DeleteFunc"
            @click="
              () => {
                DeleteFunc(select!.getSelectionRows())
                select.clearSelection()
              }
            "
            :disabled="control[2].disabled"
            >删除</el-button
          >
          <el-button
            type="primary"
            v-if="exportCharts"
            @click="exportCharts(select!.getSelectionRows())"
            >图表</el-button
          >
          <el-button
            type="primary"
            v-if="transToArrange"
            @click="transToArrange(select!.getSelectionRows())"
            >导入排产</el-button
          >
        </div>
      </div>
    </template>
    <div>
      <el-table :data="listData" border style="width: 100%" ref="select" :row-key="(row) => row.id">
        <el-table-column type="selection" width="55" reserve-selection="true" />

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
                @click="donwLoadFile(getFullImageUrl(row[item.value]))"
              />
            </span>
            <span v-if="item.type === 'fileList'">
              <!-- <a v-for="(subItem) in row[item.value]" :href="getFullImageUrl(subItem[item.key])" :download="subItem[item.key].split('/').pop()" target="_blank">{{ subItem[item.key].split('/').pop()}}</a> -->
              <el-button
                type="primary"
                text
                v-for="subItem in row[item.value]"
                @click="donwLoadFile(getFullImageUrl(subItem[item.key]), item.miniType)"
              >
                {{ subItem[item.key].split('/').pop() }}
              </el-button>
            </span>
            <span v-else-if="item.type == 'text'">{{ row[item.value] }}</span>
            <span v-else-if="item.type == 'Maptext'">{{ item.map[row[item.value]] }}</span>
            <span v-else-if="item.type == 'tags'">
              <el-tag v-for="tag in getList(row[item.value])">{{ tag }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" v-if="operations">
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
      <div style="height: 20px"></div>
      <slot></slot>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getFullImageUrl } from '@/utils/image/getUrl'
import { ElCard, ElTable, ElTableColumn, ElButton, ElTag, ElImage } from 'element-plus'
import axios from 'axios'
defineProps([
  'tableData',
  'operations',
  'listData',
  'exportFunc',
  'DeleteFunc',
  'control',
  'exportCharts',
  'transToArrange',
])
const select = ref()
const getList = (ele) => {
  if (typeof ele === 'string') {
    return ele.split(',')
  } else if (Array.isArray(ele)) {
    return ele
  }
}
const donwLoadFile = async (Fileurl, miniType = 'application/octet-stream') => {
  const content = await axios.get(Fileurl, { responseType: 'blob' })
  const blob = new Blob([content.data], { type: miniType })
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
</style>
