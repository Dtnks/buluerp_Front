<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listPurchasePlan,
  changePurchasePlan,
  newPurchasePlan,
  exportSelectTable,
  deletePurchasePlan,
  importFile,
  downLoadModule,
  newPlanFromDesign,
} from '@/apis/produceControl/purchase/purchasePlan'
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
    { type: 'input', label: '操作人', key: 'operator' },
    { type: 'timer', label: '创建曰期', timerType: 'date', key: 'creationTime' },
    { type: 'input', label: '颜色编号', key: 'colorCode', width: 8 },
  ],
  [
    { type: 'timer', label: '预交时间', key: 'deliveryDate', timerType: 'date' },
    { type: 'input', label: '供应商', key: 'supplier' },
    { type: 'input', label: '料别', key: 'materialType' },
  ],
])

const newFormData = ref([
  [
    {
      type: 'input',
      label: '采购重量',
      key: 'purchaseWeight',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'number',
      label: '采购数量',
      key: 'purchaseQuantity',
      width: 8,
      rules: [positiveNumberRule],
    },
    { type: 'input', label: '单重', key: 'singleWeight', width: 8, rules: [positiveNumberRule] },
  ],
  [
    { type: 'input', label: '颜色编号', key: 'colorCode', width: 12, rules: [requiredRule] },
    { type: 'input', label: '料别', key: 'materialType', width: 12, rules: [requiredRule] },
  ],
  [
    {
      type: 'timer',
      label: '预交时间',
      key: 'deliveryDate',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },
    {
      type: 'timer',
      label: '交货时间',
      key: 'deliveryTime',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'timer',
      label: '下单时间',
      key: 'orderTime',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },
    { type: 'input', label: '供应商', key: 'supplier', width: 12, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '模具编号', key: 'mouldNumber', width: 12, rules: [requiredRule] },
    { type: 'input', label: '规格', key: 'specification', width: 12, rules: [requiredRule] },
  ],
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
      remoteFunc: searchFunc('system/products/list', 'id'),
      options: [],
      loading: false,
    },
  ],
  [
    { type: 'textarea', label: '客户备注', key: 'remarks', width: 24, rules: [] }, // 备注字段不做必填校验
  ],
  [{ type: 'image', label: '样例图', key: 'picture', width: 12 }],
])
const designFormData = ref([
  [
    { type: 'input', label: '颜色编号', key: 'colorCode', width: 12, rules: [requiredRule] },
    {
      type: 'timer',
      label: '交货时间',
      key: 'deliveryTime',
      timerType: 'date',
      width: 12,
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'inputSelect',
      label: '设计总表ID',
      key: 'designPatternId',
      width: 12,
      rules: [requiredRule],
      remoteFunc: searchFunc('system/patterns/list', 'id'),
      options: [],
      loading: false,
    },
    {
      type: 'inputSelect',
      label: '外购资料ID',
      key: 'purchaseInfoId',
      width: 12,
      rules: [requiredRule],
      remoteFunc: searchFunc('system/purchase-info/list', 'id'),
      options: [],
      loading: false,
    },
  ],
  [
    {
      type: 'number',
      label: '采购数量',
      key: 'purchaseQuantity',
      width: 12,
      rules: [positiveNumberRule],
    },
    {
      type: 'textarea',
      label: '备注',
      key: 'remarks',
      width: 12,
    },
  ],
])
const newSubmit = ref({
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
})
const searchContent = ref({
  creationTime: '',
  deliveryDate: '',
  operator: '',
  colorCode: '',
  supplier: '',
  materialType: '',
})
const designSubmit = ref({
  colorCode: '',
  deliveryTime: '',
  designPatternId: '',
  purchaseInfoId: '',
  purchaseQuantity: '',
  remarks: '',
})

const resetDesignSubmit = () => {
  designSubmit.value = {
    colorCode: '',
    deliveryTime: '',
    designPatternId: '',
    purchaseInfoId: '',
    purchaseQuantity: '',
    remarks: '',
  }
}
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
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
  //     props.addTab('采购计划-' + row.id, PlanDetail, row, null)
  //   },
  //   value: '查看',
  //   disabled: false,
  // },
])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const createFormRef = ref(null)
const designDialogVisible = ref(false)
const designFormRef = ref(null)

const handleSubmit = () => {
  createFormRef.value.validateForm((valid) => {
    if (valid) {
      if (title.value === '编辑') {
        changePurchasePlan(newSubmit.value).then((res) => {
          page.value = 1
          listPurchasePlan(page.value, pageSize.value).then((res) => {
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
        newPurchasePlan(newSubmit.value).then((res) => {
          page.value = 1
          listPurchasePlan(page.value, pageSize.value).then((res) => {
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
//从设计总表新建
const handleDesignSubmit = () => {
  designFormRef.value.validateForm((valid) => {
    if (!valid) return
    const payload = {
      ...designSubmit.value,
      deliveryTime: parseTime(designSubmit.value.deliveryTime, '{y}-{m}-{d}'),
    }
    console.log(payload)
    newPlanFromDesign(payload).then((res) => {
      if (res.code === 200) {
        ElMessage.success(res.msg)
        designDialogVisible.value = false
        page.value = 1
        listPurchasePlan(page.value, pageSize.value).then((res) => {
          listData.value = res.rows
          total.value = res.total
        })
      } else {
        ElMessage.error(res.msg)
      }
    })
  })
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
  createTypeDialogVisible.value = true
}
const createTypeDialogVisible = ref(false)

const handleCreateType = (type: 'direct' | 'design') => {
  createTypeDialogVisible.value = false
  if (type === 'direct') {
    resetSubmit()
    title.value = '新增'
    editDialogVisible.value = true
    nextTick(() => {
      createFormRef.value?.clearValidate()
    })
  } else if (type === 'design') {
    resetDesignSubmit()
    designDialogVisible.value = true
  }
}

const onSubmit = () => {
  searchContent.value.creationTime = parseTime(searchContent.value.creationTime, '{y}-{m}-{d}')
  searchContent.value.deliveryDate = parseTime(searchContent.value.deliveryDate, '{y}-{m}-{d}')
  page.value = 1
  listPurchasePlan(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
const onDownloadTemplate = () => {
  downLoadModule().then((res) => {
    downloadBinaryFile(res, '采购计划模板.xlsx')
  })
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData).then((res) => {
    ElMessage.success(res.msg)
    listPurchasePlan(page.value, pageSize.value).then((res) => {
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
    downloadBinaryFile(res, '采购计划_' + now.toLocaleDateString() + '_' + count + '.xlsx')
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
    return deletePurchasePlan(ids).then((res) => {
      listPurchasePlan(page.value, pageSize.value).then((res) => {
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
  listPurchasePlan(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listPurchasePlan(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listPurchasePlan(page.value, pageSize.value).then((res) => {
  total.value = res.total
  listData.value = res.rows
})
</script>
<template>
  <div class="col">
    <BordShow content="采购计划" path="生产管理/采购/采购计划" />
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

    <el-dialog v-model="editDialogVisible" :title="title" width="800px">
      <CreateForm :data="newFormData" :Formvalue="newSubmit" ref="createFormRef" />
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
        <el-dialog v-model="createTypeDialogVisible" title="请选择新建方式" width="400px">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <el-button type="primary" @click="handleCreateType('direct')">直接新建</el-button>
        <el-button type="success" @click="handleCreateType('design')">从外购资料/设计总表新建</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="designDialogVisible" title="从设计/外购新增采购计划" width="800px">
      <CreateForm :data="designFormData" :Formvalue="designSubmit" ref="designFormRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDesignSubmit"> 确认 </el-button>
          <el-button @click="designDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
