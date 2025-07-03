<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listSchedule,
  changeSchedule,
  newSchedule,
  exportSelectTable,
  deleteSchedule,
  importFile,
  downLoadModule,
} from '@/apis/produceControl/produce/schedule'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref, nextTick } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox } from 'element-plus'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
const props = defineProps(['control', 'addTab'])
//渲染页面
const createFormRef = ref()
const formData = ref([
  [
    { type: 'timer', label: '出货日期', timerType: 'date', key: 'shipmentTime' },

    { type: 'timer', label: '布产时间', timerType: 'date', key: 'productionTime' },
  ],
  [
    { type: 'input', label: '操作人', key: 'operator' },
    { type: 'input', label: '颜色编号', key: 'colorCode' },
    {
      type: 'select',
      label: '模具状态',
      key: 'mouldCondition',
      options: [
        { label: '未生产', value: '未生产' },
        { label: '已生产', value: '已生产' },
      ],
    },
  ],
  [
    { type: 'input', label: '订单编号', key: 'orderCode' },
    { type: 'input', label: '产品编号', key: 'productId' },

    { type: 'input', label: '供应商', key: 'supplier' },
  ],
  [
    { type: 'input', label: '模具编码', key: 'mouldNumber' },
    { type: 'input', label: '模具厂家', key: 'mouldManufacturer' },
    { type: 'input', label: '客户', key: 'customer' },
  ],
])
const newFormData = ref([
  [
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
    // { type: 'input', label: '产品编码', key: 'productCode', width: 8 },
  ],
  [
    { type: 'input', label: '模具编码', key: 'mouldNumber', width: 8 },
    {
      type: 'select',
      label: '模具状态',
      key: 'mouldCondition',
      width: 8,
      options: [
        { label: '未生产', value: '未生产' },
        { label: '已生产', value: '已生产' },
      ],
      rules: [requiredRule],
    },

    { type: 'input', label: '用量', key: 'usage', width: 8, rules: [positiveNumberRule] },
  ],
  [
    {
      type: 'mutilInputSelect',
      label: '客户',
      key: 'customer',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/customers/list', 'name'),
    },

    {
      type: 'mutilInputSelect',
      label: '模具厂家',
      key: 'mouldManufacturer',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/manufacturer/list', 'name'),
    },
  ],
  [
    {
      type: 'timer',
      label: '布产时间',
      key: 'productionTime',
      timerType: 'date',
      width: 12,
      rules: [requiredRule],
    },
    {
      type: 'timer',
      label: '出货时间',
      key: 'shipmentTime',
      timerType: 'date',
      width: 12,
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'inputSelect',
      label: '颜色编号',
      key: 'colorCode',
      width: 12,
      remoteFunc: (ele) => {
        ele.loading = true
        ele.options = [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
        ]
        ele.loading = false
      },
      loading: false,
      options: [],
    },
    {
      type: 'inputSelect',
      label: '排产Id',
      key: 'arrangeId',
      width: 12,
      rules: [],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/production-arrange/list', 'id'),
    },
  ],
  [
    {
      type: 'mutilInputSelect',
      label: '物料ID',
      key: 'materialIds',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/material-info/list', 'id'),
    },

    { type: 'input', label: '料别', key: 'materialType', width: 12, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '单重', key: 'singleWeight', width: 8, rules: [positiveNumberRule] },
    {
      type: 'input',
      label: '布产重量',
      key: 'productionWeight',
      width: 8,
      rules: [positiveNumberRule],
    },
    { type: 'input', label: '供应商', key: 'supplier', width: 8, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '腔数PCS', key: 'cavityCount', width: 8, rules: [requiredRule] },
    {
      type: 'input',
      label: '布产模数PCS',
      key: 'productionMouldCount',
      width: 8,
      rules: [requiredRule],
    },
    {
      type: 'input',
      label: '布产数量PCS',
      key: 'productionQuantity',
      width: 8,
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'number',
      label: '色粉数量',
      key: 'colorPowderNeeded',
      width: 8,
      rules: [positiveNumberRule],
    },
    { type: 'input', label: '生产周期(s)', key: 'cycleTime', width: 8, rules: [requiredRule] },
    { type: 'input', label: '生产时间(h)', key: 'timeHours', width: 8, rules: [requiredRule] },
  ],
  [{ type: 'image', label: '样例图', key: 'picture', width: 24 }],
])
const newSubmit = ref({
  orderCode: '',
  productId: '',
  productionTime: '',
  productCode: '',
  mouldNumber: '',
  mouldCondition: '',
  picture: '',
  colorCode: '',
  usage: '',
  supplier: '',
  mouldManufacturer: '',
  customer: '',
  shipmentTime: '',
  singleWeight: '',
  productionWeight: '',
  cavityCount: '',
  productionMouldCount: '',
  productionQuantity: '',
  colorPowderNeeded: '',
  materialType: '',
  cycleTime: '',
  timeHours: '',
})
const searchContent = ref({
  shipmentTime: '',
  productionTime: '',
  operator: '',
  colorCode: '',
  mouldCondition: '',
  orderCode: '',
  productCode: '',
  mouldNumber: '',
  supplier: '',
  mouldManufacturer: '',
  customer: '',
})
const tableData = ref([
  {
    value: 'orderCode',
    label: '订单编号',
    type: 'text',
  },
  {
    value: 'productId',
    label: '产品编号',
    type: 'text',
  },
  {
    value: 'arrangeId',
    label: '排产Id',
    type: 'text',
  },

  {
    value: 'materialIds',
    label: '物料ID',
    type: 'tags',
  },
  { value: 'pictureUrl', label: '图片', type: 'picture' },
  {
    value: 'productionTime',
    label: '布产时间',
    type: 'text',
  },
  {
    value: 'mouldNumber',
    label: '模具编码',
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
    value: 'cavityCount',
    label: '腔数PCS',
    type: 'text',
  },
  {
    value: 'singleWeight',
    label: '单重',
    type: 'text',
  },
  {
    value: 'productionQuantity',
    label: '布产数量PCS',
    type: 'text',
  },
  {
    value: 'productionMouldCount',
    label: '布产模数PCS',
    type: 'text',
  },
  {
    value: 'productionWeight',
    label: '布产重量',
    type: 'text',
  },
  {
    value: 'shipmentTime',
    label: '出货时间',
    type: 'text',
  },
  {
    value: 'operator',
    label: '操作人',
    type: 'text',
  },
  {
    value: 'mouldCondition',
    label: '模具状态',
    type: 'text',
  },
  {
    value: 'usage',
    label: '用量',
    type: 'text',
  },
  { value: 'supplier', label: '供应商', type: 'text' },
  { value: 'mouldManufacturer', label: '模具厂家', type: 'tags' },
  {
    value: 'colorPowderNeeded',
    label: '色粉数量',
    type: 'text',
  },
  {
    value: 'cycleTime',
    label: '生产周期(s)',
    type: 'text',
  },
  {
    value: 'timeHours',
    label: '生产时间(h)',
    type: 'text',
  },
  {
    value: 'customer',
    label: '客户',
    type: 'tags',
  },
])
const operation = ref([
  {
    func: (row) => {
      const id = row.id
      title.value = '编辑'
      editDialogVisible.value = true

      nextTick(() => {
        createFormRef.value.clearValidate()
      })
      newSubmit.value = { ...row }
    },
    value: '编辑',
    disabled: props.control[1].disabled,
  },
])
const title = ref('新增')
//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const handleSubmit = () => {
  if (newSubmit.value.picture == '') {
    delete newSubmit.value.picture
  }
  createFormRef.value.validateForm((valid) => {
    if (valid) {
      newSubmit.value.productionTime = parseTime(newSubmit.value.productionTime, '{y}-{m}-{d}')
      newSubmit.value.shipmentTime = parseTime(newSubmit.value.shipmentTime, '{y}-{m}-{d}')
      if (title.value == '编辑') {
        changeSchedule(newSubmit.value).then((res) => {
          console.log(res)
          if (res.code == 200) {
            page.value = 1
            listSchedule(page.value, pageSize.value).then((res) => {
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
        newSchedule(newSubmit.value).then((res) => {
          if (res.msg == '操作成功') {
            page.value = 1
            listSchedule(page.value, pageSize.value).then((res) => {
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
//传给form组件的参数
const resetSubmit = () => {
  newSubmit.value = {
    orderCode: '',
    productId: '',
    productionTime: '',
    productCode: '',
    mouldNumber: '',
    mouldCondition: '',
    picture: '',
    colorCode: '',
    usage: '',
    supplier: '',
    mouldManufacturer: '',
    customer: '',
    shipmentTime: '',
    singleWeight: '',
    productionWeight: '',
    cavityCount: '',
    productionMouldCount: '',
    productionQuantity: '',
    colorPowderNeeded: '',
    materialType: '',
    cycleTime: '',
    timeHours: '',
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
  searchContent.value.productionTime = parseTime(searchContent.value.productionTime, '{y}-{m}-{d}')
  searchContent.value.shipmentTime = parseTime(searchContent.value.shipmentTime, '{y}-{m}-{d}')

  listSchedule(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
const onDownloadTemplate = () => {
  downLoadModule().then((res) => {
    downloadBinaryFile(res, '布产表导入模板.xlsx')
  })
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg)
      listSchedule(page.value, pageSize.value).then((res) => {
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
    downloadBinaryFile(res, '布产表_' + now.toLocaleDateString() + '_' + count + '.xlsx')
    count += 1
  })
}

const DeleteFunc = (row) => {
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deleteSchedule(ids).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        listSchedule(page.value, pageSize.value).then((res) => {
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
  listSchedule(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listSchedule(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listSchedule(page.value, pageSize.value).then((res) => {
  console.log(res)
  total.value = res.total
  listData.value = res.rows
})
</script>
<template>
  <div class="col">
    <BordShow content="布产表" path="生产管理/采购/布产表" />
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
