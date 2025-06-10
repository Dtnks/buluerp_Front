<script setup lang="ts">
import { storeRecording, changeSafeNumber } from '@/apis/produceControl/inventory/AllInventory'
import FormSearch from '@/components/form/Form.vue'
import BordShow from '@/components/board/SecBoard.vue'
import TableList from '@/components/table/TableList.vue'
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const type = ref('part')
const refreshList = () => {
  storeRecording(page.value, pageSize.value, type.value).then((res) => {
    console.log(res)
    listData.value = res.rows
    total.value = res.total
  })
}

const TypeOptions = [
  {
    label: '料包',
    value: 'packaging-material',
  },
  {
    label: '胶件',
    value: 'part',
  },
  {
    label: '成品',
    value: 'product',
  },
]
const mapList = { 'packaging-material': '料包', part: '胶件', product: '成品' }
const props = defineProps(['control'])
//渲染页面
const formData = ref({
  'packaging-material': [
    [
      { type: 'input', label: '料包编号', key: 'packingNumber' },
      { type: 'input', label: '产品货号', key: 'productPartNumber' },
    ],
  ],
  part: [[{ type: 'input', label: '模具编号', key: 'mouldNumber' }]],
  product: [[{ type: 'input', label: '产品货号', key: 'productPartNumber' }]],
})

const searchContent = ref({
  'packaging-material': {
    packingNumber: '',
    orderCode: '',
    productPartNumber: '',
  },
  part: {
    mouldNumber: '',
    orderCode: '',
  },
  product: {
    orderCode: '',
    productPartNumber: '',
  },
})
const tableData = ref({
  'packaging-material': [
    {
      value: 'id',
      label: 'ID',
      type: 'text',
    },
    {
      value: 'inQuantity',
      label: '进库总量',
      type: 'text',
    },
    { value: 'outQuantity', label: '出库总量', type: 'text' },
    {
      value: 'totalQuantity',
      label: '当前库存',
      type: 'text',
    },
    {
      value: 'packingNumber',
      label: '料包编号',
      type: 'text',
    },
    {
      value: 'productPartNumber',
      label: '产品货号',
      type: 'text',
    },
    {
      value: 'updateTime',
      label: '更新时间',
      type: 'text',
    },
  ],
  part: [
    {
      value: 'id',
      label: '采购单号',
      type: 'text',
    },
    {
      value: 'inQuantity',
      label: '进库总量',
      type: 'text',
    },
    { value: 'outQuantity', label: '出库总量', type: 'text' },
    {
      value: 'totalQuantity',
      label: '当前库存',
      type: 'text',
    },
    {
      value: 'mouldNumber',
      label: '模具编号',
      type: 'text',
    },
    {
      value: 'updateTime',
      label: '更新时间',
      type: 'text',
    },
    {
      value: 'safeQuantity',
      label: '安全阈值',
      type: 'text',
    },
  ],
  product: [
    {
      value: 'id',
      label: 'ID',
      type: 'text',
    },
    {
      value: 'inQuantity',
      label: '进库总量',
      type: 'text',
    },
    { value: 'outQuantity', label: '出库总量', type: 'text' },
    {
      value: 'totalQuantity',
      label: '当前库存',
      type: 'text',
    },
    {
      value: 'productPartNumber',
      label: '产品货号',
      type: 'text',
    },
    {
      value: 'updateTime',
      label: '更新时间',
      type: 'text',
    },
  ],
})
const changeId = ref(0)
const ChangeNumberVisible = ref(false)
const changeNumber = ref(0)
const handleSubmit = () => {
  changeSafeNumber(changeId.value, changeNumber.value, type.value).then((res) => {
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '修改成功',
      })
      refreshList()
    } else {
      ElMessage({
        type: 'error',
        message: '修改失败',
      })
    }
    ChangeNumberVisible.value = false
  })
}
const operations = ref({
  part: [
    {
      func: (row) => {
        changeId.value = row.id
        ChangeNumberVisible.value = true
        changeNumber.value = row.safeQuantity
      },
      value: '修改安全阈值',
      disabled: props.control[1].disabled,
    },
  ],
  'packaging-material': null,
  product: null,
})
const onSubmit = () => {
  page.value = 1
  storeRecording(page.value, pageSize.value, type.value, searchContent.value[type.value]).then(
    (res) => {
      listData.value = res.rows
      total.value = res.total
    },
  )
}
const chartDom = ref(null)
//table 导出
onMounted(() => {
  chartDom.value = document.getElementById('chart')
  console.log(chartDom)
})
const ChartVisible = ref(false)
const mapKey = { 'packaging-material': 'packingNumber', part: 'mouldNumber', product: '成品' }
const option = {
  title: { text: mapList[type.value] + '库存' },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function (params) {
      const name = params[0].name
      const currentStock = params[0].value
      if (params.length === 1) {
        return name + '<br/>当前库存:' + currentStock
      }
      const safetyThreshold = params[1].data.value
      return name + '<br/>当前库存: ' + currentStock + '<br/>安全阈值: ' + safetyThreshold
    },
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '库存总量',
      type: 'bar',
      data: [],
    },
    {
      name: '安全阈值',
      type: 'bar',
      data: [],
      barGap: '-100%',
    },
  ],
}
const openDialog = (rows) => {
  if (rows.length === 0) {
    ElMessage({
      type: 'warning',
      message: '请选择数据',
    })
    return
  }
  option.xAxis.data = rows.map((item) => item[mapKey[type.value]])
  option.series[0].data = rows.map((item) => item.totalQuantity)
  if (type.value === 'part') {
    option.series[1].data = rows
      .map((item) => item.safeQuantity)
      .map(function (threshold, index) {
        // 安全阈值始终显示为红色
        return {
          value: threshold,
          itemStyle: {
            color: 'rgba(255, 0, 0, 0.7)', // 红色透明，用于显示阈值但不完全覆盖
          },
          label: {
            show: false, // 不显示阈值的标签
          },
        }
      })
  } else {
    option.series[1].data = []
  }
  option.title.text = mapList[type.value] + '库存'
  ChartVisible.value = true
}
const showCharts = () => {
  const chart = echarts.init(chartDom.value, null, {
    renderer: 'canvas', // 强制使用 canvas 渲染
    width: 600, // 图片宽度
    height: 300, // 图片高度
  })

  option && chart.setOption(option)
}
//分页
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const listData = ref([])
const handlePageChange = async (val: number) => {
  page.value = val
  storeRecording(page.value, pageSize.value, type.value).then((res) => {
    listData.value = res.rows
  })
}
const handleSizeChange = async (val: number) => {
  pageSize.value = val
  page.value = 1
  storeRecording(page.value, pageSize.value, type.value).then((res) => {
    listData.value = res.rows
  })
}
storeRecording(page.value, pageSize.value, type.value).then((res) => {
  console.log(res)
  listData.value = res.rows
  total.value = res.total
})
</script>
<template>
  <div class="col">
    <BordShow content="库存查询" path="生产管理中心/库存查询" />
    <div class="greyBack">
      <FormSearch
        title="查询"
        :data="formData[type]"
        :onSubmit="onSubmit"
        :searchForm="searchContent[type]"
        :control="control"
      >
        <el-select v-model="type" placeholder="Select" style="width: 100px" @change="refreshList">
          <el-option
            v-for="item in TypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </FormSearch>
      <TableList
        :tableData="tableData[type]"
        :listData="listData"
        :control="control"
        :exportCharts="openDialog"
        :operations="operations[type]"
        :key="type"
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

      <el-dialog title="修改安全阈值" v-model="ChangeNumberVisible" width="400px">
        <el-form :model="changeId" label-width="100px">
          <el-form-item label="安全阈值">
            <el-input-number v-model="changeNumber" :min="0" style="width: 100%" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
            <el-button
              type="info"
              @click="
                () => {
                  ChangeNumberVisible = false
                }
              "
            >
              取消
            </el-button>
          </div>
        </template>
      </el-dialog>
      <el-dialog title="图表展示" v-model="ChartVisible" width="800px" @open="showCharts">
        <div ref="chartDom"></div>
        <template #footer>
          <div class="dialog-footer">
            <el-button
              type="info"
              @click="
                () => {
                  ChartVisible = false
                }
              "
            >
              取消
            </el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
