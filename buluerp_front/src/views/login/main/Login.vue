<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Iphone, Lock } from '@element-plus/icons-vue'
const autoLogin = ref()
const router = useRouter()
const handleLogin = () => {
  router.push({
    path: '/main',
  })
}
</script>
<template>
  <div class="row back">
    <img src="@/assets/img/logo.jpg" />
    <div class="form">
      <div style="margin: 4vh 10vw">
        <div style="font-size: 45px; margin-bottom: 3vh">欢迎</div>
        <el-text style="border-bottom: 2px solid #1991ff; padding: 1.5vh">账号密码登录</el-text>
        <div style="height: 3vh"></div>
        <el-input placeholder="手机号"
          ><template #prefix>
            <el-icon class="el-input__icon"><Iphone /></el-icon> </template
        ></el-input>
        <el-input placeholder="密码"
          ><template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon> </template
        ></el-input>
        <div class="row" style="justify-content: space-between">
          <el-checkbox v-model="autoLogin" label="自动登录" size="large" />
          <el-text style="cursor: pointer">忘记密码</el-text>
        </div>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.back {
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.back img {
  width: auto;
  height: 65vh;
  object-fit: contain;
}
.form {
  width: 40vw;
  height: 65vh;
  text-align: center;
}
.el-text {
  color: #1991ff;
}
.el-input {
  margin-bottom: 2vh;
}
.el-button {
  width: 100%;
  margin: 2vh 0;
}
</style>
