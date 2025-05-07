<script setup>
import BordShow from '@/components/board/SecBoard.vue'
import { getRoleList } from '@/apis/admin.js'
import { ref } from 'vue'
const options = ref({})
getRoleList().then((res) => {
  options.value = res.data.data.map(({ roleName, roleId }) => ({ value: roleId, label: roleName }))
})
</script>
<template>
  <BordShow content="用户管理" path="业务中心/详情" />
  <div style="flex: 1; background-color: rgba(240, 242, 245, 1); padding: 20px 40px 0 40px">
    <el-card class="col">
      <div class="row">
        <div class="input row">
          <span>角色:</span
          ><el-select
            v-model="role"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input row"><span>手机号:</span><el-input /></div>
        <div class="input row"><span>姓名:</span><el-input /></div>
      </div>
    </el-card>
  </div>
</template>
<style scoped>
.input {
  flex: 1;
}
.input span {
  width: 70px;
  text-align: right;
  padding: 0 10px;
}
.input .el-input {
  width: 200px;
}
</style>
