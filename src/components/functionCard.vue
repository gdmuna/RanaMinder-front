<template>
    <div class="flex rounded-lg aspect-[26/16] max-w-[26rem] max-h-[16rem] bg-[#EFE8DE] text-black uppercase cursor-pointer"
        @click="navigate">
        <!-- 左侧竖直文字 -->
        <div class="flex items-center h-full">
            <div class="font-black tracking-tighter writing-vertical-lr text-[2.6rem]">
                {{ sideLabel }}
            </div>
        </div>

        <div class="flex flex-col">
            <!-- 主体区 -->
            <div class="min-h-[16rem] flex items-center justify-center pr-[1.5rem]">
                <div class="w-full h-[74%] rounded-lg px-[2.5rem] py-[2rem] flex space-x-5 "
                    :style="{ backgroundColor: backgroundColor }">
                    <!-- 图标 -->
                    <div>
                        <component :is="icon" class="w-15 h-15 text-black mt-3" />
                    </div>
                    <div class="flex flex-col items-center justify-center text-center">
                        <!-- 标题 -->
                        <div class="flex items-center space-x-4 mb-4">
                            <span class="text-[40px] font-black">{{ title }}</span>
                        </div>
                        <!-- 副标题 -->
                        <div class="text-[9px] font-bold tracking-tighter whitespace-nowrap mb-2 -ml-8 text-center">
                            {{ subtitle }}
                        </div>
                        <!-- 分割线 -->
                        <div class="w-15 h-0.5 bg-black mx-auto mr-24"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 右侧 enter 提示 -->
        <div class="flex items-end justify-end text-right text-2xl font-black -ml-27">
            ENTER
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
    transform: rotate(360deg);
}

/* .side-label {
    font-size: clamp(2.3rem, 5vw, 2.6rem);
    color: #000;
} */
</style>
