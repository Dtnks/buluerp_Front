<template>
  <div class="col">
    <BordShow content="布产表" path="生产管理/生产/布产表" />
    <!-- <div v-if="isLoading" class="loading">加载中...</div> -->
    <div class="greyBack">
      <informationCard
        v-if="!isLoading"
        :title="`订单-${props.data.orderCode}`"
        :control="props.control"
      >
        <div v-if="scheduleData.id != null" class="informationCard">
          <el-row :gutter="16" class="information-row">
            <el-col
              v-for="field in fields"
              :key="field.label"
              :span="10"
              v-show="scheduleData[field.key] != null"
            >
              <div class="field">
                <label class="field-label">{{ field.label }}</label>
                <div class="field-key">
                  <span v-if="field.key == 'orderCode'">{{ props.data.orderCode }}</span>
                  <el-image
                    v-else-if="field.key == 'pictureUrl' && scheduleData[field.key]"
                    :src="getFullImageUrl(scheduleData[field.key])"
                  ></el-image>
                  <span v-else>{{ scheduleData[field.key] }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-else class="no-data">
          <span class="no-data-text">暂无数据</span>
          <el-button @click="onAdd">点击新增</el-button>
        </div>
      </informationCard>
    </div>
    <el-footer class="footer" v-if="scheduleData.id != null">
      <el-button @click="onCancel">解绑</el-button>
      <el-button type="primary" @click="onUpdate">点击修改</el-button>
    </el-footer>
  </div>
  <el-dialog v-model="newDialogVisible" title="新增布产表">
    <CreateForm :data="newFormData" :Formvalue="updatedFields" ref="createFormRef"></CreateForm>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="scheduleData.id == null" type="primary" @click="onAddSubmit">
          确认新增
        </el-button>
        <el-button v-else type="primary" @click="onUpdateSubmit"> 确认修改 </el-button>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CreateForm from '@/components/form/CreateForm.vue'
import { searchFunc } from '@/utils/search/search'
import BordShow from '@/components/board/SecBoard.vue'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
import { ElRow, ElCol, ElFooter, ElButton, ElDialog, ElImage } from 'element-plus'
import informationCard from './informationCard.vue'
import {
  changeSchedule,
  deleteSchedule,
  getProdunctionSchedeuleByOrderCode,
  newSchedule,
} from '@/apis/produceControl/produce/schedule'
import { messageBox } from '@/components/message/messageBox'
import { getFullImageUrl } from '@/utils/image/getUrl'
import useTabStore from '@/stores/modules/tabs'
// import useProductionSchedule from '../function/productionSchedule';

const tabStore = useTabStore()
const isLoading = ref(true)
const updatedFields = ref({})
const props = defineProps<{
  addTab: (targetName: string, component: any, data?: any) => void
  control: Array<object>
  data: { orderCode: string }
}>()
const newDialogVisible = ref(false)
const createFormRef = ref(null) // 表单引用
const scheduleData = ref<{ [value: string]: any }>({})
const newFormData = ref([
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
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/products/list', 'id'),
    },
    // { type: 'input', label: '产品编码', key: 'productCode', width: 8 },
  ],
  [
    { type: 'input', label: '模具编码', key: 'mouldNumber', width: 8 },
    {
      type: 'select',
      label: '模具状态',
      key: 'mouldCondition',
      width: 8,
      options: [
        { label: '未生产', value: '未生产' },
        { label: '已生产', value: '已生产' },
      ],
      rules: [requiredRule],
    },

    { type: 'input', label: '用量', key: 'usage', width: 8, rules: [positiveNumberRule] },
  ],
  [
    {
      type: 'mutilInputSelect',
      label: '客户',
      key: 'customer',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/customers/list', 'name'),
    },

    {
      type: 'mutilInputSelect',
      label: '模具厂家',
      key: 'mouldManufacturer',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/manufacturer/list', 'name'),
    },
  ],
  [
    {
      type: 'timer',
      label: '布产时间',
      key: 'productionTime',
      timerType: 'date',
      width: 12,
      rules: [requiredRule],
    },
    {
      type: 'timer',
      label: '出货时间',
      key: 'shipmentTime',
      timerType: 'date',
      width: 12,
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'inputSelect',
      label: '颜色编号',
      key: 'colorCode',
      width: 12,
      remoteFunc: (ele) => {
        ele.loading = true
        ele.options = [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
        ]
        ele.loading = false
      },
      loading: false,
      options: [],
    },
    {
      type: 'inputSelect',
      label: '排产Id',
      key: 'arrangeId',
      width: 12,
      rules: [],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/production-arrange/list', 'id'),
    },
  ],
  [
    {
      type: 'mutilInputSelect',
      label: '物料ID',
      key: 'materialIds',
      width: 12,
      rules: [requiredRule],
      options: [],
      loading: false,
      remoteFunc: searchFunc('system/material-info/list', 'id'),
    },
    { type: 'input', label: '料别', key: 'materialType', width: 12, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '单重', key: 'singleWeight', width: 8, rules: [positiveNumberRule] },
    {
      type: 'input',
      label: '布产重量',
      key: 'productionWeight',
      width: 8,
      rules: [positiveNumberRule],
    },
    { type: 'input', label: '供应商', key: 'supplier', width: 8, rules: [requiredRule] },
  ],
  [
    { type: 'input', label: '腔数PCS', key: 'cavityCount', width: 8, rules: [requiredRule] },
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
  ],
  [
    {
      type: 'number',
      label: '色粉数量',
      key: 'colorPowderNeeded',
      width: 8,
      rules: [positiveNumberRule],
    },
    { type: 'input', label: '生产周期(s)', key: 'cycleTime', width: 8, rules: [requiredRule] },
    { type: 'input', label: '生产时间(h)', key: 'timeHours', width: 8, rules: [requiredRule] },
  ],
  [{ type: 'image', label: '样例图', key: 'picture', width: 24 }],
])

const fields = ref([
  { label: '订单编号', key: 'orderCode' },
  { label: '产品ID', key: 'productId' },
  { label: '产品编码', key: 'productCode' },
  { label: '模具编码', key: 'mouldNumber' },
  { label: '模具状态', key: 'mouldCondition' },
  { label: '用量', key: 'usage' },
  { label: '客户', key: 'customer' },
  { label: '模具厂家', key: 'mouldManufacturer' },
  { label: '布产时间', key: 'productionTime' },
  { label: '出货时间', key: 'shipmentTime' },
  { label: '颜色编号', key: 'colorCode' },
  { label: '排产Id', key: 'arrangeId' },
  { label: '单重', key: 'singleWeight' },
  { label: '布产重量', key: 'productionWeight' },
  { label: '供应商', key: 'supplier' },
  { label: '腔数PCS', key: 'cavityCount' },
  { label: '布产模数PCS', key: 'productionMouldCount' },
  { label: '布产数量PCS', key: 'productionQuantity' },
  { label: '色粉数量', key: 'colorPowderNeeded' },
  { label: '料别', key: 'materialType' },
  { label: '生产周期(s)', key: 'cycleTime' },
  { label: '生产时间(h)', key: 'timeHours' },
  { label: '样例图', key: 'pictureUrl', type: 'picture' },
])

onMounted(async () => {
  await getscheduleData()
  isLoading.value = false // 数据加载完成后，设置加载状态为 false
})

// getscheduleData: 获取布产表数据
const getscheduleData = async () => {
  const res = await getProdunctionSchedeuleByOrderCode(props.data.orderCode)
  console.log('获取布产表数据:', res)
  if (res.code == 200) {
    scheduleData.value = res.rows[0] || {}
    // 更新 updatedFields 的值
    updatedFields.value = {
      ...scheduleData.value,
      orderCode: props.data.orderCode, // 保持订单编号不变
      id: scheduleData.value.id, // 保持id不变
    }
    return scheduleData.value
  } else {
    updatedFields.value = scheduleData.value
  }
}
// footer
const onCancel = () => {
  messageBox(
    'warning',
    async () => {
      // 解绑逻辑
      const res = await deleteSchedule([scheduleData.value.id])

      messageBox('success', null, '解绑成功')
      scheduleData.value = { id: null } // 清空采购数据
    },
    '解绑成功',
    '解绑失败',
    '确定要解绑当前订单吗？',
  )
  tabStore.freshTab('审核')
}

const onAdd = () => {
  newDialogVisible.value = true
}

const onAddSubmit = async () => {
  const res = await newSchedule(updatedFields.value)

  messageBox('success', null, '新增布产表成功')
  getscheduleData() // 刷新布产表数据

  newDialogVisible.value = false
  tabStore.freshTab('布产表')
  tabStore.freshTab('审核')
}

const onUpdate = () => {
  newDialogVisible.value = true
}

const onUpdateSubmit = async () => {
  const res = await changeSchedule(updatedFields.value)

  messageBox('success', null, '修改布产表成功')
  tabStore.freshTab('审核')

  newDialogVisible.value = false
  getscheduleData()
}
</script>

<style scoped lang="less">
.col {
  display: flex;
  flex-direction: column;

  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 350px;

    .no-data-text {
      margin-bottom: 10px;
      font-size: 16px;
      color: #999;
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    padding: 13px;
    background-color: #fbfbfb;
    border-top: 1px solid #ebeef5;
    box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.1);
  }
}

.field {
  margin-bottom: 14px;

  .field-key {
    margin-top: 6px;
    font-size: small;
    color: #707070;
  }
}

.informationCard {
  margin-bottom: 20px;
  min-height: 350px;
}
</style>
