<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listPurchaseInfo,
  changePurchaseInfo,
  newPurchaseInfo,
  exportSelectTable,
  deletePurchaseInfo,
  importFile,
  downLoadModule,
} from '@/apis/produceControl/purchase/purchaseInfo'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref, nextTick } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox } from 'element-plus'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
const props = defineProps(['control'])
//渲染页面
const formData = ref([
  [
    { type: 'input', label: '物料ID', key: 'materialId' },
    { type: 'input', label: '外购ID', key: 'purchaseCode', width: 8 },
    { type: 'input', label: '供应商', key: 'supplier' },
  ],
])

const newFormData = ref([
  [
    {
      type: 'inputSelect',
      label: '物料ID',
      key: 'materialId',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/material-info/list', 'id'),
    },
    {
      type: 'input',
      label: '外购ID',
      key: 'purchaseCode',
      width: 12,
      rules: [requiredRule],
    },
  ],
  [
    { type: 'input', label: '单价', key: 'unitPrice', width: 12, rules: [positiveNumberRule] },
    { type: 'input', label: '供应商', key: 'supplier', width: 12, rules: [requiredRule] },
  ],
  [{ type: 'image', label: '样例图', key: 'picture', width: 12 }],
])
const newSubmit = ref({
  materialId: '',
  purchaseCode: '',
  unitPrice: '',
  supplier: '',
  picture: '',
})
const searchContent = ref({
  creationTime: '',
  deliveryDate: '',
  operator: '',
  colorCode: '',
  supplier: '',
  materialId: '',
})
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
  {
    value: 'pictureUrl',
    label: '产品图片',
    type: 'picture',
  },
  { value: 'materialId', label: '物料ID', type: 'text' },

  {
    value: 'purchaseCode',
    label: '外购ID',
    type: 'text',
  },
  {
    value: 'supplier',
    label: '供应商',
    type: 'text',
  },
  {
    value: 'unitPrice',
    label: '单价',
    type: 'text',
  },
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
      newSubmit.value = { ...row }
      nextTick(() => {
        createFormRef.value.clearValidate()
      })
    },
    value: '编辑',
    disabled: props.control[1].disabled,
  },
  // {
  //   func: (row) => {
  //     props.addTab('外购资料-' + row.id, InfoDetail, row, null)
  //   },
  //   value: '查看',
  //   disabled: false,
  // },
])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const createFormRef = ref(null)

const handleSubmit = () => {
  createFormRef.value.validateForm((valid) => {
    if (valid) {
      if (title.value === '编辑') {
        changePurchaseInfo(newSubmit.value).then((res) => {
          page.value = 1
          listPurchaseInfo(page.value, pageSize.value).then((res) => {
            listData.value = res.rows
            total.value = res.total
          })
          ElMessage.success(res.msg)
          editDialogVisible.value = false
        })
      } else {
        newSubmit.value.creationTime = parseTime(newSubmit.value.creationTime, '{y}-{m}-{d}')
        newSubmit.value.deliveryDate = parseTime(newSubmit.value.deliveryDate, '{y}-{m}-{d}')
        newSubmit.value.deliveryTime = parseTime(newSubmit.value.deliveryTime, '{y}-{m}-{d}')
        newSubmit.value.orderTime = parseTime(newSubmit.value.orderTime, '{y}-{m}-{d}')
        newPurchaseInfo(newSubmit.value).then((res) => {
          page.value = 1
          listPurchaseInfo(page.value, pageSize.value).then((res) => {
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
    materialId: '',
    purchaseCode: '',
    unitPrice: '',
    supplier: '',
    picture: '',
  }
}
const onCreate = () => {
  resetSubmit()
  title.value = '新增'
  editDialogVisible.value = true

  createFormRef.value.clearValidate()
}

const onSubmit = () => {
  searchContent.value.creationTime = parseTime(searchContent.value.creationTime, '{y}-{m}-{d}')
  searchContent.value.deliveryDate = parseTime(searchContent.value.deliveryDate, '{y}-{m}-{d}')
  page.value = 1
  listPurchaseInfo(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
const onDownloadTemplate = () => {
  downLoadModule().then((res) => {
    downloadBinaryFile(res, '外购资料模板.xlsx')
  })
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData).then((res) => {
    ElMessage.success(res.msg)
    listPurchaseInfo(page.value, pageSize.value).then((res) => {
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
    downloadBinaryFile(res, '外购资料_' + now.toLocaleDateString() + '_' + count + '.xlsx')
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
    return deletePurchaseInfo(ids).then((res) => {
      listPurchaseInfo(page.value, pageSize.value).then((res) => {
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
  listPurchaseInfo(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listPurchaseInfo(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listPurchaseInfo(page.value, pageSize.value).then((res) => {
  console.log(res)
  total.value = res.total
  listData.value = res.rows
})
</script>
<template>
  <div class="col">
    <BordShow content="外购资料" path="生产管理/采购/外购资料" />
    <div class="greyBack">
      <FormSearch
        title="查询"
        :data="formData"
        :onCreate="onCreate"
        :onSubmit="onSubmit"
        :onImport="onImport"
        :onDownloadTemplate="onDownloadTemplate"
        :searchForm="searchContent"
        :control="control"
      />
      <TableList
        :tableData="tableData"
        :operations="operation"
        :listData="listData"
        :DeleteFunc="DeleteFunc"
        :exportFunc="exportFunc"
        :control="control"
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
