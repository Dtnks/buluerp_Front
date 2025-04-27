<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const jumpLogin = () => {
  router.push({
    path: '/login',
  })
}
const value = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>
<template>
  <div class="row back">
    <img src="@/assets/img/logo.jpg" />
    <div class="form">
      <div style="margin: 4vh 10vw">
        <div style="margin-bottom: 3vh">注册</div>
        <el-input placeholder="手机号"
          ><template #prefix>
            <el-icon class="el-input__icon"><Iphone /></el-icon> </template
        ></el-input>
        <el-input placeholder="6-16位密码,区分大小写"
          ><template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon> </template
        ></el-input>
        <el-input placeholder="确认密码"
          ><template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon> </template
        ></el-input>
        <el-select v-model="value" placeholder="安全问题">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input placeholder="确认安全问题的答案"
          ><template #prefix>
            <el-icon class="el-input__icon"><Lock /></el-icon> </template
        ></el-input>
        <div class="row">
          <el-button type="primary" style="flex: 1">注册</el-button>
          <el-text @click="jumpLogin" style="cursor: pointer; flex: 1; text-align: right"
            >使用已有账户登录</el-text
          >
        </div>
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
}
.el-text {
  color: #1991ff;
}
.el-input,
.el-select {
  margin-bottom: 2vh;
}
.el-button {
  width: 100%;
  margin: 2vh 0;
}
</style>
