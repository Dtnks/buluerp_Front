<script setup lang="ts">
import BordShow from '@/components/board/SecBoard.vue'
import searchForm from '../component/searchForm.vue';
import SearchList from '../component/searchList.vue';


</script>

<template>
  <div class="col">
    <BordShow content="产品查询列表" path="产品管理/查询" />
    <div class="bgd">
      <searchForm/>
      <SearchList/>
    </div>
  </div>
</template>

<style lang="css" scoped>
.bgd{
  padding-left: 20px;
  padding-right: 6px;
}
</style>