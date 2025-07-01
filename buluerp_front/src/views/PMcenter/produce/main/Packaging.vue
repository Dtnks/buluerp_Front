<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listPackaging,
  changePackaging,
  newPackaging,
  exportSelectTable,
  deletePackaging,
  importFile,
  downLoadModule,
} from '@/apis/produceControl/produce/packaging'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox } from 'element-plus'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
const props = defineProps(['control'])
const createFormRef = ref()
//渲染页面
const formData = ref([
  [
    { type: 'input', label: '产品名称', key: 'productNameCn' },
    { type: 'input', label: '产品编号', key: 'productId' },
    { type: 'timer', label: '发布日期', key: 'releaseDate', timerType: 'date' },
  ],
  [
    { type: 'input', label: '生产线', key: 'productionLine' },
    { type: 'input', label: '操作人', key: 'operator' },
  ],
  [
    { type: 'input', label: '订单编号', key: 'orderCode' },
    { type: 'input', label: '本袋规格', key: 'bagSpecification' },
  ],
  [
    {
      type: 'select',
      label: '说明书',
      key: 'isManual',
      options: [
        { value: 1, label: '是' },
        { value: 0, label: '否' },
      ],
    },
    {
      type: 'select',
      label: '人偶',
      key: 'isMinifigure',
      options: [
        { value: 1, label: '是' },
        { value: 0, label: '否' },
      ],
    },
    {
      type: 'select',
      label: '起件器',
      key: 'isTool',
      options: [
        { value: 1, label: '是' },
        { value: 0, label: '否' },
      ],
    },
  ],
])
const newFormData = ref([
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
    { type: 'input', label: '生产线', key: 'productionLine', width: 12, rules: [requiredRule] },

    {
      type: 'timer',
      label: '发布日期',
      key: 'releaseDate',
      timerType: 'date',
      width: 12,
      rules: [requiredRule],
    },
  ],
  [
    { type: 'input', label: '本袋规格', key: 'bagSpecification', width: 8, rules: [requiredRule] },
    { type: 'input', label: '本袋重量', key: 'bagWeight', width: 8, rules: [positiveNumberRule] },
    {
      type: 'input',
      label: '本袋数量',
      key: 'packageQuantity',
      width: 8,
      rules: [positiveNumberRule],
    },
  ],
  [
    {
      type: 'select',
      label: '说明书',
      key: 'isManual',
      width: 8,
      options: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      rules: [requiredRule],
    },
    {
      type: 'select',
      label: '人偶',
      key: 'isMinifigure',
      width: 8,
      options: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      rules: [requiredRule],
    },
    {
      type: 'select',
      label: '起件器',
      key: 'isTool',
      width: 8,
      options: [
        { value: 0, label: '否' },
        { value: 1, label: '是' },
      ],
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'number',
      label: '本袋配件',
      key: 'packageAccessories',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'number',
      label: '配件种类',
      key: 'accessoryType',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'number',
      label: '配件数量',
      key: 'accessoryTotal',
      width: 8,
      rules: [positiveNumberRule],
    },
  ],
  [{ type: 'textarea', label: '备注', key: 'remark', width: 24 }],
])
const newSubmit = ref({
  mouldNumber: '',
  orderCode: '',
  materialType: '',
  productId: '',
  productNameCn: '',
  releaseDate: '',
  bagSpecification: '',
  bagWeight: '',
  packageQuantity: '',
  isManual: '',
  isMinifigure: '',
  isTool: '',
  packageAccessories: '',
  accessoryType: '',
  accessoryTotal: '',
  remark: '',
})
const searchContent = ref({
  releaseDate: '',
  operator: '',
  colorCode: '',
  supplier: '',
  materialType: '',
})
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
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
    value: 'productNameCn',
    label: '产品名称',
    type: 'text',
  },
  {
    value: 'productionLine',
    label: '生产线',
    type: 'text',
  },
  {
    value: 'releaseDate',
    label: '发布日期',
    type: 'date',
  },
  {
    value: 'accessoryType',
    label: '配件种类',
    type: 'text',
  },
  {
    value: 'accessoryTotal',
    label: '配件数量/PCS',
    type: 'text',
  },
  {
    value: 'bagList',
    label: '本袋规格',
    type: 'text',
  },
  {
    value: 'operator',
    label: '操作人',
    type: 'text',
  },
  {
    value: 'isManual',
    label: '说明书',
    type: 'Maptext',
    map: { '0': '否', '1': '是' },
  },
  {
    value: 'isMinifigure',
    label: '人偶',
    type: 'Maptext',
    map: { '0': '否', '1': '是' },
  },
  {
    value: 'isTool',
    label: '起见器',
    type: 'Maptext',
    map: { '0': '否', '1': '是' },
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
      createFormRef.value.clearValidate()
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
  createFormRef.value.validateForm((valid) => {
    if (valid) {
      newSubmit.value.releaseDate = parseTime(newSubmit.value.releaseDate, '{y}-{m}-{d}')
      if (title.value == '编辑') {
        console.log(newSubmit.value)
        changePackaging(newSubmit.value).then((res) => {
          if (res.code == 200) {
            page.value = 1
            listPackaging(page.value, pageSize.value).then((res) => {
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
        newPackaging(newSubmit.value).then((res) => {
          console.log(res)
          if (res.msg == '操作成功') {
            page.value = 1
            listPackaging(page.value, pageSize.value).then((res) => {
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
    remarks: '',
    email: '',
    colorCode: '',
    deliveryDate: '',
    deliveryTime: '',
    orderTime: '',
    purchaseQuantity: '',
    singleWeight: '',
    purchaseWeight: '',
    supplier: '',
    materialType: '',
    picture: '',
    mouldNumber: '',
    specification: '',
    orderCode: '',
    productId: '',
  }
}
const onCreate = () => {
  resetSubmit()
  title.value = '新增'
  editDialogVisible.value = true
  createFormRef.value.clearValidate()
}

const onSubmit = () => {
  searchContent.value.releaseDate = parseTime(searchContent.value.releaseDate, '{y}-{m}-{d}')
  page.value = 1
  listPackaging(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
const onDownloadTemplate = () => {
  downLoadModule().then((res) => {
    downloadBinaryFile(res, '分包表导入模板.xlsx')
  })
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg)
      listPackaging(page.value, pageSize.value).then((res) => {
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
    downloadBinaryFile(res, '分包表_' + now.toLocaleDateString() + '_' + count + '.xlsx')
    count += 1
  })
}

const DeleteFunc = (row) => {
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deletePackaging(ids).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        listPackaging(page.value, pageSize.value).then((res) => {
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
  listPackaging(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listPackaging(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listPackaging(page.value, pageSize.value).then((res) => {
  console.log(res)
  total.value = res.total
  listData.value = res.rows
})
</script>
<template>
  <div class="col">
    <BordShow content="分包表" path="生产管理/采购/分包表" />
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
