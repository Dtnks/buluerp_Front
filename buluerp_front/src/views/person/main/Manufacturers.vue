<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  deleteManufacturers,
  detailManufacturers,
  changeManufacturers,
  newManufacturers,
  listManufacturers,
  exportSelectTable,
} from '@/apis/manufacturers.js'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { importCustomFile } from '@/apis/custom.js'
import { messageBox } from '@/components/message/messageBox'
import { ElMessage } from 'element-plus'
//渲染页面
const formData = ref([
  [
    { type: 'input', label: '姓名', key: 'name' },
    { type: 'timer', label: '创建曰期', timerType: 'daterange', key: 'creatTime' },
  ],
  [
    { type: 'input', label: '联系方式', key: 'tel' },
    { type: 'input', label: '邮箱', key: 'email' },
    { type: 'input', label: '客户备注', key: 'remark' },
  ],
])
const tableData = ref([
  {
    value: 'id',
    label: '用户ID',
  },
  {
    value: 'name',
    label: '姓名',
  },
  {
    value: 'tel',
    label: '联系方式',
  },
  {
    value: 'email',
    label: '邮箱',
  },
  {
    value: 'remark',
    label: '备注',
  },
  { value: 'createTime', label: '创建时间' },
])
const operation = ref([
  // {
  //   func: (id) => {
  //     console.log(id)
  //     detailCustomer(id).then((res) => {
  //       console.log(res)
  //     })
  //   },
  //   value: '查看',
  // },
  {
    func: (row) => {
      const id = row.id
      title.value = '编辑'
      editDialogVisible.value = true
      newSubmit.value = {}
      detailManufacturers(id).then((res) => {
        newSubmit.value = res.data
      })
    },
    value: '编辑',
  },
])
const searchContent = ref({ name: '', creatTime: '', email: '', remark: '', tel: '' })

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const newSubmit = ref({})
const handleSubmit = () => {
  if (title.value == '编辑') {
    changeManufacturers(newSubmit.value).then((res) => {
      page.value = 1
      listManufacturers(page.value, pageSize.value).then((res) => {
        listData.value = res.rows
        total.value = res.total
      })
      editDialogVisible.value = false
    })
  } else {
    newManufacturers(newSubmit.value).then((res) => {
      if (res.msg == '操作成功') {
        page.value = 1
        ElMessage.success('新增成功')
        listManufacturers(page.value, pageSize.value).then((res) => {
          listData.value = res.rows
          total.value = res.total
        })
        editDialogVisible.value = false
      }
    })
  }
}
const title = ref('编辑')
//传给form组件的参数
const onCreate = () => {
  newSubmit.value = {}
  title.value = '新增'
  editDialogVisible.value = true
}

const onSubmit = () => {
  console.log(searchContent.value)
  searchContent.value.createTimeFrom = parseTime(searchContent.value.creatTime[0], '{y}-{m}-{d}')
  searchContent.value.createTimeTo = parseTime(searchContent.value.creatTime[1], '{y}-{m}-{d}')
  page.value = 1
  console.log(searchContent)
  listManufacturers(page.value, pageSize.value, searchContent.value).then((res) => {
    console.log(res)
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    importCustomFile(formData).then((res) => {
      console.log(res)
    })
    ElMessage.success('导入成功')
    importDialogVisible.value = false
  } catch (e) {
    ElMessage.error('导入失败')
  }
}

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
    downloadBinaryFile(res, now.toLocaleDateString())
  })
}

const DeleteFunc = (row) => {
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deleteManufacturers(ids).then((res) => {
      console.log(res, '删除')
      if (res.code == 500) {
        console.log(res)
        throw new Error('权限不足')
      } else {
        listManufacturers(page.value, pageSize.value).then((res) => {
          listData.value = res.rows
          total.value = res.total
        })
      }
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
  listManufacturers(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listManufacturers(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listManufacturers(page.value, pageSize.value).then((res) => {
  total.value = res.total
  listData.value = res.rows
  console.log(res, '厂商')
})
</script>
<template>
  <div class="col">
    <BordShow content="厂商查询" path="用户中心/厂商查询" />
    <div class="greyBack">
      <FormSearch
        title="查询"
        :data="formData"
        :onCreate="onCreate"
        :onSubmit="onSubmit"
        :onImport="onImport"
        :search-form="searchContent"
      />
      <TableList
        :tableData="tableData"
        :operations="operation"
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

    <el-dialog v-model="editDialogVisible" :title="title" width="400px"
      ><div class="col cardCenter">
        <div class="input row">
          <span>姓名 </span><el-input v-model="newSubmit.name" style="width: 240px" />
        </div>
        <div class="input row">
          <span>联系方式 </span><el-input v-model="newSubmit.tel" style="width: 240px" />
        </div>
        <div class="input row">
          <span>邮箱 </span><el-input v-model="newSubmit.email" style="width: 240px" />
        </div>
        <div class="input row">
          <span>备注 </span><el-input v-model="newSubmit.remark" style="width: 240px" />
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
          <el-button
            type="info"
            @click="
              () => {
                editDialogVisible = false
              }
            "
          >
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="importDialogVisible" title="导入 Excel" width="400px">
      <el-upload
        class="upload-demo"
        drag
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handleUpload"
        accept=".xlsx,.xls"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
        <template v-slot:tip>
          <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>
<style scoped>
.input .el-input {
  width: 240px;
}
.cardCenter .el-input {
  margin-bottom: 20px;
}
.input span {
  text-align: right;
  padding-right: 5px;
  width: 60px;
}
</style>
