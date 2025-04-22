<script setup lang="ts">
const props = defineProps({ handleHiddenMenu: { type: Function } })
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
        <img id="head" src="@/assets/icon/u37.jpg" /><el-text>姓名</el-text>
      </div>
    </div>
  </div>
</template>
<style scoped>
#menu {
  padding: 10px;
  height: 52px;
  line-height: 60px;
  border-bottom: 1px solid grey;
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
