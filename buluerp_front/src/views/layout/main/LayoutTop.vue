<script setup lang="ts">
const props = defineProps({
  handleHiddenMenu: { type: Function },
  reverse: { type: String },
  addTab: { type: Function },
})
import { GetUserInfo, GetMessage } from '@/apis/layout'
import { defineAsyncComponent } from 'vue'
import { getFullImageUrl } from '@/utils/image/getUrl'
import { ref } from 'vue'
import useTabStore from '@/stores/modules/tabs'
import router from '@/router'
const message = ref({ avatar: '' })
GetUserInfo().then((res) => {
  message.value = res.user
})

const total = ref(0)
GetMessage().then((res) => {
  console.log()
  if (res.data.total !== undefined) {
    total.value = res.data.total
  }
})
const timer = setInterval(() => {
  GetMessage().then((res) => {
    if (res) {
      total.value = res.data.total
    } else {
      clearInterval(timer)
    }
  })
}, 6000)
const logout = () => {
  localStorage.removeItem('Authorization')
  clearInterval(timer)
  const store = useTabStore()
  store.deleteTab()
  router.push({ path: '/login' })
}
</script>
<template>
  <div id="menu" class="row">
    <div class="center">
      <img
        class="icon"
        src="@/assets/icon/u35.png"
        @click="props.handleHiddenMenu()"
        :class="reverse"
      />
    </div>
    <div style="flex: 1"></div>
    <div style="width: 15vw" class="row pad">
      <div class="center" style="flex: 1">
        <div class="notification-icon-wrapper">
          <svg
            class="icon notification-icon"
            style="
              width: 25px;
              height: 25px;
              vertical-align: middle;
              fill: currentColor;
              overflow: hidden;
            "
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11867"
          >
            <path
              d="M446.112323 177.545051c137.567677 0.219798 252.612525 104.59798 266.162424 241.493333 13.562828 136.895354-78.778182 261.818182-213.617777 289.008485-134.852525 27.203232-268.386263-52.156768-308.945455-183.608889s25.018182-272.252121 151.738182-325.779394A267.235556 267.235556 0 0 1 446.112323 177.545051m0-62.060607c-182.794343 0-330.989899 148.195556-330.989899 330.989899s148.195556 330.989899 330.989899 330.989899 330.989899-148.195556 330.989899-330.989899-148.195556-330.989899-330.989899-330.989899z m431.321212 793.341415a30.849293 30.849293 0 0 1-21.94101-9.102223l-157.220202-157.220202c-11.752727-12.179394-11.584646-31.534545 0.37495-43.50707 11.972525-11.972525 31.327677-12.140606 43.494141-0.37495l157.220202 157.220202a31.036768 31.036768 0 0 1 6.723232 33.810101 31.004444 31.004444 0 0 1-28.651313 19.174142z m0 0"
              p-id="11868"
            ></path>
          </svg>
        </div>
      </div>
      <div
        class="center"
        style="flex: 1"
        @click="
          props.addTab(
            '我的信息',
            defineAsyncComponent(() => import('@/views/person/main/Information.vue')),
          )
        "
      >
        <div
          class="notification-icon-wrapper"
          :class="{ 'has-notification': total > 0 }"
          :data-count="total.toString()"
        >
          <svg
            class="icon notification-icon"
            style="
              width: 25px;
              height: 25px;
              vertical-align: middle;
              fill: currentColor;
              overflow: hidden;
            "
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11341"
          >
            <path
              d="M512 235.52c118.57408 0 215.04 96.46592 215.04 215.04v263.86432l19.38944 20.67968 40.43776 43.136H237.1328l40.43776-43.136L296.96 714.42432V450.56c0-118.57408 96.46592-215.04 215.04-215.04m0-71.68c-158.35136 0-286.72 128.36864-286.72 286.72v235.52l-56.60672 60.38016C131.88608 785.69984 159.70816 849.92 213.49888 849.92h597.00736c53.7856 0 81.60768-64.22016 44.82048-103.45984L798.72 686.08V450.56c0-158.35136-128.36864-286.72-286.72-286.72zM583.68 890.88H440.32a35.84 35.84 0 1 0 0 71.68h143.36a35.84 35.84 0 1 0 0-71.68zM537.6 61.44H486.4a35.84 35.84 0 1 0 0 71.68h51.2a35.84 35.84 0 1 0 0-71.68z"
              :fill="total > 0 ? 'red' : 'grey'"
              p-id="11342"
            ></path>
          </svg>
        </div>
      </div>
      <div class="center row" style="flex: 3; align-items: center">
        <img id="head" :src="getFullImageUrl(message.avatar)" v-if="message.avatar" /><el-text
          style="flex: 1"
          >{{ message.nickName }}</el-text
        >
        <el-text @click="logout">登出</el-text>
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
  height: 25px;
}

.pad {
  justify-content: flex-end;
  padding-right: 20px;
}

.flipped-image {
  display: inline-block;
  /* 确保transform生效 */
  transform: scaleX(-1);
}

.notification-icon-wrapper {
  position: relative;
  display: inline-block;
}

.notification-icon {
  display: block;
  /* 确保 SVG 作为块级元素 */
}

.notification-icon-wrapper.has-notification::after {
  content: attr(data-count);
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  font-size: 12px;
  text-align: center;
  background-color: #ff4d4f;
  border-radius: 9px;
  line-height: 18px;
  color: white;
  box-sizing: border-box;
  padding: 0 3px;
  display: block;
  z-index: 1000;
}

.center {
  display: flex;
  align-items: center;
}
</style>
