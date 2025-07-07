<script setup lang="ts">
import { GetMessage } from '@/apis/layout'
import { ref } from 'vue'
const messages = ref()
GetMessage().then((res) => {
  console.log(res.rows)
  messages.value = res.rows
})
</script>
<template>
  <div class="col">
    <div class="greyBack">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>新消息通知</span>
          </div>
        </template>
        <el-table :data="messages" stripe>
          <el-table-column prop="title" label="消息类型" width="180" />
          <el-table-column prop="content" label="内容" />
          <el-table-column prop="pushTime" label="时间" width="180" />
          <el-table-column prop="senderName" label="发送人" width="180" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<style scoped>
.card-header {
  font-size: 30px;
  font-weight: bold;
}
</style>
