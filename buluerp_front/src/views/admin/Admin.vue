<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import { getOptionselect, newUser, getUserList } from '@/apis/admin.js'
import Table from './component/Table.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const options = ref({})

const searchContent = ref({ roleId: '', userName: '', nickName: '' })
const currentPage = ref(1)
const total = ref()
const setPage = (page = 0) => {
  getUserList(page ? page : currentPage.value, searchContent.value).then((res) => renderData(res))
}
const renderData = (res) => {
  console.log(res)
  tableData.value = res.rows.map(({ userId, userName, nickName, roleNames, status, roleIds }) => ({
    userId,
    userName,
    nickName,
    roleNames,
    roleIds,
    status: status === '0' ? '生效' : '离职',
  }))
  total.value = res.total
}
setPage()
getOptionselect().then((res) => {
  options.value = res.rows.map(({ roleName, roleId }) => ({ value: roleId, label: roleName }))
})
const newSubmit = ref({
  userName: null,
  nickName: null,
  password: null,
  roleIds: null,
})
const resetSubmit = () => {
  newSubmit.value = {
    userName: null,
    nickName: null,
    password: null,
    roleIds: null,
  }
}
const handleSubmit = () => {
  newUser(newSubmit.value).then((res) => {
    newDialogVisible.value = false
    if (res.code == 500) {
      ElMessage({ type: 'error', message: '用户已存在' })
    } else {
      ElMessage({ type: 'success', message: '新增用户成功' })
      currentPage.value = 1
      setPage(1)
    }
  })
}

const search = () => {
  currentPage.value = 1
  console.log(searchContent.value)
  getUserList(currentPage.value, searchContent.value).then((res) => renderData(res))
}
const tableData = ref([])
const newDialogVisible = ref(false)
</script>
<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <BordShow content="用户管理" path="管理员/用户管理" />
    <div class="greyBack">
      <el-card class="col">
        <div class="row">
          <el-form-item label="角色" class="input row">
            <el-select
              v-model="searchContent.roleId"
              collapse-tags
              clearable
              value-on-clear=""
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
          </el-form-item>
          <el-form-item class="input row" label="账号">
            <el-input v-model="searchContent.userName" />
          </el-form-item>
          <el-form-item class="input row" label="姓名">
            <el-input v-model="searchContent.nickName" />
          </el-form-item>
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
          <el-button type="primary" @click="search">查询</el-button>
          <el-dialog v-model="newDialogVisible" title="新建系统账号" width="500" center>
            <div class="col cardCenter">
              <div class="input row">
                <span>帐号 </span><el-input v-model="newSubmit.userName" style="width: 240px" />
              </div>
              <div class="input row">
                <span>姓名 </span><el-input v-model="newSubmit.nickName" style="width: 240px" />
              </div>
              <div class="input row">
                <span>密码 </span
                ><el-input v-model="newSubmit.password" style="width: 240px" type="password" />
              </div>
              <div class="input row">
                <span>角色 </span
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
        </div>
        <Table :tableData="tableData" :options="options" :setPage="setPage" />
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
      </el-card>
    </div>
  </div>
</template>
<style scoped>
.input {
  flex: 1;
}
.input span {
  width: 40px;
  text-align: left;
  padding: 0 10px;
  line-height: 32px;
}
.input .el-input {
  width: 240px;
}
.cardCenter .el-input {
  margin-bottom: 20px;
}
.row .el-button {
  margin-right: 10px;
}
</style>
