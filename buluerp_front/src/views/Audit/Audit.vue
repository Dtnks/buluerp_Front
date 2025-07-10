<template>
  <div class="col">
    <BordShow content="审核" path="用户中心/审核" />
    <div class="greyBack">
      <el-card style="margin: 0 20px">
        <template #header>
          <div class="card-header">
            <span style="font-weight: bold">审核列表</span>
            <el-select
              v-if="isLoadingCompleted"
              v-model="type"
              placeholder="请选择"
              style="width: 120px"
              size="small"
              @change="fetchAuditData(true)"
            >
              <el-option
                v-for="item in TypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </template>
        <el-table :data="tableData" border style="width: 100%; margin-top: 10px">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column
            v-for="column in columns[type as keyof typeof columns]"
            :key="column.value"
            :prop="column.value"
            :label="column.label"
          >
            <template #default="scope">
              <template v-if="column.value === 'auditType'">
                {{ auditTypeMap[scope.row.auditType as keyof typeof auditTypeMap] || scope.row.auditType }}
              </template>
              <template v-else-if="column.value === 'confirm'">
                {{ auditConfirmMap[scope.row.confirm as keyof typeof auditConfirmMap] || scope.row.confirm }}
              </template>
              <template v-else-if="column.value === 'preStatus' && scope.row.auditType !== 1">
                {{ auditStatusMap[scope.row.preStatus as keyof typeof auditStatusMap] || scope.row.preStatus }}
              </template>
              <template v-else-if="column.value === 'toStatus' && scope.row.auditType !== 1">
                {{ auditStatusMap[scope.row.toStatus as keyof typeof auditStatusMap] || scope.row.toStatus }}
              </template>
              <template v-else-if="column.value === 'preStatus' && scope.row.auditType === 1">
                {{ newStatusMap[scope.row.preStatus] }}
              </template>
              <template v-else-if="column.value === 'toStatus' && scope.row.auditType === 1">
                {{ newStatusMap[scope.row.toStatus] }}
              </template>
              <template v-else>
                {{ scope.row[column.value] }}
              </template>
            </template>
          </el-table-column>

          <el-table-column v-if="type != 'all'" label="操作" width="130">
            <template #default="scope">
              <el-popover @hide="onCancel" width="200px">
                <div class="popover-content">
                  <el-select
                    v-model="commitData.accept"
                    placeholder="是否通过审核"
                    :teleported="false"
                    class="popover-content"
                  >
                    <el-option
                      v-for="(label, value) in auditAcceptMap"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                  <el-input
                    v-model="commitData.auditComment"
                    placeholder="请输入审核意见"
                    class="popover-content"
                  ></el-input>
                  <el-button
                    size="small"
                    type="primary"
                    @click="onAudit(scope.row.id, commitData)"
                    class="popover-button"
                    >确认</el-button
                  >
                  <el-button size="small" @click="onCancel" class="popover-button">重置</el-button>
                </div>
                <template #reference>
                  <el-button size="small">审核</el-button>
                </template>
              </el-popover>
              <el-button
                size="small"
                style="margin-left: 1px"
                @click="onView(scope.row.auditType, scope.row.auditId)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px; display: flex; justify-content: flex-end">
          <el-pagination
            background
            layout="prev, pager, next, jumper, ->, total, sizes"
            :total="total"
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20]"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </el-card>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" width="50%" title="查看审核详情" class="audit-dialog">
    <el-form class="flex-form">
      <el-form-item
        v-for="item in formData[type]"
        :key="item.value"
        :label="item.label"
        class="form-item"
      >
        <span class="form-value" v-if="detailData[item.value] && item.value != 'pictureUrl'">{{
          detailData[item.value]
        }}</span>
        <el-image
          v-else-if="detailData[item.value] && item.value == 'pictureUrl'"
          :src="getFullImageUrl(detailData[item.value])"
        ></el-image>
        <span class="form-value" v-else>暂无数据</span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'

import { TypeOptions, columns, getTypeOptions, formData } from './data/auditData'
import { onMounted, onUnmounted, ref } from 'vue'
import { ElOption, ElSelect, ElPagination, ElTable, ElTableColumn, ElButton, ElPopover, ElInput, ElDialog, ElForm, ElFormItem, ElCard, ElImage, } from 'element-plus'
import { getAuditList, getAuditOrderPending, getAuditProductionPending, getAuditPurchasePending, getAuditSubcontractPending, postAuditOder, postAuditProduction, postAuditPurchase, postAuditSubcontract, } from '@/apis/audit'
import { fetchOrderStatusMap, newStatusMap } from '../business/utils/statusMap'
import { messageBox } from '@/components/message/messageBox'
import { getOrderDetailById } from '@/apis/orders'
import { getPurchasePlanDetail } from '@/apis/produceControl/purchase/purchasePlan'
import { getPackagingDetail } from '@/apis/produceControl/produce/packaging'
import { getProductionScheduleById } from '@/apis/produceControl/produce/schedule'
import { getFullImageUrl } from '@/utils/image/getUrl'

const props = defineProps(['control'])
const popoverRef = ref()
const popoverVisible = ref(false)
const type = ref('all')
const isLoadingCompleted = ref(false)
let ws: WebSocket | null = null

onMounted(async () => {
  // 初始化时获取审核类型
  TypeOptions.value = await getTypeOptions()
  await fetchOrderStatusMap()
  isLoadingCompleted.value = true
  fetchAuditData(true)
  console.log(newStatusMap.value, 'newStatusMap111111111');

  const token = localStorage.getItem('Authorization') // 或从cookie等获取
  ws = new WebSocket(`ws://localhost:8080/websocket/${token}`)

  ws.onopen = () => {
    console.log('WebSocket 连接已建立')
  }
  ws.onmessage = (event) => {
    // 收到消息后刷新审核数据
    fetchAuditData(true)
  }
  ws.onerror = (err) => {
    console.error('WebSocket 错误', err)
  }
  ws.onclose = () => {
    console.log('WebSocket 连接已关闭')
  }
})

onUnmounted(() => {
  if (ws) {
    ws.close()
    ws = null
  }
})
const tableData = ref([])

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const auditTypeApiMap = {
  all: getAuditList,
  order: getAuditOrderPending,
  production: getAuditProductionPending,
  purchase: getAuditPurchasePending,
  subcontract: getAuditSubcontractPending,
}

const auditPostApiMap = {
  order: postAuditOder,
  production: postAuditProduction,
  purchase: postAuditPurchase,
  subcontract: postAuditSubcontract,
}

const viewApiMap = {
  order: getOrderDetailById,
  production: getProductionScheduleById,
  purchase: getPurchasePlanDetail,
  subcontract: getPackagingDetail,
}

const auditTypeMap = {
  1: '订单审核',
  2: '采购审核',
  3: '布产审核',
  4: '分包审核',
}

const auditConfirmMap = {
  0: '未审核',
  1: '已审核',
}

const auditStatusMap = {
  0: '待审核',
  1: '审核通过',
}

const auditAcceptMap = {
  '-1': '拒绝',
  1: '接受',
}

const fetchAuditData = async (resetPage: boolean) => {
  const api = auditTypeApiMap[type.value as keyof typeof auditTypeApiMap]
  if (api) {
    if (resetPage) {
      page.value = 1
    }
    const res = await api(page.value, pageSize.value)
    tableData.value = res.rows
    total.value = res.total
    console.log('获取审核数据', res)
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchAuditData(false)
}

const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  page.value = 1
  fetchAuditData(false)
}

const commitData = ref({
  accept: null as number | null,
  auditComment: '',
})

const onAudit = async (id: number, commitData: any) => {
  const api = auditPostApiMap[type.value as keyof typeof auditPostApiMap]
  if (api) {
    commitData = {
      ...commitData,
    }
    const res = await api(id, commitData)

    messageBox('success', null, res.msg || '审核成功')
    commitData.auditComment = '' // 清空输入框
    fetchAuditData(true) // 刷新数据
  }
  // popoverRef.value?.hide() // 关闭弹出框
}

const onCancel = () => {
  commitData.value.auditComment = ''
  commitData.value.accept = null
}

const detailData = ref<Record<string, any>>({})

const dialogVisible = ref(false)
const onView = async (auditType: number, auditId: number) => {
  const api = viewApiMap[type.value as keyof typeof viewApiMap]
  if (api) {
    const res = await api(auditId)

    dialogVisible.value = true
    detailData.value = res.data || res.rows[0]
    // 处理查看数据
  }
}
</script>

<style scoped lang="less">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popover-button {
  margin: 6px 1px 0 0;
}

.popover-content {
  margin-top: 4px;
  margin-bottom: 4px;
}

.audit-dialog {
  display: flex;
  flex-direction: row;

  .flex-form {
    display: flex;
    flex-wrap: wrap;
  }

  .flex-form .el-form-item {
    flex: 1 1 50%;
  }

  .form-value {
    display: inline-block;
    color: #4d4c4c;
  }
}
</style>
