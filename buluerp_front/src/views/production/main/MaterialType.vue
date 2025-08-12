<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import CreateForm from '@/components/form/CreateForm.vue'
import BordShow from '@/components/board/SecBoard.vue'
import {
  listMaterialInfo,
  changeMaterialInfo,
  newMaterialInfo,
  exportSelectTable,
  deleteMaterialInfo,
  importFile,
  downLoadModule,
} from '@/apis/materialType'
import { downloadBinaryFile } from '@/utils/file/base64'
import TableList from '@/components/table/TableList.vue'
import { ref, nextTick } from 'vue'
import { beforeUpload } from '@/utils/file/importExcel'
import { messageBox } from '@/components/message/messageBox'

import { requiredRule } from '@/utils/form/valid'
//渲染页面
const formData = ref([
  [
    { type: 'input', label: '颜色编号', key: 'colorCode' },
    { type: 'input', label: '色粉重量', key: 'colorWeight' },
    { type: 'input', label: '名称', key: 'name' },
  ],
])

const newFormData = ref([
  [
    {
      type: 'input',
      label: '颜色编号',
      key: 'colorCode',
      width: 8,
      rules: [requiredRule],
    },
    {
      type: 'input',
      label: '色粉重量',
      key: 'colorWeight',
      width: 8,
      rules: [requiredRule],
    },
    { type: 'input', label: '名称', key: 'name', width: 8, rules: [requiredRule] }
  ]])

const editFormData = ref([
  [
    {
      type: 'input',
      label: '颜色编号',
      key: 'colorCode',
      width: 12,
      rules: [requiredRule],
    },
    {
      type: 'input',
      label: '色粉重量',
      key: 'colorWeight',
      width: 12,
      rules: [requiredRule],
    }
  ]])
const newSubmit = ref({

})
const editFormRef=ref()
const editSubmit = ref({

})
const searchContent = ref({
    colorCode: '',
    colorWeight: '',
    name: '',
})
const tableData = ref([
  {
    value: 'id',
    label: 'ID',
    type: 'text',
  },
  {
    value: 'colorCode',
    label: '颜色编号',
    type: 'text',
  },
  {
    value: 'colorWeight',
    label: '色粉重量',
    type: 'text',
  },
  {
    value: 'name',
    label: '名称',
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
      editSubmit.value = { ...row }
      nextTick(() => {
        editFormRef.value.clearValidate()
      })
    },
    value: '编辑',
  },

])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const newDialogVisible = ref(false)
const createFormRef = ref(null)

const handleSubmit = () => {
  
      if (title.value === '编辑') {
        editFormRef.value.validateForm((valid) => { 
          if (valid) {
            changeMaterialInfo(editSubmit.value).then((res) => {
            page.value = 1
            listMaterialInfo(page.value, pageSize.value).then((res) => {
              listData.value = res.rows
              total.value = res.total
          })
          ElMessage.success(res.msg)
          editDialogVisible.value = false
          })}
        })
      }
       else {
        createFormRef.value.validateForm((valid) => {
          if (valid) {
            newMaterialInfo(newSubmit.value).then((res) => {
              page.value = 1
              listMaterialInfo(page.value, pageSize.value).then((res) => {
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

const title = ref('编辑')
//传给form组件的参数
const resetNewSubmit = () => {
  newSubmit.value = {

  }
}
const onCreate = () => {
  resetNewSubmit()
  title.value = '新增'
  newDialogVisible.value = true

  createFormRef.value.clearValidate()
}

const onSubmit = () => {
  page.value = 1
  listMaterialInfo(page.value, pageSize.value, searchContent.value).then((res) => {
    listData.value = res.rows
    total.value = res.total
  })
}

const onImport = () => {
  importDialogVisible.value = true
}
const onDownloadTemplate = () => {
  downLoadModule().then((res) => {
    downloadBinaryFile(res, '料型模板.xlsx')
  })
}
const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  importFile(formData).then((res) => {
    ElMessage.success(res.msg)
    listMaterialInfo(page.value, pageSize.value).then((res) => {
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
    downloadBinaryFile(res, '料型_' + now.toLocaleDateString() + '_' + count + '.xlsx')
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
    return deleteMaterialInfo(ids).then((res) => {
      listMaterialInfo(page.value, pageSize.value).then((res) => {
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
  listMaterialInfo(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listMaterialInfo(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listMaterialInfo(page.value, pageSize.value).then((res) => {
  console.log(res)
  total.value = res.total
  listData.value = res.rows
})
</script>
<template>
  <div class="col">
    <BordShow content="料型表" path="物料管理/料型" />
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
      ><CreateForm :data="newFormData" :Formvalue="newSubmit" ref="createFormRef" />
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
      ><CreateForm :data="editFormData" :Formvalue="editSubmit" ref="editFormRef" />
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
