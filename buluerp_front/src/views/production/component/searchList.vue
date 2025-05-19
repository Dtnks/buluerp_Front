<template>
  <el-card style="width: 100%; margin: 0 20px;">
    <template #header>
      <div class="card-header">
        <span>展示</span>
      </div>
    </template>
    <div>
      <el-table :data="data" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="id" label="产品编码" />
        <el-table-column prop="name" label="产品名称" />
        <el-table-column prop="designStatus" label="产品状态">
          <template #default="{ row }">
            <span style="display: flex; align-items: center;">
              <span
                :style="{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: row.designStatus === '已完成' ? '#67C23A' : '#C0C4CC',
                  marginRight: '8px',
                }"
              ></span>
              {{ row.designStatus || '未定义' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="pictureUrl" label="产品图片" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column label="操作" fixed="right" width="250">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="onView(row)">查看</el-button>
            <el-button size="small" type="primary" text>编辑</el-button>
            <el-button size="small" type="primary" text>导出</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div>共 {{ total }} 条</div>
        <el-pagination
          background
          layout="prev, pager, next, jumper, ->, total, sizes"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { getList_pro } from '@/apis/products.js' // 你的接口方法

import Detail from '../main/Detail.vue' // 确保路径正确
const props = defineProps<{
  queryParams: Record<string, any>
  addTab: (targetName: string, component: any, data?: any) => void
}>()

const data = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchData = async () => {
  const res = await getList_pro({
    ...props.queryParams,
    pageNum: page.value,
    pageSize: pageSize.value,
  })
  data.value = res.rows || []
  total.value = res.total || 0
}

watch(
  () => [props.queryParams, page.value, pageSize.value],
  fetchData,
  { immediate: true, deep: true }
)

const handlePageChange = (val: number) => {
  page.value = val
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
}

const onView = (row: any) => {
  props.addTab('详情页', Detail, {id : row.id})
  console.log('id是',row.id)
}
</script>
