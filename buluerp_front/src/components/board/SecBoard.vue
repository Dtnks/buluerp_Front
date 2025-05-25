<script setup lang="ts">
const props = defineProps({ content: { type: String }, path: { type: String } })
</script>

<template>
  <div id="board">
    <div class="subTitle">{{ path }}</div>
    <div class="title">
      {{ content }}
    </div>
  </div>
</template>

<style scoped>
#board {
  padding: 0px 15px 15px 15px;
  height: 8vh;
}
.subTitle {
  margin: 10px;
  color: gray;
}
.title {
  margin: 10px;
  font-weight: bold;
  font-size: 24px;
  color: black;
}
</style>
