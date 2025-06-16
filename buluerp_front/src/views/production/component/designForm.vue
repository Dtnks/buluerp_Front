<template>
  <el-card style="margin: 0 20px">
    <template #header>
      <div class="card-header">
        <span>设计总表查询</span>
      </div>
    </template>

    <el-row>
      <el-form :model="formState" label-width="120px" class="search-form" style="flex: 1;">
        <el-row :gutter="20" align="middle">
          <el-col :span="12">
            <el-form-item label="PMC确认状态">
              <el-select v-model="formState.confirm" placeholder="请选择确认状态">
                <el-option label="未确认" :value="0" />
                <el-option label="已确认" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建用户ID">
              <el-input v-model="formState.createUserId" placeholder="请输入用户ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" align="middle">
          <el-col :span="12">
            <el-form-item label="订单ID">
              <el-input v-model="formState.orderId" placeholder="请输入订单ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品编码">
              <el-input v-model="formState.productId" placeholder="请输入产品编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" align="middle">
          <el-col :span="12">
            <el-form-item label="订单状态">
              <el-button @click="handleViewPendingOrders">查看待设计订单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-col :span="4" style="text-align: right; padding: 20px">
        <el-space direction="vertical">
          <el-row>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleClear">重置</el-button>
          </el-row>
          <el-row>
            <el-button type="primary" @click="handleCreate">新建</el-button>
            <el-button @click="handleImport">导入</el-button>
          </el-row>
        </el-space>
        <div style="text-align: right; margin-top: 8px">
          <el-link type="primary" @click="handleDownloadTemplate">下载导入模板</el-link>
        </div>
      </el-col>
    </el-row>

    <!-- 导入弹窗 -->
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
        <template #tip>
          <div class="el-upload__tip">只能上传 xls/xlsx 文件，大小不超过 5MB</div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 新建弹窗 -->
    <DesignDialog
      v-model="dialogVisible"
      :isEdit="false"
      :currentData="currentOrderData"
      @submit="handleCreateSubmit"
    />


    <el-dialog v-model="orderDialogVisible" title="待设计订单" width="800px">
      <el-table :data="orderList" style="width: 100%">
        <el-table-column prop="innerId" label="订单编号" />
        <el-table-column prop="operator" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleCreateDesign(scope.row.id)">
              创建设计总表
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <el-button type="primary" @click="handleBatchCreate">全部创建</el-button>
        <el-button @click="fetchPendingOrders">刷新</el-button>
        <el-button @click="orderDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>


  </el-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { messageBox } from '@/components/message/messageBox'
import { ElMessageBox , ElLoading } from 'element-plus'
import { importDesignFile, getDesignTemplate, addDesign } from '@/apis/designs'
import { downloadBinaryFile } from '@/utils/file/base64'
import { getOrdersList , putOrder} from '@/apis/orders'
import DesignDialog from '@/views/production/component/designDialog.vue'

const emit = defineEmits(['search','created'])

const formState = reactive({
  confirm: '',
  createUserId: '',
  orderId: '',
  productId: '',
})

const importDialogVisible = ref(false)
const dialogVisible = ref(false)

const orderDialogVisible = ref(false)
const orderList = ref([])
const orderIdList = orderList.value.map(row => row.id)
const currentOrderData = ref<Record<string, any> | null>(null)

const handleSearch = () => {
  emit('search', { ...formState })
}

const handleClear = () => {
  formState.confirm = ''
  formState.createUserId = ''
  formState.orderId = ''
  formState.productId = ''
}

const handleCreate = () => {
  currentOrderData.value = null
  dialogVisible.value = true
}

const handleCreateSubmit = async (formData: any) => {
  try {
    const res = await addDesign(formData)
    if (res.code === 200) {
      messageBox('success', null, '新建成功', '', '')
      dialogVisible.value = false
      emit('search', { ...formState }) 
      if (formData.orderId) {
        await putOrder({ id: formData.orderId, status: 2 })
      }

      fetchPendingOrders() 
    } else {
      messageBox('error', null, '', res.msg || '新建失败', '')
    }
  } catch (error) {
    messageBox('error', null, '', '新建失败', '')
  }
}


const handleImport = () => {
  importDialogVisible.value = true
}

const beforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.ms-excel' ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

  if (!isExcel) {
    messageBox('error', null, '', '只能上传 Excel 文件', '')
    return false
  }

  return true
}

const handleUpload = async (option: any) => {
  const formData = new FormData()
  formData.append('file', option.file)

  try {
    const res = await importDesignFile(formData)

    if (res.code === 200) {
      messageBox('success', null, '导入成功', '', '')
      importDialogVisible.value = false
      emit('created')
    } else {
      const error_text = res.data
        .map((ele) => '第' + ele.rowNum + '行：' + ele.errorMsg)
        .join('<br>')

      ElMessageBox.alert(error_text, '数据格式出现问题', {
        confirmButtonText: '继续',
        type: 'error',
        dangerouslyUseHTMLString: true,
      })
    }
  } catch (e) {
    messageBox('error', null, '', '导入失败', '')
  }
}

const handleDownloadTemplate = async () => {
  try {
    const res = await getDesignTemplate()
    downloadBinaryFile(
      res,
      '设计总表模板.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  } catch (e) {
    messageBox('error', null, '', '下载失败', '')
  }
}

const fetchPendingOrders = async () => {
  try {
    const res = await getOrdersList({ status: 1 })
    if (res.code === 200) {
      orderList.value = res.rows || []
    } else {
      messageBox('error', null, '', '获取待设计订单失败', '')
    }
  } catch (e) {
    messageBox('error', null, '', '获取订单异常', '')
  }
}

const handleViewPendingOrders = () => {
  orderDialogVisible.value = true
  fetchPendingOrders()
}

const handleCreateDesign = (orderId: string) => {
  currentOrderData.value = { orderId }
  dialogVisible.value = true
}

const handleBatchCreate = async () => {
  if (orderList.value.length === 0) {
    messageBox('warning', null, '', '暂无可创建的订单', '')
    return
  }

  const loadingInstance = ElLoading.service({
    lock: true,
    text: '正在批量创建设计总表...',
    background: 'rgba(0, 0, 0, 0.3)',
  })

  let successCount = 0
  let failCount = 0

  try {
    for (const order of orderList.value) {
      try {
        const res = await await addDesign({ orderId: order.id })
        if (res.code === 200) {
          successCount++
        } else {
          failCount++
        }
      } catch (e) {
        failCount++
      }
    }

    messageBox(
      'success',
      null,
      `批量创建完成：成功 ${successCount} 个，失败 ${failCount} 个`,
      '',
      ''
    )
  } finally {
    loadingInstance.close()
    fetchPendingOrders()
    emit('search', { ...formState })
  }
}

</script>

<style scoped>
.search-form {
  background: #ffffff;
  padding: 20px;
  border-radius: 8px;
}
</style>
