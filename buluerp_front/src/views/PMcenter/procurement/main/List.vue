<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listPurchaseList,
  changePurchaseList,
  newPurchaseList,
  exportSelectTable,
  deletePurchaseList,
  importFile,
  // downLoadModule,
} from '@/apis/produceControl/purchase/purchaseList'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref } from 'vue'
import { parseTime } from '@/utils/ruoyi'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox } from 'element-plus'
const props = defineProps(['control'])
//渲染页面
const formData = ref([
  [
    
    { type: 'input', label: 'ID', key: 'id' },
    { type: 'timer', label: '创建曰期', timerType: 'daterange', key: 'createTime' },
  ],
  [
    { type: 'input', label: '创建人', key: 'createUser' },
    { type: 'input', label: '订单金额', key: 'amount' },
    { type: 'input', label: '采购计划单号', key: 'purchaseId' },
  ],
])
const newFormData = ref([
  [
    { type: 'input', label: '采购计划', key: 'purchaseId', width: 12 },
    { type: 'input', label: '订单金额', key: 'amount', width: 12 },
  ],
  [
        { type: 'fileList', label: '发票文件', key: 'invoice', width: 22 },
  ],
])
const newSubmit = ref({
  purchaseId: '',
  amount: '',
  invoice: [],
})
const searchContent = ref({
  id: '',
  createTime: '',
  createUser: '',
  amount: '',
  purchaseId: '',
})
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
  {
    value: 'purchaseId',
    label: '采购计划',
    type: 'text',
  },
  {
    value: 'createUser',
    label: '创建人',
    type: 'text',
  },
  {
    value: 'amount',
    label: '订单金额',
    type: 'text',
  },
  {
    value: 'createTime',
    label: '创建时间',
    type: 'text',
  },
  {
    value: 'invoice',
    label: '发票文件',
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
    },
    value: '编辑',
    disabled: props.control[1].disabled,
  },
])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const handleSubmit = () => {
  if (title.value == '编辑') {
    console.log(newSubmit.value)
    changePurchaseList(newSubmit.value).then((res) => {
      console.log(res)
      if (res.code == 200) {
        page.value = 1
        listPurchaseList(page.value, pageSize.value).then((res) => {
          listData.value = res.rows
          total.value = res.total
        })
        editDialogVisible.value = false
      } else {
        ElMessage.error(res.msg)
        return
      }
    })
  } else {
    newSubmit.value.createTime = parseTime(newSubmit.value.createTime, '{y}-{m}-{d}')
    newPurchaseList(newSubmit.value).then((res) => {
      console.log(res)
      if (res.msg == '操作成功') {
        page.value = 1
        listPurchaseList(page.value, pageSize.value).then((res) => {
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
  purchaseId: '',
  amount: '',
  invoice: [],
}
}
const onCreate = () => {
  resetSubmit()
  title.value = '新增'
  editDialogVisible.value = true
}

const onSubmit = () => {
  searchContent.value.createTimeFrom = parseTime(searchContent.value.createTime[0], '{y}-{m}-{d}')
  searchContent.value.createTimeTo = parseTime(searchContent.value.createTime[1], '{y}-{m}-{d}')
  page.value = 1
  listPurchaseList(page.value, pageSize.value, searchContent.value).then((res) => {
    console.log(res)
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.msg)
      listPurchaseList(page.value, pageSize.value).then((res) => {
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
const count = 1
//传给table组件
// const exportFunc = (row) => {
//   if (row.length === 0) {
//     ElMessage.warning('请先选择要导出的产品')
//     return
//   }
//   const formData = new URLSearchParams()
//   const ids = row.map((ele) => {
//     return ele.id
//   })
//   // const idsString = Array.isArray(ids) ? ids.join(',') : ids
//   formData.append('ids', ids)
//   exportSelectTable(formData).then((res) => {
//     const now = new Date()
//     downloadBinaryFile(res, '客户信息_' + now.toLocaleDateString() + '_' + count + '.xlsx')
//     count += 1
//   })
// }

const DeleteFunc = (row) => {
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deletePurchaseList(ids).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        listPurchaseList(page.value, pageSize.value).then((res) => {
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
  listPurchaseList(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listPurchaseList(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listPurchaseList(page.value, pageSize.value).then((res) => {
  console.log(res)
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

    <el-dialog v-model="editDialogVisible" :title="title" width="800px"
      ><CreateForm :data="newFormData" :Formvalue="newSubmit" />
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
<style scoped>
.input .el-input {
  width: 240px;
}
.cardCenter .el-input {
  margin-bottom: 20px;
}
.input span {
  text-align: right;
  padding-right: 5px;
  width: 60px;
}
</style>
