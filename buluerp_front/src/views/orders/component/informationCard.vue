<template>
    <div>
        <a-card>
            <a-card-meta :title='title'></a-card-meta>
            <a-divider></a-divider>
            <div class="card-content">
                <slot></slot>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Card, Divider } from 'ant-design-vue';
import { useRoute } from 'vue-router'

defineProps({
    title: { type: String, }
})
</script>

<style scoped lang="less"></style>