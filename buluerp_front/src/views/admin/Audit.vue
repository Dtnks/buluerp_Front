<template>
  <div class="col">
    <BordShow content="审核配置" path="管理员/审核配置" />
    <div class="greyBack">
      <el-card class="box-card">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="节点" width="180" />
          <el-table-column prop="id" label="节点" width="180">
            <template #default="scope">
              <span>{{ auditTypeMap[scope.row.auditType] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否需要确认" prop="status" width="180">
            <template #default="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                @change="handleSwitchChange(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuditSwitchEnabled, getAuditSwitchList, updateAuditSwitch } from '@/apis/audit'
import BordShow from '@/components/board/SecBoard.vue'
import { messageBox } from '@/components/message/messageBox'
import useTabStore from '@/stores/modules/tabs'
import { ElCard, ElTable, ElTableColumn } from 'element-plus'
import { onMounted, ref } from 'vue'
import { debounce } from 'lodash-es'

const tableData = ref([])
onMounted(() => {
  // 模拟获取数据
  auditSwitchList()
  // getAuditEnabled(1)
})

const tabStore = useTabStore()

const auditTypeMap = {
  1: '订单审核',
  2: '采购审核',
  3: '布产审核',
  4: '分包审核',
}
// auditSwitchList 查询审核开关列表
const auditSwitchList = async () => {
  const res = await getAuditSwitchList()
  console.log(res, '获取审核开关列表0000')
  tableData.value = res.rows
}

const handleSwitchChange = debounce(async (row: any) => {
  console.log(row, 'row')
  // 这里可以添加逻辑来处理开关状态变化
  // 例如，调用API更新状态
  const res = await updateAuditSwitch(row.auditType, row.status)

  console.log('更新成功', res)
  tabStore.freshTab('审核')
  messageBox('success', null, res.msg)
}, 500) // 500ms防抖

const getAuditEnabled = async (auditType: number) => {
  const res = await getAuditSwitchEnabled(auditType)
  console.log(res, '获取审核开关状态')
}
</script>

<style scoped lang="less"></style>
