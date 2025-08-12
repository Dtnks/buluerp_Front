<script setup lang="ts">
import {
  newRecording,
  listRecording,
  changeRecording,
  deleteRecording,
  exportSelectTable,
  importFile,
  downLoadModule,
} from '@/apis/produceControl/inventory/AllInventory'

import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref, nextTick } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { ElMessage } from 'element-plus'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
const type = ref('packaging-material')
const refreshList = () => {
  listRecording(page.value, pageSize.value, type.value).then((res) => {
    console.log(res)
    listData.value = res.rows
    total.value = res.total
  })
}

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
const mapList = { 'packaging-material': '料包', part: '胶件', product: '成品' }

//渲染页面
const createFormRef = ref(null)
const formData = ref({
  'packaging-material': [
    [
      { type: 'input', label: '操作人', key: 'operator' },
      { type: 'input', label: '进出数量', key: 'inOutQuantity' },
      { type: 'input', label: '仓库位置', key: 'storageLocation' },
    ],
    [
      { type: 'timer', label: '创建时间', key: 'creationTime', timerType: 'daterange' },
      { type: 'timer', label: '修改时间', key: 'changeDate', timerType: 'daterange' },
    ],
    [
      { type: 'input', label: '料包编号', key: 'packagingNumber' },
      { type: 'input', label: '订单编号', key: 'orderCode' },
      { type: 'input', label: '产品货号', key: 'productPartNumber' },
    ],
  ],
  part: [
    [
      { type: 'input', label: '操作人', key: 'operator' },
      { type: 'input', label: '进出数量', key: 'inOutQuantity' },
      { type: 'input', label: '颜色编号', key: 'colorCode' },
    ],
    [
      { type: 'timer', label: '创建时间', key: 'creationTime', timerType: 'daterange' },
      { type: 'timer', label: '修改时间', key: 'changeDate', timerType: 'daterange' },
    ],
    [
      { type: 'input', label: '订单编号', key: 'orderCode' },
      { type: 'input', label: '模具编号', key: 'mouldNumber' },
    ],
  ],
  product: [
    [
      { type: 'input', label: '操作人', key: 'operator' },
      { type: 'input', label: '进出数量', key: 'inOutQuantity' },
      { type: 'input', label: '仓库位置', key: 'storageLocation' },
    ],
    [
      { type: 'timer', label: '创建时间', key: 'creationTime', timerType: 'daterange' },
      { type: 'timer', label: '修改时间', key: 'changeDate', timerType: 'daterange' },
    ],
    [
      { type: 'input', label: '订单编号', key: 'orderCode' },
      { type: 'input', label: '产品货号', key: 'productPartNumber' },
    ],
  ],
})
const newFormData = ref({
  'packaging-material': [
    [
      {
        type: 'input',
        label: '进出数量',
        key: 'inOutQuantity',
        width: 8,
        rules: [requiredRule],
      },
      {
        type: 'input',
        label: '料包编号',
        key: 'packagingNumber',
        width: 8,
        rules: [requiredRule],
      },{
        type: 'input',
        label: '产品货号',
        key: 'productPartNumber',
        width: 8,
        rules: [requiredRule]
      }
    ],
    [
      {
        type: 'timer',
        label: '日期',
        key: 'changeDate',
        width: 12,
        timerType: 'date',
        rules: [requiredRule],
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
        type: 'inputSelect',
        label: '产品ID',
        key: 'productId',
        width: 12,
        rules: [requiredRule],
        remoteFunc: searchFunc('system/products/list', 'id'),
        options: [],
        loading: false,
      },
      {
        type: 'input',
        label: '仓库位置',
        key: 'storageLocation',
        width: 12,
        rules: [requiredRule],
      },
    ],
    [{ type: 'textarea', label: '客户备注', key: 'remarks', width: 24 }],
  ],
  part: [
    [
      {
        type: 'input',
        label: '进出数量',
        key: 'inOutQuantity',
        width: 12,
        rules: [requiredRule],
      },
      {
        type: 'timer',
        label: '日期',
        key: 'changeDate',
        width: 12,
        timerType: 'date',
        rules: [requiredRule],
      },
    ],
    [
      { type: 'input', label: '颜色编号', key: 'colorCode', width: 8, rules: [requiredRule] },
      {
        type: 'inputSelect',
        label: '订单Id',
        key: 'orderCode',
        width: 8,
        rules: [requiredRule],
        remoteFunc: searchFunc('system/orders/list', 'innerId'),
        options: [],
        loading: false,
      },
      { type: 'input', label: '模具编号', key: 'mouldNumber', width: 8, rules: [requiredRule] },
    ],
    [{ type: 'textarea', label: '客户备注', key: 'remarks', width: 24 }],
  ],
  product: [
    [
      {
        type: 'input',
        label: '进出数量',
        key: 'inOutQuantity',
        width: 12,
        rules: [requiredRule],
      },
      {
        type: 'timer',
        label: '日期',
        key: 'changeDate',
        width: 12,
        timerType: 'date',
        rules: [requiredRule],
      },
    ],
    [
      {
        type: 'inputSelect',
        label: '料包编号',
        key: 'productPartNumber',
        width: 8,
        rules: [requiredRule],
        remoteFunc: searchFunc('system/inventory/packaging-material/list', 'id'),
        options: [],
        loading: false,
      },
      {
        type: 'inputSelect',
        label: '订单Id',
        key: 'orderCode',
        width: 8,
        rules: [requiredRule],
        remoteFunc: searchFunc('system/orders/list', 'innerId'),
        options: [],
        loading: false,
      },
      { type: 'input', label: '仓库位置', key: 'storageLocation', width: 8, rules: [requiredRule] },
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
    changeDate: '',
    operator: '',
    inOutQuantity: '',
    orderCode: '',
    productPartNumber: '',
    packagingNumber: '',
    storageLocation: '',
    remarks: '',
  },
  part: {
    creationTime: '',
    changeDate: '',
    operator: '',
    inOutQuantity: '',
    orderCode: '',
    colorCode: '',
    mouldNumber: '',
    remarks: '',
  },
  product: {
    creationTime: '',
    changeDate: '',
    operator: '',
    inOutQuantity: '',
    orderCode: '',
    productPartNumber: '',
    storageLocation: '',
    remarks: '',
  },
})
const tableData = ref({
  'packaging-material': [
    {
      value: 'id',
      label: 'ID',
      type: 'text',
    },
    {
      value: 'inOutQuantity',
      label: '进出数量',
      type: 'text',
    },
    { value: 'creationTime', label: '创建时间', type: 'text' },
    {
      value: 'changeDate',
      label: '修改时间',
      type: 'text',
    },
    {
      value: 'operator',
      label: '操作人',
      type: 'text',
    },
    {
      value: 'orderCode',
      label: '订单编号',
      type: 'text',
    },
    {
      value: 'productPartNumber',
      label: '产品货号',
      type: 'text',
    },
    {
      value: 'packagingNumber',
      label: '料包编号',
      type: 'text',
    },
    {
      value: 'storageLocation',
      label: '仓库位置',
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
    },{
      value: 'inOutQuantity',
      label: '进出数量',
      type: 'text',
    },{
      value: 'totalQuantity',
      label: '总数',
      type: 'text'
    },
    { value: 'creationTime', label: '创建时间', type: 'text' },
    {
      value: 'operator',
      label: '操作人',
      type: 'text',
    },{
      value: 'changeDate',
      label: '修改时间',
      type: 'text',
    },
    {
      value: 'colorCode',
      label: '颜色编号',
      type: 'text',
    },
    {
      value: 'mouldNumber',
      label: '模具编号',
      type: 'text',
    },{
      value: 'remarks',
      label: '备注',
      type: 'text',
    },
  ],
  product: [
    {
      value: 'id',
      label: 'ID',
      type: 'text',
    },
    {
      value: 'inOutQuantity',
      label: '进出数量',
      type: 'text',
    },
    { value: 'creationTime', label: '创建时间', type: 'text' },
    {
      value: 'changeDate',
      label: '修改时间',
      type: 'text',
    },
    {
      value: 'operator',
      label: '操作人',
      type: 'text',
    },
    {
      value: 'orderCode',
      label: '订单编号',
      type: 'text',
    },
    {
      value: 'productPartNumber',
      label: '产品货号',
      type: 'text',
    },
    {
      value: 'storageLocation',
      label: '仓库位置',
      type: 'text',
    },
    {
      value: 'remarks',
      label: '备注',
      type: 'text',
    },
  ],
})
const operation = ref([
  {
    func: (row) => {
      const id = row.id
      title.value = '编辑'
      editDialogVisible.value = true
      nextTick(() => {
        createFormRef.value.clearValidate()
      })
      newSubmit.value[type.value] = { ...row }
    },
    value: '编辑',
  },
])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const handleSubmit = () => {
  createFormRef.value.validateForm((valid) => {
    if (valid) {
      if (title.value == '编辑') {
        changeRecording(newSubmit.value[type.value], type.value).then((res) => {
          console.log(res)

          page.value = 1
          listRecording(page.value, pageSize.value, type.value).then((res) => {
            listData.value = res.rows
            total.value = res.total
          })
          ElMessage.success(res.msg)
          editDialogVisible.value = false
        })
      } else {
        newRecording(newSubmit.value[type.value], type.value).then((res) => {
          page.value = 1
          listRecording(page.value, pageSize.value, type.value).then((res) => {
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
  }
}
const onCreate = () => {
  resetSubmit()
  title.value = '新增'
  newDialogVisible.value = true
  newList.value = []
  activeIndex.value = 0
  newDialogVisible.value = true
  newList.value.push({ form: {}, finished: false })

  nextTick(() => {
    createFormRef.value?.clearValidate()
  })
  createFormRef.value.clearValidate()
}

const newDialogVisible = ref(false)

const newList = ref<Array<{
  form: Record<string, any>,
  finished: boolean,
}>>([])
const createNewFormRefs = ref<any[]>([])

const activeIndex = ref<number | null>(null) // 当前正在编辑哪条

const addNewItem = () => {
  // 若当前有正在编辑的表单，先校验并保存为 finished
  if (activeIndex.value !== null) {
    const currentFormRef = createNewFormRefs.value[activeIndex.value]
    if (!currentFormRef || typeof currentFormRef.validateForm !== 'function') return

    currentFormRef.validateForm((valid) => {

      if (!valid) return
      newList.value[activeIndex.value].finished = true
      activeIndex.value = newList.value.length
      newList.value.push({ form: {}, finished: false })
    })
  } else {
    activeIndex.value = newList.value.length
    newList.value.push({ form: {}, finished: false })
  }
}

const editItem = (index: number) => {
  if (activeIndex.value !== null) {
    const currentFormRef = createNewFormRefs.value[activeIndex.value]
    if (!currentFormRef || typeof currentFormRef.validateForm !== 'function') return

    currentFormRef.validateForm((valid) => {

      if (!valid) return
      newList.value[activeIndex.value].finished = true
      activeIndex.value = index
      nextTick(() => {
        createNewFormRef.value.clearValidate()
      })
    })
  } else {
    activeIndex.value = index
  }
}

const removeItem = (index: number) => {
  newList.value.splice(index, 1)
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else if (activeIndex.value !== null && index < activeIndex.value) {
    activeIndex.value -= 1
  }
}
const submitAll = () => {
  if (activeIndex.value !== null) {
    const currentFormRef = createNewFormRefs.value[activeIndex.value]
    if (!currentFormRef || typeof currentFormRef.validateForm !== 'function') return

    currentFormRef.validateForm((valid) => {

      if (!valid) return
      newList.value[activeIndex.value].finished = true
      activeIndex.value = null
      callSubmit()
    })
  } else {
    callSubmit()
  }
}

const callSubmit = () => {
  const list = newList.value.filter(i => i.finished)
  if (!list.length) {
    ElMessage.warning('请先添加并完成至少一条记录')
    return
  }

  Promise.all(list.map(item => newRecording(item.form,type.value))).then((res) => {
    page.value = 1
    listRecording(page.value, pageSize.value, type.value).then((res) => {
      listData.value = res.rows
      total.value = res.total
    })
    ElMessage.success(res.msg)
    newDialogVisible.value = false
  })
}

const completeForm = () => {
  if (activeIndex.value !== null) {
    const currentFormRef = createNewFormRefs.value[activeIndex.value]
    if (!currentFormRef || typeof currentFormRef.validateForm !== 'function') return

    currentFormRef.validateForm((valid) => {

      if (!valid) return
      newList.value[activeIndex.value].finished = true
      activeIndex.value = null
    })
  }
}

const cancelForm = (index) => {
  activeIndex.value = null
  removeItem(index)
}


const onSubmit = () => {
  page.value = 1
  searchContent.value[type.value].changeDateFrom = parseTime(
    searchContent.value[type.value].changeDate[0],
    '{y}-{m}-{d}',
  )
  searchContent.value[type.value].changeDateTo = parseTime(
    searchContent.value[type.value].changeDate[1],
    '{y}-{m}-{d}',
  )
  searchContent.value[type.value].createTimeFrom = parseTime(
    searchContent.value[type.value].creationTime[0],
    '{y}-{m}-{d}',
  )
  searchContent.value[type.value].createTimeTo = parseTime(
    searchContent.value[type.value].creationTime[1],
    '{y}-{m}-{d}',
  )
  console.log(searchContent.value[type.value])
  listRecording(page.value, pageSize.value, type.value, searchContent.value[type.value]).then(
    (res) => {
      console.log(res)
      listData.value = res.rows
      total.value = res.total
    },
  )
}

const onImport = () => {
  importDialogVisible.value = true
}
const onDownloadTemplate = () => {
  downLoadModule(type.value).then((res) => {
    downloadBinaryFile(res, mapList[type.value] + '计划模板.xlsx')
  })
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData, type.value).then((res) => {
    ElMessage.success(res.msg)
    listRecording(page.value, pageSize.value, type.value).then((res) => {
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
  exportSelectTable(formData, type.value).then((res) => {
    const now = new Date()
    downloadBinaryFile(
      res,
      mapList[type.value] + '信息_' + now.toLocaleDateString() + '_' + count + '.xlsx',
    )
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
    return deleteRecording(ids, type.value).then((res) => {
      listRecording(page.value, pageSize.value, type.value).then((res) => {
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
listRecording(page.value, pageSize.value, type.value).then((res) => {
  console.log(res)
  listData.value = res.rows
  total.value = res.total
})
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
        :searchForm="searchContent[type]"

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
    <el-dialog v-model="newDialogVisible" title="批量新增" width="800px">
      <div v-for="(item, index) in newList" :key="index">
        <div v-if="activeIndex === index">
          <CreateForm
            :data="newFormData[type]"
            :Formvalue="item.form"
            :ref="el => createNewFormRefs[index] = el"
          />
          <div style="margin-top: 10px; text-align: right">
            <el-button type="primary" size="small" @click="completeForm">完成当前记录</el-button>
            <el-button type="default" @click="cancelForm(index)">取消</el-button>
          </div>
        </div>
        <div v-else class="card-style">
          订单ID：{{ item.form.orderCode }} |
          进出数量：{{ item.form.inOutQuantity }} |
          日期：{{ item.form.changeDate }}
          <el-button type="text" @click="editItem(index)">编辑</el-button>
          <el-button type="text" @click="removeItem(index)">删除</el-button>
        </div>
      </div>

      <el-button type="primary" @click="addNewItem">添加一条</el-button>

      <template #footer>
        <el-button type="primary" @click="submitAll">完成</el-button>
        <el-button @click="newDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="editDialogVisible" :title="title" width="800px">
      <CreateForm :data="newFormData[type]" :Formvalue="newSubmit[type]" ref="createFormRef" />
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
