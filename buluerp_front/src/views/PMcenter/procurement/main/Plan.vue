<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listPurchasePlan,
  detailPurchasePlan,
  changePurchasePlan,
  newPurchasePlan,
  exportSelectTable,
  deletePurchasePlan,
  importFile,
} from '@/apis/produceControl/purchase/purchasePlan'
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
    { type: 'input', label: '操作人', key: 'operator' },
    { type: 'timer', label: '创建曰期', timerType: 'date', key: 'creatTime' },
  ],
  [
    { type: 'input', label: '备注', key: 'remarks' },
    { type: 'input', label: '邮箱', key: 'email' },
    { type: 'input', label: '客户备注', key: 'remarks' },
  ],
])
const searchContent = ref({
  operator: '',
  contact: '',
  remarks: '',
  email: '',
  creatTime: '',
})
const tableData = ref([
  {
    value: 'id',
    label: '采购单号',
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
    value: 'operator',
    label: '操作人',
    type: 'text',
  },
  { value: 'creationTime', label: '创建时间', type: 'text' },
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
      newSubmit.value = {}
      detailPurchasePlan(id).then((res) => {
        newSubmit.value = res.data
      })
    },
    value: '编辑',
    disabled: props.control[1].disabled,
  },
])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const newSubmit = ref({
  name: '',
  contact: '',
  email: '',
  remarks: '',
  creatTime: '',
})
const handleSubmit = () => {
  if (title.value == '编辑') {
    changePurchasePlan(newSubmit.value).then((res) => {
      page.value = 1
      listPurchasePlan(page.value, pageSize.value).then((res) => {
        listData.value = res.rows
        total.value = res.total
      })
      editDialogVisible.value = false
    })
  } else {
    newPurchasePlan(newSubmit.value).then((res) => {
      if (res.msg == '操作成功') {
        ElMessage.success('新增成功')
        page.value = 1
        listPurchasePlan(page.value, pageSize.value).then((res) => {
          listData.value = res.rows
          total.value = res.total
        })
        editDialogVisible.value = false
      }
    })
  }
}
const title = ref('编辑')
//传给form组件的参数
const onCreate = () => {
  newSubmit.value = {}
  title.value = '新增'
  editDialogVisible.value = true
}

const onSubmit = () => {
  searchContent.value.creatTime = parseTime(searchContent.value.creatTime, '{y}-{m}-{d}')

  page.value = 1
  listPurchasePlan(page.value, pageSize.value, searchContent.value).then((res) => {
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
    console.log(res)
    if (res.code == 200) {
      ElMessage.success(res.msg)
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
    downloadBinaryFile(res, '客户信息_' + now.toLocaleDateString() + '_' + count + '.xlsx')
    count += 1
  })
}

const DeleteFunc = (row) => {
  const ids = row.map((ele) => {
    return ele.id
  })
  const func = () => {
    return deletePurchasePlan(ids).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        listPurchasePlan(page.value, pageSize.value).then((res) => {
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
  console.log(res, 'plan')
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

    <el-dialog v-model="editDialogVisible" :title="title" width="400px"
      ><div class="col cardCenter">
        <!-- <div class="input row">
          <span>姓名 </span><el-input v-model="newSubmit.email" style="width: 240px" />
        </div> -->
      </div>
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
