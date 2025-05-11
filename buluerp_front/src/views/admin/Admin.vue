<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import { getOptionselect, newUser, getUserList, resetPassword } from '@/apis/admin.js'
import Table from './component/Table.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { toValidArray } from 'element-plus/es/components/tree-select/src/utils.mjs'
const options = ref({})
const role = ref()
const currentPage = ref(1)
const total = ref()
const setPage = (pageNum) => {
  getUserList(pageNum).then((res) => {
    console.log(res)
    tableData.value = res.data.rows.map(
      ({ userId, phonenumber, userName, roleNames, status, roleIds }) => ({
        userId,
        phonenumber,
        userName,
        roleNames,
        roleIds,
        status: status === '0' ? '生效' : '离职',
      }),
    )
    total.value = res.data.total
  })
}
setPage(1)
getOptionselect().then((res) => {
  options.value = res.data.rows.map(({ roleName, roleId }) => ({ value: roleId, label: roleName }))
})
const newSubmit = ref({
  userName: null,
  nickName: null,
  password: null,
  roleIds: null,
  phonenumber: null,
})
const resetSubmit = () => {
  newSubmit.value = {
    userName: null,
    nickName: null,
    password: null,
    roleIds: null,
    phonenumber: null,
  }
}
const handleSubmit = () => {
  newSubmit.value.nickName = newSubmit.value.phonenumber
  console.log(newSubmit.value)
  newUser(newSubmit.value).then((res) => {
    console.log(res)
    newDialogVisible.value = false
    if (res.data.code == 500) {
      ElMessage({ type: 'error', message: '用户已存在' })
    } else {
      ElMessage({ type: 'success', message: '新增用户成功' })
      currentPage.value = 1
      setPage(1)
    }
  })
}
interface User {
  userId: string
  phonenumber: string
  userName: string
  remark: string
  state: string
}
const tableData = ref([])
const newDialogVisible = ref(false)
const resetDialogVisible = ref(false)
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
            :max-collapse-tags="2"
            placeholder="Select"
            style="width: 280px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input row"><span>帐号:</span><el-input /></div>
        <div class="input row"><span>姓名:</span><el-input /></div>
      </div>
      <div class="row" style="justify-content: flex-end; margin: 15px">
        <el-button
          type="primary"
          @click="
            () => {
              resetSubmit()
              newDialogVisible = true
            }
          "
          >新建</el-button
        >
        <el-button type="primary">查询</el-button>
        <el-button
          type="primary"
          @click="
            () => {
              resetSubmit()
              resetDialogVisible = true
            }
          "
          >密码重置</el-button
        >
        <el-dialog v-model="newDialogVisible" title="新建系统账号" width="500" center>
          <div class="col cardCenter">
            <div class="input row">
              <span>帐号:</span><el-input v-model="newSubmit.phonenumber" style="width: 240px" />
            </div>
            <div class="input row">
              <span>姓名:</span><el-input v-model="newSubmit.userName" style="width: 240px" />
            </div>
            <div class="input row">
              <span>密码:</span
              ><el-input v-model="newSubmit.password" style="width: 240px" type="password" />
            </div>
            <div class="input row">
              <span>角色:</span
              ><el-select
                v-model="newSubmit.roleIds"
                multiple
                collapse-tags
                collapse-tags-tooltip
                :max-collapse-tags="2"
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
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
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
        <el-dialog
          v-model="resetDialogVisible"
          title="系统账号密码重置"
          width="500"
          center
          @click="
            () => {
              console.log(222222)
            }
          "
        >
          <div style="margin: 20px 10px">
            账号 : <el-input v-model="newSubmit.password" style="width: 240px" />
          </div>
          <div style="margin: 20px 10px">姓名 : {{ newSubmit.userName }}</div>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary"> 确认 </el-button>
              <el-button
                type="info"
                @click="
                  () => {
                    resetDialogVisible = false
                  }
                "
              >
                取消
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <Table :tableData="tableData" :options="options" />
      <div style="right: 40px; bottom: 20px">
        <el-pagination
          v-model:current-page="currentPage"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="8"
          @prev-click="setPage(currentPage)"
          @current-change="setPage(currentPage)"
          @next-click="setPage(currentPage)"
        />
      </div>
      <div style="height: 50px"></div>
    </el-card>
  </div>
</template>
<style scoped>
.el-card {
  margin: 20px;
}
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
.cardCenter .el-input {
  margin-bottom: 20px;
}
</style>
