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
  importmanufacturersFile,
  downLoadModule,
} from '@/apis/manufacturers.js'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
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
    label: 'ID',
    type: 'text',
  },
  {
    value: 'name',
    label: '姓名',
    type: 'text',
  },
  {
    value: 'tel',
    label: '联系方式',
    type: 'text',
  },
  {
    value: 'email',
    label: '邮箱',
    type: 'text',
  },
  {
    value: 'remark',
    label: '备注',
    type: 'text',
  },
  { value: 'createTime', label: '创建时间', type: 'text' },
])
const operation = ref([

  {
    func: (row) => {
      const id = row.id
      title.value = '编辑'
      editDialogVisible.value = true
      newSubmit.value = { ...row }
    },
    value: '编辑',
  },
])
const searchContent = ref({ name: '', creatTime: '', email: '', remark: '', tel: '' })

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const newSubmit = ref({})
// 定义表单校验规则
const rules = ref<FormRules>({
  name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  tel: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
  email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
})

// 表单引用
const formRef = ref<FormInstance>()
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (title.value == '编辑') {
        changeManufacturers(newSubmit.value).then((res) => {
          page.value = 1
          listManufacturers(page.value, pageSize.value).then((res) => {
            listData.value = res.rows
            total.value = res.total
          })
          ElMessage.success(res.msg)
          editDialogVisible.value = false
        })
      } else {
        newManufacturers(newSubmit.value).then((res) => {
          page.value = 1
          listManufacturers(page.value, pageSize.value).then((res) => {
            listData.value = res.rows
            total.value = res.total
          })
          ElMessage.success(res.msg)
          editDialogVisible.value = false
        })
      }
    }
  })
}
const title = ref('编辑')
//传给form组件的参数
const onCreate = () => {
  newSubmit.value = {}
  title.value = '新增'
  editDialogVisible.value = true
}

const onSubmit = () => {
  searchContent.value.createTimeFrom = parseTime(searchContent.value.creatTime[0], '{y}-{m}-{d}')
  searchContent.value.createTimeTo = parseTime(searchContent.value.creatTime[1], '{y}-{m}-{d}')
  page.value = 1
  listManufacturers(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}
const onDownloadTemplate = () => {
  downLoadModule().then((res) => {
    downloadBinaryFile(res, '厂商信息模板.xlsx')
  })
}
const onImport = () => {
  importDialogVisible.value = true
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importmanufacturersFile(formData).then((res) => {
    ElMessage.success(res.msg)
    listManufacturers(page.value, pageSize.value).then((res) => {
      listData.value = res.rows
      total.value = res.total
    })
    importDialogVisible.value = false
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
    downloadBinaryFile(res, '厂商信息_' + now.toLocaleDateString() + '_' + count + '.xlsx')
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
    return deleteManufacturers(ids).then((res) => {
      listManufacturers(page.value, pageSize.value).then((res) => {
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
        :onDownloadTemplate="onDownloadTemplate"
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
      ><el-form ref="formRef" :model="newSubmit" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="newSubmit.name" style="width: 240px" />
        </el-form-item>
        <el-form-item label="联系方式" prop="tel">
          <el-input v-model="newSubmit.tel" style="width: 240px" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newSubmit.email" style="width: 240px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newSubmit.remark" style="width: 240px" />
        </el-form-item>
      </el-form>
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
<style scoped></style>
