<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import BordShow from '@/components/board/SecBoard.vue'
import { getLog, deleteLog, listLog, exportSelectTable } from '@/apis/Log'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref, nextTick } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { messageBox } from '@/components/message/messageBox'
const props = defineProps([ 'addTab'])
//渲染页面
const createFormRef = ref()
const formData = ref([
  [
    { type: 'input', label: '操作人', key: 'operator' },
    { type: 'input', label: '操作详情', key: 'details' },
    { type: 'input', label: '操作类型', key: 'operationType' },
  ],
  [
    { type: 'timer', label: '操作曰期', timerType: 'daterange', key: 'operationTime' },
    { type: 'input', label: '记录ID', key: 'recordId' },
  ],
])

const searchContent = ref({
  operator: '',
  details: '',
  operationTime: '',
  operationType: '',
  recordId: '',
})
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
  {
    value: 'details',
    label: '操作详情',
    type: 'text',
  },
  {
    value: 'operationTime',
    label: '操作时间',
    type: 'text',
  },
  {
    value: 'operationType',
    label: '操作类型',
    type: 'text',
  },

  {
    value: 'operator',
    label: '操作人',
    type: 'text',
  },
  { value: 'recordId', label: '记录ID', type: 'text' },
])

const onSubmit = () => {
  page.value = 1
  searchContent.value.operationTimeFrom = parseTime(
    searchContent.value.operationTime[0],
    '{y}-{m}-{d}',
  )
  searchContent.value.operationTimeTo = parseTime(
    searchContent.value.operationTime[1],
    '{y}-{m}-{d}',
  )

  listLog(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    console.log(res, searchContent.value)
    total.value = res.total
  })
}

let count = 1
//传给table组件
const exportFunc = (row) => {
  if (row.length === 0) {
    ElMessage.warning('请先选择要导出的产品')
    return
  }
  const formData = new URLSearchParams()
  const ids = row.map((ele) => {
    return ele.id
  })
  // const idsString = Array.isArray(ids) ? ids.join(',') : ids
  formData.append('ids', ids)
  exportSelectTable(formData).then((res) => {
    const now = new Date()
    downloadBinaryFile(res, '日志系统_' + now.toLocaleDateString() + '_' + count + '.xlsx')
    count += 1
  })
}

const DeleteFunc = (row) => {
  if (row.length === 0) {
    ElMessage.warning('请先选择要删除的记录')
    return
  }
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deleteLog(ids).then((res) => {
      listLog(page.value, pageSize.value).then((res) => {
        listData.value = res.rows
        total.value = res.total
      })
    })
  }

  messageBox(
    'warning',
    func,
    `成功删除${ids.length}条记录`,
    '用户权限不足',
    `确认删除${ids.length}条记录`,
  )
}

//分页
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const listData = ref([])
const handlePageChange = async (val: number) => {
  page.value = val
  listLog(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listLog(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listLog(page.value, pageSize.value).then((res) => {
  console.log(res)
  total.value = res.total
  listData.value = res.rows
})
</script>
<template>
  <div class="col">
    <BordShow content="日志系统" path="管理/日志系统" />
    <div class="greyBack">
      <FormSearch
        title="查询"
        :data="formData"
        :onSubmit="onSubmit"
        :searchForm="searchContent"
      />
      <TableList
        :tableData="tableData"
        :listData="listData"
        :DeleteFunc="DeleteFunc"
        :exportFunc="exportFunc"
      >
        <slot>
          <div
            style="
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
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
        </slot>
      </TableList>
    </div>
  </div>
</template>
