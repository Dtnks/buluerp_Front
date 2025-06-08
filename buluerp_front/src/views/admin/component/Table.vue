<script lang="ts" setup>
import { changeStatus, changeRoles, resetPassword } from '@/apis/admin.js'
import { messageBox } from '@/components/message/messageBox.js'
import { ElMessage } from 'element-plus'
const props = defineProps(['tableData', 'total', 'setPage', 'options', 'control'])
import { ref } from 'vue'
const editPerson = ref({
  userName: null,
  userId: null,
  nickName: null,
  roleIds: [],
})
const DialogVisible = ref(false)
const handleRole = (row) => {
  editPerson.value = row
  DialogVisible.value = true
}
const submitRole = () => {
  changeRoles({ userId: editPerson.value.userId, roleIds: editPerson.value.roleIds }).then(
    (res) => {
      console.log({ userId: editPerson.value.userId, roleIds: editPerson.value.roleIds }, res)
      if (res.code === 200) {
        DialogVisible.value = false
        ElMessage({ type: 'success', message: '授权成功' })
        props.setPage(1)
      }
    },
  )
}
const handleStatus = (row, status) => {
  const submitChange = { ...row }
  const func = () => {
    submitChange.status = status
    return changeStatus(submitChange).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      } else {
        row.status = status ? '离职' : '生效'
      }
    })
  }

  messageBox(
    'warning',
    func,
    status ? '用户成功离职' : '用户成功恢复',
    '用户权限不足',
    status ? '确认离职该用户吗?' : '确认恢复该用户吗?',
  )
}

const handelResetPassword = (row) => {
  const func = () => {
    return resetPassword({ userId: row.userId, password: '123456' }).then((res) => {
      if (res.code == 500) {
        throw new Error('权限不足')
      }
    })
  }
  messageBox('warning', func, '用户成功修改密码', '用户权限不足', '确认重置该用户密码为123456吗?')
}
const filterHandler = (value: string, row: User, column: TableColumnCtx<User>) => {
  return row['status'] === value
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
      <el-table-column
        label="状态"
        width="180"
        :filters="[
          { text: '生效', value: '生效' },
          { text: '离职', value: '离职' },
        ]"
        :filter-method="filterHandler"
      >
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
            :disabled="control[1].disabled"
          >
            授权
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="handelResetPassword(scope.row)"
            v-if="scope.row.status == '生效'"
            :disabled="control[1].disabled"
          >
            重置密码
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleStatus(scope.row, 1)"
            :disabled="control[2].disabled"
            v-if="scope.row.status == '生效'"
          >
            离职失效
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleStatus(scope.row, 0)"
            :disabled="control[1].disabled"
            v-else
          >
            恢复
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
.cell .el-button + .el-button {
  margin-left: 10px;
}
</style>
