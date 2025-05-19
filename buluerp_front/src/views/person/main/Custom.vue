<script setup lang="ts">
import FormSearch from '@/components/form/Form.vue'
import { listCustomer, detailCustomer, changeCustomer, newCustomer } from '@/apis/custom.js'
import TableList from '@/components/table/TableList.vue'
import { ref } from 'vue'
//渲染页面
const formData = ref([
  [
    { type: 'input', value: null, label: '用户ID' },
    { type: 'input', value: null, label: '姓名' },
  ],
  [
    { type: 'input', value: null, label: '联系方式' },
    { type: 'input', value: null, label: '邮箱' },
    { type: 'input', value: null, label: '客户备注' },
  ],
])
const tableData = ref([
  {
    value: 'id',
    label: '用户ID',
  },
  {
    value: 'name',
    label: '姓名',
  },
  {
    value: 'contact',
    label: '联系方式',
  },
  {
    value: 'email',
    label: '邮箱',
  },
  {
    value: 'remarks',
    label: '备注',
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
    func: (id) => {
      title.value = '编辑'
      editDialogVisible.value = true
      newSubmit.value = {}
      detailCustomer(id).then((res) => {
        newSubmit.value = res.data
      })
    },
    value: '编辑',
  },
  { func: () => {}, value: '导出' },
])

//新增与修改
const importDialogVisible = ref(false)
const editDialogVisible = ref(false)
const newSubmit = ref({})
const handleSubmit = () => {
  if (title.value == '编辑') {
    changeCustomer(newSubmit.value).then((res) => {
      page.value = 1
      listCustomer(page.value, pageSize.value).then((res) => {
        listData.value = res.rows
      })
      editDialogVisible.value = false
    })
  } else {
    newCustomer(newSubmit.value).then((res) => {
      page.value = 1
      listCustomer(page.value, pageSize.value).then((res) => {
        listData.value = res.rows
      })
      editDialogVisible.value = false
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
const onClear = () => {
  formData.value.forEach((element) => {
    element.forEach((ele) => {
      ele.value = null
    })
  })
}

//分页
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const listData = ref([])
const handlePageChange = async (val: number) => {
  page.value = val
  listCustomer(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  listCustomer(page.value, pageSize.value).then((res) => {
    listData.value = res.rows
  })
}

//初次渲染
listCustomer(page.value, pageSize.value).then((res) => {
  total.value = res.total
  listData.value = res.rows
  console.log(res)
})
</script>
<template>
  <div>
    <FormSearch title="查询" :data="formData" :onCreate="onCreate" :onClear="onClear" />
    <TableList :tableData="tableData" :operations="operation" :listData="listData">
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

    <el-dialog v-model="editDialogVisible" :title="title" width="400px"
      ><div class="col cardCenter">
        <div class="input row">
          <span>姓名 </span><el-input v-model="newSubmit.name" style="width: 240px" />
        </div>
        <div class="input row">
          <span>联系方式 </span><el-input v-model="newSubmit.contact" style="width: 240px" />
        </div>
        <div class="input row">
          <span>邮箱 </span><el-input v-model="newSubmit.email" style="width: 240px" />
        </div>
        <div class="input row">
          <span>备注 </span><el-input v-model="newSubmit.remarks" style="width: 240px" />
        </div>
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
