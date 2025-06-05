<script setup lang="ts">
import {
  newRecording,
  listRecording,
  changeRecording,
  deleteRecording,
  exportSelectTable,
  importFile,
} from '@/apis/produceControl/inventory/AllInventory'

import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox } from 'element-plus'
const type = ref('part')
const refreshList = () => {
  listRecording(page.value, pageSize.value, type.value).then((res) => {
    console.log(res)
    listData.value = res.data
    total.value = res.total
  })
}
// listRecording(1, 10, 'product').then((res) => {
//   console.log(res)
// })
const TypeOptions = [
  {
    label: '料包',
    value: 'packaging-material',
  },
  {
    label: '胶件',
    value: 'part',
  },
  {
    label: '成品',
    value: 'product',
  },
]
const props = defineProps(['control'])
//渲染页面
const formData = ref({
  'packaging-material': [
    [
      { type: 'input', label: '操作人', key: 'operator' },
      { type: 'timer', label: '创建曰期', timerType: 'date', key: 'creationTime' },
      { type: 'input', label: '颜色编号', key: 'colorCode', width: 8 },
    ],
    [
      { type: 'timer', label: '预交时间', key: 'deliveryDate', timerType: 'date' },
      { type: 'input', label: '供应商', key: 'supplier' },
      { type: 'input', label: '料别', key: 'materialType' },
    ],
  ],
  part: [
    [
      { type: 'input', label: '操作人', key: 'operator' },
      { type: 'timer', label: '创建曰期', timerType: 'date', key: 'creationTime' },
      { type: 'input', label: '颜色编号', key: 'colorCode', width: 8 },
    ],
  ],
  product: [
    [
      { type: 'input', label: '操作人', key: 'operator' },
      { type: 'timer', label: '创建曰期', timerType: 'date', key: 'creationTime' },
      { type: 'input', label: '颜色编号', key: 'colorCode', width: 8 },
    ],
    [
      { type: 'input', label: '供应商', key: 'supplier' },
      { type: 'input', label: '料别', key: 'materialType' },
      { type: 'input', label: '模具编号', key: 'mouldNumber' },
    ],
  ],
})
const newFormData = ref({
  'packaging-material': [
    [
      { type: 'input', label: '进出数量', key: 'inOutQuantity', width: 12 },
      { type: 'input', label: '料包编号', key: 'packagingNumber', width: 12 },
    ],
    [
      { type: 'timer', label: '日期', key: 'changeDate', width: 12, timerType: 'date' },
      { type: 'input', label: '订单编号', key: 'orderCode', width: 12 },
    ],
    [
      { type: 'input', label: '产品货号', key: 'productPartNumber', width: 12 },
      { type: 'input', label: '仓库位置', key: 'storageLocation', width: 12 },
    ],
    [{ type: 'textarea', label: '客户备注', key: 'remarks', width: 24 }],
  ],
  part: [
    [
      { type: 'input', label: '进出数量', key: 'inOutQuantity', width: 12 },
      { type: 'timer', label: '日期', key: 'changeDate', width: 12, timerType: 'date' },
    ],
    [
      { type: 'input', label: '颜色编号', key: 'colorCode', width: 8 },
      { type: 'input', label: '订单编号', key: 'orderCode', width: 8 },
      { type: 'input', label: '模具编号', key: 'mouldNumber', width: 8 },
    ],
    [{ type: 'textarea', label: '客户备注', key: 'remarks', width: 24 }],
  ],
  product: [
    [
      { type: 'input', label: '进出数量', key: 'inOutQuantity', width: 12 },
      { type: 'timer', label: '日期', key: 'changeDate', width: 12, timerType: 'date' },
    ],
    [
      { type: 'input', label: '料包编号', key: 'productPartNumber', width: 8 },
      { type: 'input', label: '订单编号', key: 'orderCode', width: 8 },
      { type: 'input', label: '仓库位置', key: 'storageLocation', width: 8 },
    ],
    [{ type: 'textarea', label: '客户备注', key: 'remarks', width: 24 }],
  ],
})
const newSubmit = ref({
  'packaging-material': {
    inOutQuantity: '',
    packagingNumber: '',
    changeDate: '',
    orderCode: '',
    productPartNumber: '',
    storageLocation: '',
    remarks: '',
  },
  part: {
    inOutQuantity: '',
    changeDate: '',
    colorCode: '',
    orderCode: '',
    mouldNumber: '',
    remarks: '',
  },
  product: {
    inOutQuantity: '',
    changeDate: '',
    productPartNumber: '',
    orderCode: '',
    storageLocation: '',
    remarks: '',
  },
})
const searchContent = ref({
  'packaging-material': {
    creationTime: '',
    deliveryDate: '',
    operator: '',
    colorCode: '',
    supplier: '',
    materialType: '',
  },
  part: {},
  product: {},
})
const tableData = ref({
  'packaging-material': [
    {
      value: 'id',
      label: '采购单号',
      type: 'text',
    },
    { value: 'creationTime', label: '创建时间', type: 'text' },
    {
      value: 'operator',
      label: '操作人',
      type: 'text',
    },
    {
      value: 'materialType',
      label: '料别',
      type: 'text',
    },
    {
      value: 'mouldNumber',
      label: '模具编号',
      type: 'text',
    },
    {
      value: 'productId',
      label: '产品ID',
      type: 'text',
    },
    {
      value: 'pictureUrl',
      label: '产品图片',
      type: 'picture',
    },
    {
      value: 'colorCode',
      label: '颜色编号',
      type: 'text',
    },
    {
      value: 'deliveryDate',
      label: '预交时间',
      type: 'text',
    },
    {
      value: 'orderTime',
      label: '下单时间',
      type: 'text',
    },
    {
      value: 'purchaseQuantity',
      label: '采购数量',
      type: 'text',
    },
    {
      value: 'singleWeight',
      label: '单重',
      type: 'text',
    },
    {
      value: 'purchaseWeight',
      label: '采购重量',
      type: 'text',
    },
    {
      value: 'supplier',
      label: '供应商',
      type: 'text',
    },

    {
      value: 'remarks',
      label: '备注',
      type: 'text',
    },
  ],
  part: [
    {
      value: 'id',
      label: '采购单号',
      type: 'text',
    },
    { value: 'creationTime', label: '创建时间', type: 'text' },
    {
      value: 'operator',
      label: '操作人',
      type: 'text',
    },
    {
      value: 'materialType',
      label: '料别',
      type: 'text',
    },
    {
      value: 'mouldNumber',
      label: '模具编号',
      type: 'text',
    },
  ],
  product: [
    {
      value: 'id',
      label: '采购单号',
      type: 'text',
    },
    { value: 'creationTime', label: '创建时间', type: 'text' },
    {
      value: 'operator',
      label: '操作人',
      type: 'text',
    },
    {
      value: 'materialType',
      label: '料别',
      type: 'text',
    },
    {
      value: 'mouldNumber',
      label: '模具编号',
      type: 'text',
    },
  ],
})
const operation = ref({
  'packaging-material': [
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
  ],
  part: [],
  product: [],
})

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const handleSubmit = () => {
  if (title.value == '编辑') {
    console.log(newSubmit.value)
    changeRecording(newSubmit.value, type.value).then((res) => {
      if (res.code == 200) {
        page.value = 1
        listRecording(page.value, pageSize.value, type.value).then((res) => {
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
    newRecording(newSubmit.value, type.value).then((res) => {
      if (res.msg == '操作成功') {
        page.value = 1
        listRecording(page.value, pageSize.value, type.value).then((res) => {
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
const title = ref('编辑')
//传给form组件的参数
const resetSubmit = () => {
  newSubmit.value = {
    creationTime: '',
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
}

const onSubmit = () => {
  searchContent.value.creationTime = parseTime(searchContent.value.creationTime, '{y}-{m}-{d}')
  searchContent.value.deliveryDate = parseTime(searchContent.value.deliveryDate, '{y}-{m}-{d}')
  page.value = 1
  listRecording(page.value, pageSize.value, type.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
// const onDownloadTemplate = () => {
//   downLoadModule().then((res) => {
//     downloadBinaryFile(res, '采购计划模板.xlsx')
//   })
// }
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData, type.value).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg)
      listRecording(page.value, pageSize.value, type.value).then((res) => {
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
  exportSelectTable(formData, type.value).then((res) => {
    const now = new Date()
    downloadBinaryFile(res, '客户信息_' + now.toLocaleDateString() + '_' + count + '.xlsx')
    count += 1
  })
}

const DeleteFunc = (row) => {
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deleteRecording(ids, type.value).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        listRecording(page.value, pageSize.value, type.value).then((res) => {
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
  listRecording(page.value, pageSize.value, type.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listRecording(page.value, pageSize.value, type.value).then((res) => {
    listData.value = res.rows
  })
}
</script>
<template>
  <div class="col">
    <BordShow content="出入库单" path="生产管理中心/出入库单" />
    <div class="greyBack">
      <FormSearch
        title="查询"
        :data="formData[type]"
        :onCreate="onCreate"
        :onSubmit="onSubmit"
        :onImport="onImport"
        :onDownloadTemplate="onDownloadTemplate"
        :searchForm="searchContent"
        :control="control"
      >
        <el-select v-model="type" placeholder="Select" style="width: 100px" @change="refreshList">
          <el-option
            v-for="item in TypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </FormSearch>
      <TableList
        :tableData="tableData[type]"
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
      ><CreateForm :data="newFormData[type]" :Formvalue="newSubmit" />
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
