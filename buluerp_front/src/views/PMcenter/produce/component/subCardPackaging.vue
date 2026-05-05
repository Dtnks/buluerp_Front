<template>
  <!-- 展示数据的卡片 -->
  <el-card class="data-card" v-for="(bag, index) in bagList" :key="index">
    <template #header>
      <div class="card-header">
        <span
          >包装信息 <span>{{ bag.id }}</span></span
        >
        <el-button
          @click="
            () => {
              {
                subDialogVisible = true
                newSubSubmit = { ...bag }
                title = '修改'
              }
            }
          "
          type="primary"
          >修改</el-button
        >
        <el-button
          @click="
            () => {
              const func = () => {
                return Sub.deletePackaging(bag.id).then((res) => {
                  refresh()
                })
              }

              messageBox('warning', func, `成功删除`, '删除失败', `确认删除`)
            }
          "
          type="danger"
          >删除</el-button
        >
      </div>
    </template>
    <div class="data-row">
      <div class="data-item">
        <span>本包配件/种：</span>
        <span>{{ bag.bagAccessory }}</span>
      </div>
      <div class="data-item">
        <span>本包数量：</span>
        <span>{{ bag.bagQuantity }}</span>
      </div>
    </div>
    <!-- 第二行数据 -->
    <div class="data-row">
      <div class="data-item">
        <span>本包规格：</span>
        <span>{{ bag.bagSpecification || '无' }}</span>
      </div>
      <div class="data-item">
        <span>本包重量：</span>
        <span>{{ bag.bagWeight }}</span>
      </div>
    </div>
    <subSubPackaging :id="bag.id"></subSubPackaging>
  </el-card>
  <el-button
    @click="
      () => {
        {
          subDialogVisible = true
          reset()
          title = '新增'
        }
      }
    "
    style="margin: 10px; width: 100%"
    >新增</el-button
  >
  <el-dialog :title="title" v-model="subDialogVisible" width="800px">
    <createForm :data="newSubFormData" :Formvalue="newSubSubmit" ref="createFormRef" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubSubmit"> 确认 </el-button>
        <el-button
          type="info"
          @click="
            () => {
              subDialogVisible = false
            }
          "
        >
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="js">
const props = defineProps(['id'])
import * as Sub from '@/apis/produceControl/produce/subPackage.js'
import { ref } from 'vue'
import CreateForm from '@/components/form/CreateForm.vue'
import subSubPackaging from './subSubPackaging.vue'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
import { messageBox } from '@/components/message/messageBox'
const bagList = ref(null)

const refresh = () => {
  Sub.getBagList(props.id).then((res) => {
    bagList.value = res.rows
  })
}
refresh()
const subDialogVisible = ref(false)
const title = ref('新增')
const newSubFormData = ref([
  [
    {
      type: 'number',
      label: '本包配件/种',
      key: 'bagAccessory',
      width: 12,
      rules: [positiveNumberRule,requiredRule],
    },
    { type: 'input', label: '本包数量', key: 'bagQuantity', width: 12, rules: [requiredRule] },
  ],
  [
    {
      type: 'input',
      label: '本包规格',
      key: 'bagSpecification',
      width: 12,
      rules: [positiveNumberRule,requiredRule],
    },
    {
      type: 'input',
      label: '本包重量',
      key: 'bagWeight',
      width: 12,
      rules: [positiveNumberRule,requiredRule],
    },
  ],
])
const newSubSubmit = ref({
  bagAccessory: 0,
  bagQuantity: 0,
  bagSpecification: '',
  bagWeight: 0,
})
const reset = () => {
  newSubSubmit.value = {
    bagAccessory: 0,
    bagQuantity: 0,
    bagSpecification: '',
    bagWeight: 0,
  }
}
const handleSubSubmit = () => {
  const submitValue = { ...newSubSubmit.value, packagingListId: props.id }
  if (title.value === '新增') {
    Sub.newPackaging(submitValue).then((res) => {
      ElMessage.success('新增成功')
      subDialogVisible.value = false
      refresh()
    })
  } else {
    Sub.changePackaging(submitValue).then((res) => {
      ElMessage.success('修改成功')
      subDialogVisible.value = false
      refresh()
    })
  }
}
</script>
<style scoped>
.data-card {
  margin-top: 20px;
  width: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.data-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}
.data-item {
  display: flex;
  align-items: center;
  flex: 1;
}
.data-item span:first-child {
  margin-right: 10px;
}
</style>
