<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BordShow from '@/components/board/SecBoard.vue'
import StyleList from '../component/styleList.vue'

const props = defineProps<{ data: any; control: Array<object> }>()

const detail = ref(props.data)
</script>

<template>
  <div class="col">
    <BordShow content="产品详情页" path="产品管理/详情" />
    <StyleList v-if="detail" :detail="detail"  :control="control" />
  </div>
</template>
