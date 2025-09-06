<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listArrange,
  changeArrange,
  newArrange,
  exportSelectTable,
  deleteArrange,
  importFile,
  downLoadModule,
} from '@/apis/produceControl/produce/arrange'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref, nextTick } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'

//渲染页面
const createFormRef = ref()
const formData = ref([
  [
    { type: 'timer', label: '安排日期', timerType: 'date', key: 'scheduledTime' },
    { type: 'timer', label: '完成时间', timerType: 'date', key: 'completionTime' },
  ],
  [
    { type: 'input', label: '操作人', key: 'operator' },
    { type: 'input', label: '颜色编号', key: 'colorCode' },
    {
      type: 'input',
      label: '料别',
      key: 'materialType',
    },
  ],
])
const newFormData = ref([
  [

    {
      type: 'input',
      label: '排产数量',
      key: 'productionQuantity',
      width: 12,
      rules: [positiveNumberRule,requiredRule],
    },
    {
      type: 'input',
      label: '排产重量',
      key: 'productionWeight',
      width: 12,
      rules: [positiveNumberRule,requiredRule],
    },
  ],
  [
    {
      type: 'input',
      label: '出模数',
      key: 'mouldOutput',
      width: 12,
      rules: [positiveNumberRule,requiredRule] },
    {
      type: 'input',
      label: '单重',
      key: 'singleWeight',
      width: 12,
      rules: [positiveNumberRule,requiredRule]
    },

  ],
  [
    {
      type: 'timer',
      label: '安排时间',
      key: 'scheduledTime',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },

    {
      type: 'timer',
      label: '完成时间',
      key: 'completionTime',
      width: 12,
      timerType: 'date',
      rules: [],
    },
  ],
  [{ type: 'textarea', label: '备注', key: 'remarks', width: 24 }],
  [{ type: 'image', label: '样例图', key: 'picture', width: 12 }],
])
const newSubmit = ref({
  colorCode: '',
  completionTime: '',
  creationTime: '',
  materialType: '',
  mouldNumber: '',
  mouldOutput: '',
  productionQuantity: '',
  scheduledTime: '',
  singleWeight: '',
})
const searchContent = ref({
  colorCode: '',
  completionTime: '',
  materialType: '',
  mouldNumber: '',
  mouldOutput: '',
})
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
  { value: 'pictureUrl', label: '图片', type: 'picture' },
  {
    value: 'mouldNumber',
    label: '模具编号',
    type: 'text',
  },
  {
    value: 'colorCode',
    label: '颜色编号',
    type: 'text',
  },
  {
    value: 'materialType',
    label: '料别',
    type: 'text',
  },
  {
    value: 'mouldOutput',
    label: '出模数',
    type: 'text',
  },
  {
    value: 'singleWeight',
    label: '单重',
    type: 'text',
  },
  {
    value: 'productionQuantity',
    label: '排产数量',
    type: 'text',
  },
  {
    value: 'productionMouldCount',
    label: '排产模数',
    type: 'text',
  },
  {
    value: 'productionWeight',
    label: '排产重量',
    type: 'text',
  },
  {
    value: 'scheduledTime',
    label: '安排时间',
    type: 'text',
  },
  {
    value: 'completionTime',
    label: '完成时间',
    type: 'text',
  },
  {
    value: 'operator',
    label: '操作人',
    type: 'text',
  },
  {
    value: 'remarks',
    label: '备注',
    type: 'text',
  },
])
const operation = ref([
  // {
  //   func: (id) => {
  //     console.log(id)
  //     detailCustomer(id).then((res) => {
  //        
  //     })
  //   },
  //   value: '查看',
  // },
  {
    func: (row) => {
      const id = row.id
      title.value = '编辑'
      editDialogVisible.value = true
      resetSubmit()
      nextTick(() => {
        createFormRef.value.clearValidate()
      })
      newSubmit.value = { ...row }
      if (row.pictureUrl) {
        newSubmit.value.pictureUrl = row.pictureUrl
      } else {
        delete newSubmit.value.pictureUrl
      }
      console.log(newSubmit.value)
    },
    value: '编辑',
  },

])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const handleSubmit = () => {
  if (newSubmit.value.picture == '') {
    delete newSubmit.value.picture
  }
  createFormRef.value.validateForm((valid) => {
    if (valid) {
      newSubmit.value.scheduledTime = parseTime(newSubmit.value.scheduledTime, '{y}-{m}-{d}')
      newSubmit.value.completionTime = parseTime(newSubmit.value.completionTime, '{y}-{m}-{d}')
      if (title.value == '编辑') {
        changeArrange(newSubmit.value).then((res) => {
          page.value = 1
          listArrange(page.value, pageSize.value).then((res) => {
            listData.value = res.rows
            total.value = res.total
          })
          ElMessage.success(res.msg)
          editDialogVisible.value = false
        })
      } else {
        newArrange(newSubmit.value).then((res) => {
          page.value = 1
          listArrange(page.value, pageSize.value).then((res) => {
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
const resetSubmit = () => {
  newSubmit.value = {

  }
}


const onSubmit = () => {
  page.value = 1
  newSubmit.value.scheduledTime = parseTime(newSubmit.value.scheduledTime, '{y}-{m}-{d}')
  newSubmit.value.completionTime = parseTime(newSubmit.value.completionTime, '{y}-{m}-{d}')

  listArrange(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
const onDownloadTemplate = () => {
  downLoadModule().then((res) => {
    downloadBinaryFile(res, '排产表导入模板.xlsx')
  })
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData).then((res) => {
    ElMessage.success(res.msg)
    listArrange(page.value, pageSize.value).then((res) => {
      listData.value = res.rows
      total.value = res.total
    })
  })

  importDialogVisible.value = false
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
    downloadBinaryFile(res, '排产表_' + now.toLocaleDateString() + '_' + count + '.xlsx')
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
    return deleteArrange(ids).then((res) => {
      listArrange(page.value, pageSize.value).then((res) => {
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
  listArrange(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listArrange(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listArrange(page.value, pageSize.value).then((res) => {
  total.value = res.total
  listData.value = res.rows
  console.log(res.rows)
})
</script>
<template>
  <div class="col">
    <BordShow content="排产表" path="生产管理/采购/排产表" />
    <div class="greyBack">
      <FormSearch
        title="查询"
        :data="formData"
        :onSubmit="onSubmit"
        :onImport="onImport"
        :onDownloadTemplate="onDownloadTemplate"
        :searchForm="searchContent"
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

    <el-dialog v-model="editDialogVisible" :title="title" width="800px"
      ><CreateForm :data="newFormData" :Formvalue="newSubmit" ref="createFormRef" />

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
