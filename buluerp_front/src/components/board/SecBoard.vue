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
<style>
#board {
  padding: 20px;
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
