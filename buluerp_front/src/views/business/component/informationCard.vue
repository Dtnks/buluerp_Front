<template>
    <div class="information-card">
        <el-card>
            <div>
                <h3>{{ title }}</h3>
            </div>
            <el-divider></el-divider>
            <div class="card-content">
                <slot></slot>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElCard, ElDivider } from 'element-plus'

defineProps({
    title: { type: String, }
})
</script>

<style scoped lang="less">
.information-card {
    margin: 10px;
}
</style>