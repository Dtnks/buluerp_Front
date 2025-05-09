<script lang="ts" setup>
defineProps(['tableData', 'total', 'setPage'])
import { ref } from 'vue'
const editPerson = ref({
  userName: null,
  phonenumber: null,
})
const DialogVisible = ref(false)
const handleRole = (row) => {
  editPerson.value = row
  DialogVisible.value = true
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const currentPage = ref(1)
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
            <span style="margin-left: 10px">{{ scope.row.phonenumber }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.userName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ scope.row.remark }}</span>
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
          <el-button size="small" @click="handleRole(scope.row)"> 授权 </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.userId)">
            离职失效
          </el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-dialog v-model="DialogVisible" title="系统账号授权" width="500" center>
      <div>姓名:{{ editPerson.userName }}</div>
      <div>账号:{{ editPerson.phonenumber }}</div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary"> 确认 </el-button>
          <el-button type="info"> 取消 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
