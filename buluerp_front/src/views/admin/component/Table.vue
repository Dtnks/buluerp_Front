<script lang="ts" setup>
import { changeStatus, changeRoles } from '@/apis/admin.js'
import { messageBox } from '@/components/message/messageBox.js'
defineProps(['tableData', 'total', 'setPage', 'options'])
import { ref } from 'vue'
const editPerson = ref({
  userName: null,
  userId: null,
  nickName: null,
  roleIds: [],
})
const DialogVisible = ref(false)
const handleRole = (row) => {
  editPerson.value = { ...row }
  DialogVisible.value = true
}
const submitRole = () => {
  changeRoles({ userId: editPerson.value.userId, roleIds: editPerson.value.roleIds }).then(
    (res) => {
      console.log({ userId: editPerson.value.userId, roleIds: editPerson.value.roleIds })
      console.log(res)
    },
  )
}
const handleDelete = (row) => {
  const submitChange = { ...row }
  const func = () => {
    submitChange.status = 1
    return changeStatus(submitChange).then((res) => {
      console.log(res)
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        row.status = '离职'
      }
    })
  }
  messageBox('warning', func, '用户成功离职', '用户权限不足', '确认离职该用户吗?')
}
</script>
<template>
  <div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="用户ID" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.userId }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="帐号" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.userName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.nickName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-tag style="margin-left: 10px" v-for="roleTag in scope.row.roleNames">{{
              roleTag
            }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.status }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            @click="handleRole(scope.row)"
            v-if="scope.row.status == '生效'"
          >
            授权
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status == '生效'"
          >
            离职失效
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="DialogVisible" title="系统账号授权" width="500" center>
      <div style="margin: 20px 10px">姓名 : {{ editPerson.nickName }}</div>
      <div style="margin: 20px 10px">账号 : {{ editPerson.userName }}</div>
      <div style="margin: 20px 10px">
        角色 :
        <el-select
          v-model="editPerson.roleIds"
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

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitRole"> 确认 </el-button>
          <el-button
            type="info"
            @click="
              () => {
                DialogVisible = false
              }
            "
          >
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
span {
  margin: 0 !important;
}
</style>
