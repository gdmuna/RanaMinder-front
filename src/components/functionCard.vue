<template>
    <div class="flex rounded-2xl bg-neutral-100 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
        @click="navigate">
        <!-- 左侧竖直文字 -->
        <div
            class="bg-black text-white text-xl font-bold tracking-widest flex items-center px-2 rotate-180 writing-vertical-lr">
            {{ sideLabel }}
        </div>

        <!-- 内容区 -->
        <div class="flex flex-col justify-center items-start px-6 py-4 flex-1" :style="{ backgroundColor }">
            <div class="text-4xl font-semibold flex items-center space-x-2 mb-2">
                <component :is="icon" class="w-8 h-8" />
                <span>{{ title }}</span>
            </div>
            <div class="uppercase text-xs tracking-wider text-gray-700 border-t border-gray-500 pt-1">
                {{ subtitle }}
            </div>
        </div>

        <!-- 右侧 enter 提示 -->
        <div class="flex items-end justify-end text-right px-4 py-2 font-bold text-md">
            ENTER >>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    title: string
    subtitle: string
    icon: any
    sideLabel: string
    backgroundColor?: string
    link?: string
}>()

const navigate = () => {
    if (props.link) {
        window.location.href = props.link
    }
}
</script>

<style scoped>
.writing-vertical-lr {
    writing-mode: vertical-lr;
}
</style>
