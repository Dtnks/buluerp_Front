import { ref } from 'vue'

export default function useProductionSchedule() {
  const fields = ref([
    { value: 'cavityCount', label: '腔数PCS', type: 'text' },
    { value: 'colorCode', label: '颜色编码', type: 'text' },
    { value: 'colorPowderNeeded', label: '色粉需求KG', type: 'text' },
    { value: 'creationTime', label: '创建时间', type: 'date' },
    { value: 'customer', label: '客户', type: 'text' },
    { value: 'cycleTime', label: '生产周期', type: 'text' },
    { value: 'id', label: 'ID', type: 'text' },
    { value: 'inventory', label: '库存', type: 'text' },
    { value: 'materialIds', label: '物料ID列表', type: 'text' },
    { value: 'materialType', label: '物料类型', type: 'text' },
    { value: 'mouldCondition', label: '模具状态', type: 'text' },
    { value: 'mouldManufacturer', label: '模具厂家', type: 'text' },
    { value: 'operator', label: '操作人', type: 'text' },
    { value: 'picture', label: '图片', type: 'image' },
  ])

  // const operation = ref([])

  //   const searchInstance = getProdunctionSchedeuleByOrderCode(orderCode)

  // onMounted(() => {
  //   searchInstance(page.value, pageSize.value).then((res) => {
  //     listData.value = res.rows
  //     total.value = res.total
  //   })
  // })

  return {
    fields,
  }
}
