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
import { ElMessageBox } from 'element-plus'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
const props = defineProps(['control'])
//渲染页面
const createFormRef = ref()
const formData = ref([
  [
    { type: 'timer', label: '安排日期', timerType: 'date', key: 'scheduledTime' },
    { type: 'timer', label: '排产时间', timerType: 'date', key: 'productionTime' },
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
  [
    { type: 'input', label: '订单编号', key: 'orderCode' },
    { type: 'input', label: '产品编码', key: 'productCode' },
  ],
])
const newFormData = ref([
  [
    {
      type: 'input',
      label: '排产模数',
      key: 'productionMouldCount',
      width: 8,
      timerType: 'date',
      rules: [requiredRule],
    },
    {
      type: 'input',
      label: '排产数量',
      key: 'productionQuantity',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'input',
      label: '排产重量',
      key: 'productionWeight',
      width: 8,
      rules: [positiveNumberRule],
    },
  ],
  [
    { type: 'input', label: '颜色编号', key: 'colorCode', width: 12, rules: [requiredRule] },
    { type: 'input', label: '料别', key: 'materialType', width: 12, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '出模数', key: 'mouldOutput', width: 12, rules: [positiveNumberRule] },
    { type: 'input', label: '模具编号', key: 'mouldNumber', width: 12, rules: [requiredRule] },
  ],
  [
    {
      type: 'inputSelect',
      label: '产品ID',
      key: 'productId',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/products/list', 'id'),
    },
    {
      type: 'inputSelect',
      label: '订单Id',
      key: 'orderCode',
      width: 12,
      rules: [requiredRule],
      remoteFunc: searchFunc('system/orders/list', 'innerId'),
      options: [],
      loading: false,
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
    { type: 'input', label: '单重', key: 'singleWeight', width: 12, rules: [positiveNumberRule] },
  ],
  [
    {
      type: 'timer',
      label: '排产时间',
      key: 'productionTime',
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
      rules: [requiredRule],
    },
  ],
  [{ type: 'textarea', label: '备注', key: 'remarks', width: 24 }],
  [{ type: 'image', label: '样例图', key: 'picture', width: 12 }],
])
const newSubmit = ref({
  colorCode: '',
  completionTime: '',
  productionTime: '',
  materialType: '',
  mouldNumber: '',
  mouldOutput: '',
  orderCode: '',
  productionId: '',
  productCode: '',
  productId: '',
  productionMouldCount: '',
  productionQuantity: '',
  scheduledTime: '',
  singleWeight: '',
  picture: null,
})
const searchContent = ref({
  colorCode: '',
  completionTime: '',
  productionTime: '',
  materialType: '',
  mouldNumber: '',
  mouldOutput: '',
  orderCode: '',
  productCode: '',
})
const tableData = ref([
  {
    value: 'orderCode',
    label: '订单编号',
    type: 'text',
  },
  {
    value: 'productCode',
    label: '产品编码',
    type: 'text',
  },
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
  { value: 'pictureUrl', label: '图片', type: 'picture' },
  { value: 'productionTime', label: '排产时间', type: 'text' },
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
    value: 'productId',
    label: '产品编号',
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
    disabled: props.control[1].disabled,
  },
  // {
  //   func: (row) => {
  //     props.addTab('采购计划-' + row.id, PlanDetail, row, null)
  //   },
  //   value: '查看',
  //   disabled: false,
  // },
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
      newSubmit.value.productionTime = parseTime(newSubmit.value.productionTime, '{y}-{m}-{d}')
      if (title.value == '编辑') {
        changeArrange(newSubmit.value).then((res) => {
          console.log(res)
          if (res.code == 200) {
            page.value = 1
            listArrange(page.value, pageSize.value).then((res) => {
              listData.value = res.rows
              total.value = res.total
            })
            ElMessage.success(res.msg)
            editDialogVisible.value = false
          } else {
            ElMessage.error(res.msg)
            return
          }
        })
      } else {
        newArrange(newSubmit.value).then((res) => {
          console.log(res)
          if (res.msg == '操作成功') {
            page.value = 1
            listArrange(page.value, pageSize.value).then((res) => {
              listData.value = res.rows
              total.value = res.total
            })
            ElMessage.success(res.msg)
            editDialogVisible.value = false
          } else {
            ElMessage.error('操作失败')
            return
          }
        })
      }
    }
  })
}
const title = ref('编辑')
//传给form组件的参数
const resetSubmit = () => {
  newSubmit.value = {
    colorCode: '',
    completionTime: '',
    productionTime: '',
    materialType: '',
    mouldNumber: '',
    mouldOutput: '',
    orderCode: '',
    productionId: '',
    productCode: '',
    productId: '',
    productionMouldCount: '',
    productionQuantity: '',
    scheduledTime: '',
    singleWeight: '',
    picture: '',
    pictureUrl: null,
  }
}
const onCreate = () => {
  resetSubmit()
  title.value = '新增'
  editDialogVisible.value = true

  createFormRef.value.clearValidate()
}

const onSubmit = () => {
  page.value = 1
  newSubmit.value.scheduledTime = parseTime(newSubmit.value.scheduledTime, '{y}-{m}-{d}')
  newSubmit.value.completionTime = parseTime(newSubmit.value.completionTime, '{y}-{m}-{d}')
  newSubmit.value.productionTime = parseTime(newSubmit.value.productionTime, '{y}-{m}-{d}')

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
    if (res.code == 200) {
      ElMessage.success(res.msg)
      listArrange(page.value, pageSize.value).then((res) => {
        listData.value = res.rows
        total.value = res.total
      })
    } else {
      ElMessage.error(res.msg)
      const error_text = res.data
        .map((ele) => {
          return '第' + ele.rowNum + '行：' + ele.errorMsg
        })
        .join('<br>')
      ElMessageBox.alert(error_text, '数据格式出现问题', {
        confirmButtonText: '继续',
        type: 'error',
        dangerouslyUseHTMLString: true,
      })
    }
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
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deleteArrange(ids).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        listArrange(page.value, pageSize.value).then((res) => {
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
