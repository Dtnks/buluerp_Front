import { getAuditSwitchList } from '@/apis/audit'
import { ref } from 'vue'

const auditTypeValueMap = {
  1: 'order',
  2: 'purchase',
  3: 'production',
  4: 'subcontract',
}

const auditTypeLabelMap = {
  order: '订单审核',
  purchase: '采购审核',
  production: '布产审核',
  subcontract: '分包审核',
}

export const TypeOptions = ref<{ label: string; value: string }[]>([
  { label: '全部审核记录', value: 'all' },
])

export async function getTypeOptions(): Promise<{ label: string; value: string }[]> {
  try {
    const response = await getAuditSwitchList()
    // const TypeOptions = [{ label: '全部审核记录', value: '' }]
    if (response.code === 200) {
      for (const item of response.rows) {
        if (item.status === 1) {
          const value = auditTypeValueMap[item.auditType] // 使用 auditTypeValueMap 获取英文单词
          if (value && !TypeOptions.value.some((option) => option.value === value)) {
            TypeOptions.value.push({
              label: auditTypeLabelMap[value], // 使用 auditTypeLabelMap 获取中文标签
              value: value,
            })
          }
        }
      }
      console.log('获取审核类型成功:', TypeOptions.value)
      return TypeOptions.value
    } else {
      console.error('获取审核类型失败:', response.message)
      return TypeOptions.value
    }
  } catch (error) {
    console.error('获取审核类型时发生错误:', error)
    return TypeOptions.value
  }
}

export const columns = {
  all: [
    { value: 'id', label: 'ID' },
    { value: 'auditComment', label: '审核评论' },
    { value: 'auditId', label: '审核ID' },
    { value: 'auditType', label: '审核类型' },
    { value: 'auditor', label: '审核人' },
    { value: 'checkTime', label: '检查时间' },
    { value: 'confirm', label: '确认' },
    { value: 'createTime', label: '创建时间' },
    { value: 'preStatus', label: '之前状态' },
    { value: 'toStatus', label: '目标状态' },
  ],
  order: [
    { value: 'id', label: 'ID' },
    { value: 'auditComment', label: '审核评论' },
    { value: 'auditId', label: '审核ID' },
    { value: 'auditType', label: '审核类型' },
    { value: 'auditor', label: '审核人' },
    { value: 'checkTime', label: '检查时间' },
    { value: 'confirm', label: '确认' },
    { value: 'createTime', label: '创建时间' },
    { value: 'preStatus', label: '之前状态' },
    { value: 'toStatus', label: '目标状态' },
  ],
  pending: [
    { value: 'id', label: 'ID' },
    { value: 'auditComment', label: '审核评论' },
    { value: 'auditId', label: '审核ID' },
    { value: 'auditType', label: '审核类型' },
    { value: 'auditor', label: '审核人' },
    { value: 'checkTime', label: '检查时间' },
    { value: 'confirm', label: '确认' },
    { value: 'createTime', label: '创建时间' },
    { value: 'preStatus', label: '之前状态' },
    { value: 'toStatus', label: '目标状态' },
  ],
  production: [
    { value: 'id', label: 'ID' },
    { value: 'auditComment', label: '审核评论' },
    { value: 'auditId', label: '审核ID' },
    { value: 'auditType', label: '审核类型' },
    { value: 'auditor', label: '审核人' },
    { value: 'checkTime', label: '检查时间' },
    { value: 'confirm', label: '确认' },
    { value: 'createTime', label: '创建时间' },
    { value: 'preStatus', label: '之前状态' },
    { value: 'toStatus', label: '目标状态' },
  ],
  purchase: [
    { value: 'id', label: 'ID' },
    { value: 'auditComment', label: '审核评论' },
    { value: 'auditId', label: '审核ID' },
    { value: 'auditType', label: '审核类型' },
    { value: 'auditor', label: '审核人' },
    { value: 'checkTime', label: '检查时间' },
    { value: 'confirm', label: '确认' },
    { value: 'createTime', label: '创建时间' },
    { value: 'preStatus', label: '之前状态' },
    { value: 'toStatus', label: '目标状态' },
  ],
  subcontract: [
    { value: 'id', label: 'ID' },
    { value: 'auditComment', label: '审核评论' },
    { value: 'auditId', label: '审核ID' },
    { value: 'auditType', label: '审核类型' },
    { value: 'auditor', label: '审核人' },
    { value: 'checkTime', label: '检查时间' },
    { value: 'confirm', label: '确认' },
    { value: 'createTime', label: '创建时间' },
    { value: 'preStatus', label: '之前状态' },
    { value: 'toStatus', label: '目标状态' },
  ],
}

export const tableData = ref({
  order: [],
  pending: [],
  production: [],
  purchase: [],
  subcontract: [],
})

export const formData = ref({
  order: [
    { value: 'id', label: 'ID' },
    { value: 'createBy', label: '创建者' },
    { value: 'createTime', label: '创建时间' },
    { value: 'customerId', label: '客户ID' },
    { value: 'customerName', label: '客户名称' },
    { value: 'deliveryDeadline', label: '交货截止日期' },
    { value: 'deliveryTime', label: '交货时间' },
    { value: 'innerId', label: '内部ID' },
    { value: 'operator', label: '操作员' },
    { value: 'outerId', label: '外部ID' },
    { value: 'product', label: '产品' },
    { value: 'productId', label: '产品ID' },
    { value: 'productionId', label: '生产ID' },
    { value: 'products', label: '产品列表' },
    { value: 'purchaseId', label: '采购ID' },
    { value: 'quantity', label: '数量' },
    { value: 'remark', label: '备注' },
    { value: 'status', label: '状态' },
    { value: 'subcontractId', label: '分包ID' },
    { value: 'updateBy', label: '更新者' },
    { value: 'updateTime', label: '更新时间' },
  ],
  pending: [{ value: 'id', label: 'ID' }],
  production: [{ value: 'id', label: 'ID' }],
  purchase: [{ value: 'id', label: 'ID' }],
  subcontract: [{ value: 'id', label: 'ID' }],
} as const)
