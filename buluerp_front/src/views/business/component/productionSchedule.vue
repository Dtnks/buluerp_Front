<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listScheduleByOrderCode,
  changeSchedule,
  newSchedule,
  exportSelectTable,
  deleteSchedule,
  importFile,
  downLoadModule,
  finishSchedule,
  selectTransToArrange,
} from '@/apis/produceControl/produce/schedule'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref, nextTick } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { searchFunc } from '@/utils/search/search'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
const props = defineProps(['data'])
console.log(props.data)
//渲染页面
const listSchedule=listScheduleByOrderCode(props.data.orderCode)
const createNewFormRef = ref()
const createEditFormRef = ref({})
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
    {
      type: 'timer',
      label: '布产时间',
      key: 'productionTime',
      timerType: 'date',
      width: 8,
      rules: [requiredRule],
    }
  ],
  [
    {
      type: 'input',
      label: '布产重量',
      key: 'productionWeight',
      width: 8,
      rules: [positiveNumberRule,requiredRule],
    },
    {
      type: 'timer',
      label: '出货时间',
      key: 'shipmentTime',
      timerType: 'date',
      width: 8,
      rules: [requiredRule],
    },
    { type: 'input', label: '供应商', key: 'supplier', width: 8, rules: [requiredRule] },
  ],
  [
    {
      type: 'inputSelect',
      label: '模具厂家',
      key: 'mouldManufacturer',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/manufacturer/list', 'name'),
    },
    { type: 'input', label: '用量', key: 'usage', width: 12, rules: [positiveNumberRule,requiredRule] },
  ],
    [
    { type: 'input', label: '生产时间(h)', key: 'timeHours', width: 12, rules: [requiredRule] },
    
    { type: 'input', label: '生产周期(s)', key: 'cycleTime', width: 12, rules: [requiredRule] }
  ],
  [
    {
      type: 'inputSelect',
      label: '设计总表ID',
      key: 'designPatternId',
      width: 12,
      rules: [requiredRule],
      showKey:[{key:'id',label:"ID"},{key:'orderId',label:"订单ID"},{key:'productId',label:"产品ID"}],
      remoteFunc: searchFunc('system/patterns/list', 'id'),
      options: [],
      loading: false,
    },
    {
      type: 'inputSelect',
      label: '物料',
      key: 'materialId',
      width: 12,
      rules: [requiredRule],
      showKey:[{key:'id',label:"物料ID"},{key:'materialType',label:"料别"},{key:'mouldNumber',label:"模具编号"}],
      remoteFunc: searchFunc('system/material-info/list', 'id'),
      options: [],
      loading: false,
    }],
  
  ])
const newSubmit = ref({

})

const editFormData = ref([
  [
    { type: 'input', label: '生产周期(s)', key: 'cycleTime', width: 8, rules: [requiredRule] },
    {
      type: 'inputSelect',
      label: '物料',
      key: 'materialId',
      width: 12,
      rules: [requiredRule],
      showKey:[{key:'id',label:"物料ID"},{key:'materialType',label:"料别"},{key:'mouldNumber',label:"模具编号"}],
      remoteFunc: searchFunc('system/material-info/list', 'id'),
      options: [],
      loading: false,
    }
  ],
    [
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
    {
      type: 'timer',
      label: '布产时间',
      key: 'productionTime',
      timerType: 'date',
      width: 8,
      rules: [requiredRule],
    }],
  [
    {
      type: 'input',
      label: '布产重量',
      key: 'productionWeight',
      width: 8,
      rules: [positiveNumberRule,requiredRule],
    },
    {
      type: 'timer',
      label: '出货时间',
      key: 'shipmentTime',
      timerType: 'date',
      width: 8,
      rules: [requiredRule],
    },
    { type: 'input', label: '供应商', key: 'supplier', width: 8, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '生产时间(h)', key: 'timeHours', width: 8, rules: [requiredRule] },
    {
      type: 'inputSelect',
      label: '模具厂家',
      key: 'mouldManufacturer',
      width: 8,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/manufacturer/list', 'name'),
    },
    { type: 'input', label: '用量', key: 'usage', width: 8, rules: [positiveNumberRule,requiredRule] },
  ]
  
  ])
const editSubmit = ref({

})
const searchContent = ref({

})
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
  {
    value: 'arrangeId',
    label: '排产Id',
    type: 'text',
  },
  { value: 'pictureUrl', label: '图片', type: 'picture' },
  
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
    value: 'materialId',
    label: '物料ID',
    type: 'tags',
  },
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
    value: 'colorPowderNeeded',
    label: '色粉数量',
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
  { 
    value: 'mouldManufacturer', 
    label: '模具厂家', 
    type: 'tags' 
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
    value: 'customerId',
    label: '客户ID',
    type: 'tags',
  },
])
const operation = ref([
  {
    func: (row) => {
      title.value = '编辑'
      editDialogVisible.value = true

      nextTick(() => {
        createEditFormRef.value.clearValidate()
      })
      editSubmit.value = { ...row }
      editSubmit.value.orderCode = props.data.orderCode
    },
    value: '编辑',
  },
  {
    func: (row) => {
      finishSchedule({orderCode:row.orderCode}).then((res) => {
        console.log({orderCode:row.orderCode})
        ElMessage.success(res.msg)
      })
    },
    value: '完成布产',
  },
])
const title = ref('新增')
//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)

const newDialogVisible = ref(false)
const handleSubmit = () => {
  if (title.value == '编辑') {
  createEditFormRef.value.validateForm((valid) => {
    if (valid) {
      
        changeSchedule(editSubmit.value).then((res) => {
          page.value = 1
          listSchedule(page.value, pageSize.value).then((res) => {
            listData.value = res.rows
            total.value = res.total
          })
          ElMessage.success(res.msg)
          editDialogVisible.value = false
        })
      } })}else {
        createNewFormRef.value.validateForm((valid) => {
          if (valid) {
             newSchedule(newSubmit.value).then((res) => {
             page.value = 1
             listSchedule(page.value, pageSize.value).then((res) => {
                listData.value = res.rows
                total.value = res.total
              })
              ElMessage.success(res.msg)
              newDialogVisible.value = false
            })
          }
        })
      }
    }

//传给form组件的参数
const resetnewSubmit = () => {
  newSubmit.value = {
    orderCode:props.data.orderCode,
  }
}
const onCreate = () => {
  resetnewSubmit()
  title.value = '新增'
  newDialogVisible.value = true
  nextTick(() => {
        createNewFormRef.value.clearValidate()
      })
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
    ElMessage.success(res.msg)
    listSchedule(page.value, pageSize.value).then((res) => {
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
    downloadBinaryFile(res, '布产表_' + now.toLocaleDateString() + '_' + count + '.xlsx')
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
    return deleteSchedule(ids).then((res) => {
      listSchedule(page.value, pageSize.value).then((res) => {
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
const ids = ref([])
const transDialogVisible = ref(false)
const createTransFormRef = ref()
const transFormData = ref([
  [
    { type: 'input', label: '出模数', key: 'mouldOutput', width: 12, rules: [positiveNumberRule,requiredRule] },
    {
      type: 'timer',
      label: '安排时间',
      key: 'scheduledTime',
      width: 12,
      timerType: 'date',
      rules: [requiredRule],
    },
  ],
  [{ type: 'textarea', label: '备注', key: 'remarks', width: 24 }],
  [{ type: 'image', label: '样例图', key: 'pictureFile',rules: [requiredRule], width: 12 }],
])
const transSubmit = ref({

})
const handleSubmitTrans = () => {
  console.log(ids.value)
  transSubmit.value.scheduledTime = parseTime(transSubmit.value.scheduledTime, '{y}-{m}-{d}')
  createTransFormRef.value.validateForm((valid) => {
    if (valid) {
      selectTransToArrange({ ...transSubmit.value, scheduleIds: ids.value }).then((res) => {
        ElMessage.success(res.msg)
        transDialogVisible.value = false
        listSchedule(page.value, pageSize.value).then((res) => {
          listData.value = res.rows
          total.value = res.total
        })
      })
    }
  })
}
const transToArrange = (row) => {
  if (row.length === 0) {
    ElMessage.warning('请先选择要导入排产的记录')
    return
  }
  transSubmit.value = {

  }
  ids.value = row.map((item) => item.id)
  transDialogVisible.value = true
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
    <BordShow content="布产表" path="订单详情/布产表" />
    <div class="greyBack">
      <FormSearch
        title="查询"
        :data="formData"
        :onCreate="onCreate"
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
        :transToArrange="transToArrange"

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

    <el-dialog v-model="newDialogVisible" :title="title" width="800px"
      ><CreateForm :data="newFormData" :Formvalue="newSubmit" ref="createNewFormRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
          <el-button
            type="info"
            @click="
              () => {
                newDialogVisible = false
              }
            "
          >
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="editDialogVisible" :title="title" width="800px"
      ><CreateForm :data="editFormData" :Formvalue="editSubmit" ref="createEditFormRef" />
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
    <el-dialog v-model="transDialogVisible" title="导入排产" width="800px"
      ><CreateForm :data="transFormData" :Formvalue="transSubmit" ref="createTransFormRef" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmitTrans"> 确认 </el-button>
          <el-button
            type="info"
            @click="
              () => {
                transDialogVisible = false
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
