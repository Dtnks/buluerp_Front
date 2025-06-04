<script setup lang="ts">
const props = defineProps({ handleHiddenMenu: { type: Function } })
import { GetUserInfo } from '@/apis/layout'
import { ref } from 'vue'
const message = ref({ avatar: '' })
GetUserInfo().then((res) => {
  message.value = res.user
  console.log(message.value)
})
const BASE_IMAGE_URL = 'http://154.201.77.135:8080'
const getFullImageUrl = (path: string) => {
  // 防止多余斜杠：/profile//2025/... => /profile/2025/...
  return BASE_IMAGE_URL + path.replace('//', '/')
}
</script>
<template>
  <div id="menu" class="row">
    <div class="center">
      <img class="icon" src="@/assets/icon/u35.png" @click="props.handleHiddenMenu()" />
    </div>
    <div style="flex: 1"></div>
    <div style="width: 15vw" class="row pad">
      <div class="center" style="flex: 1"><img class="icon" src="@/assets/icon/u40.png" /></div>
      <div class="center" style="flex: 1"><img class="icon" src="@/assets/icon/u39.png" /></div>

      <div class="center row" style="flex: 3; align-items: center">
        <img id="head" :src="getFullImageUrl(message.avatar)" v-if="message.avatar" /><el-text
          style="flex: 1"
          >{{ message.nickName }}</el-text
        >
      </div>
    </div>
  </div>
</template>
<style scoped>
#menu {
  padding: 10px;
  height: 6vh;
  line-height: 52px;
  border-bottom: 1px solid rgba(240, 242, 245, 1);
}
.icon {
  width: 20px;
  margin-left: 10px;
  cursor: pointer;
  height: 20px;
}
#head {
  width: 30px;
  border-radius: 15px;
  margin-right: 8px;
  height: 30px;
}
.pad {
  justify-content: flex-end;
  padding-right: 20px;
}
</style>
