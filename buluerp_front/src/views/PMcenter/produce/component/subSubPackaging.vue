<template>
  <el-card v-for="(detail, index) in details" :key="index">
    <template #header>
      <div class="card-header">
        <span>零件详情 {{ detail.id }}</span>
        <el-button
          @click="
            () => {
              {
                subSubDialogVisible = true
                newSubSubSubmit = { ...detail }
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
                return Sub.deletePackaging(detail.id).then((res) => {
                  if (res.code == 200) {
                    refresh()
                  } else {
                    throw new Error('删除失败')
                  }
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
    <div class="row">
      <div v-if="detail.partImageUrl">
        <el-image :src="getFullImageUrl(detail.partImageUrl)" lazy="true"></el-image>
      </div>
      <div class="col">
        <div class="row">
          <div class="detail-item col">
            <div class="detail-label">ID</div>
            <div class="detail-value">{{ detail.id || '无' }}</div>
          </div>
          <div class="detail-item col">
            <div class="detail-label">模具编号</div>
            <div class="detail-value">{{ detail.mouldNumber || '无' }}</div>
          </div>

          <div class="detail-item col">
            <div class="detail-label">材料类型</div>
            <div class="detail-value">{{ detail.materialType || '无' }}</div>
          </div>
          <div class="detail-item col">
            <div class="detail-label">颜色代码</div>
            <div class="detail-value">{{ detail.colorCode || '无' }}</div>
          </div>
          <div class="detail-item col">
            <div class="detail-label">规格名称</div>
            <div class="detail-value">{{ detail.specificationName || '无' }}</div>
          </div>
        </div>
        <div class="row">
          <div class="detail-item col">
            <div class="detail-label">用途</div>
            <div class="detail-value">{{ detail.usage || '无' }}</div>
          </div>
          <div class="detail-item col">
            <div class="detail-label">单重</div>
            <div class="detail-value">{{ detail.singleWeight || '无' }}</div>
          </div>
          <div class="detail-item col">
            <div class="detail-label">套数</div>
            <div class="detail-value">{{ detail.setQuantity || '无' }}</div>
          </div>
          <div class="detail-item col">
            <div class="detail-label">备注</div>
            <div class="detail-value">{{ detail.remarks || '无' }}</div>
          </div>
          <div class="detail-item col">
            <div class="detail-label">包装袋 ID</div>
            <div class="detail-value">{{ detail.packagingBagId || '无' }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
  <el-button @click="newSubSub()" style="margin: 10px; width: 100%">新增</el-button>
  <el-dialog :title="title" v-model="subSubDialogVisible" width="800px">
    <createForm :data="newSubSubFormData" :Formvalue="newSubSubSubmit" ref="createFormRef" />
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSubSubSubmit"> 确认 </el-button>
        <el-button
          type="info"
          @click="
            () => {
              subSubDialogVisible = false
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
import * as Sub from '@/apis/produceControl/produce/subsubPackage.js'
import { requiredRule, positiveNumberRule } from '@/utils/form/valid'
import { ref } from 'vue'
import { getFullImageUrl } from '@/utils/image/getUrl'

import { messageBox } from '@/components/message/messageBox'
const props = defineProps(['id'])
const title = ref('新增')
const subSubDialogVisible = ref(false)
const details = ref()
const refresh = () => {
  Sub.getBagList(props.id).then((res) => {
    details.value = res.rows
  })
}
refresh()
const newSubSubFormData = ref([
  [
    {
      type: 'input',
      label: '颜色编号',
      key: 'colorCode',
      width: 8,
      rules: [requiredRule],
    },
    { type: 'input', label: '本包数量', key: 'bagQuantity', width: 8, rules: [positiveNumberRule] },
    {
      type: 'input',
      label: '用量',
      key: 'usage',
      width: 8,
      rules: [positiveNumberRule],
    },
  ],
  [
    {
      type: 'number',
      label: '套料数量',
      key: 'setQuantity',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'input',
      label: '单重',

      key: 'singleWeight',
      width: 8,
      rules: [positiveNumberRule],
    },
    {
      type: 'input',
      label: '规格名称',
      key: 'specificationName',
      width: 8,
      rules: [positiveNumberRule],
    },
  ],
  [
    {
      type: 'input',
      label: '料别',
      key: 'materialType',
      width: 12,
      rules: [requiredRule],
    },
    {
      type: 'input',
      label: '模具编号',
      key: 'mouldNumber',
      width: 12,
      rules: [requiredRule],
    },
  ],
  [
    {
      type: 'textarea',
      label: '备注',
      key: 'remarks',
      width: 24,
      rules: [positiveNumberRule],
    },
  ],
  [
    {
      type: 'image',
      label: '胶件图片',
      key: 'partImageFile',
      width: 12,
      rules: [],
    },
  ],
])
const newSubSubSubmit = ref({
  colorCode: '',
  bagQuantity: '',
  usage: '',
  materialType: '',
  mouldNumber: '',
  specificationName: '',
  setQuantity: '',
  singleWeight: '',
  remarks: '',
})
const reset = () => {
  newSubSubSubmit.value = {
    colorCode: '',
    bagQuantity: '',
    usage: '',
    materialType: '',
    mouldNumber: '',
    specificationName: '',
    setQuantity: '',
    singleWeight: '',
    remarks: '',
  }
}
const newSubSub = () => {
  subSubDialogVisible.value = true
  reset()
  title.value = '新增'
}
const handleSubSubSubmit = () => {
  const submitValue = { ...newSubSubSubmit.value, packagingBagId: props.id }
  if (title.value === '新增') {
    Sub.newPackaging(submitValue).then((res) => {
      if (res.code == 200) {
        subSubDialogVisible.value = false
        refresh()
      }
    })
  } else {
    Sub.changePackaging(submitValue).then((res) => {
      console.log(res)
      if (res.code == 200) {
        subSubDialogVisible.value = false
        refresh()
      }
    })
  }
}
</script>

<style scoped>
.el-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
.data-card {
  width: 100%;
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  width: 120px;
  color: #606266;
}

.detail-value {
  flex: 1;
  color: #303133;
}
.row .col {
  flex: 1;
  text-align: center;
}
</style>
