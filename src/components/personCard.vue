<template>
    <div class="relative card dark:bg-[#E8E7E2] rounded-xl overflow-hidden cursor-pointer select-none"
        @mouseenter="hover = true" @mouseleave="hover = false">
        <!-- 顶部装饰 -->
        <div class="w-full h-15 flex">
            <div class="w-full h-15 bg-[#6F6E6C]"></div>
            <div class="bg-[#6F6E6C] px-6 font-normal text-xs" style="letter-spacing: 0.2em;">
                <img src="@/assets/barcode.svg" alt="Barcode" class="w-full pt-1.5 object-contain" />
                {{ stuId }}
            </div>
        </div>
        <!-- 卡片主体 -->
        <div class="flex items-center pl-[0.5rem]">
            <!-- 卡片内容 -->
            <div class="space-y-7 p-6 ">
                <!-- 姓名 -->
                <div class="flex">
                    <span class="w-[5rem] inline-block text-[#A6A6A6]">姓名</span>
                    <span class="text-xl font-extrabold text-gray-800 tracking-wide -mt-0.5">{{ name }}</span>
                </div>
                <!-- 部门 -->
                <div class="flex">
                    <span class="w-[5rem] inline-block text-[#A6A6A6]">部门</span>
                    <div
                        class="flex flex-1 gap-2 w-[17rem] min-w-[17rem] max-w-[17rem] overflow-x-auto whitespace-nowrap hide-scrollbar">
                        <div v-for="(item, index) in department" :key="'dept-' + index" class="inline-block">
                            <Badge>{{ item }}</Badge>
                        </div>
                    </div>
                </div>
                <!-- 年级 -->
                <div class="flex items-center">
                    <span class="w-[5rem] inline-block text-[#A6A6A6]">年级</span>
                    <Badge>{{ grade }}</Badge>
                </div>
                <!-- 专业 -->
                <div class="flex items-center">
                    <span class="w-[5rem] inline-block text-[#A6A6A6]">专业</span>
                    <Badge>{{ major }}</Badge>
                </div>
            </div>
            <!-- 右侧装饰三角 -->
            <div class="absolute right-[5px] pl-7 pr-5 2xl:block hidden">
                <div class="w-6 h-7 bg-[#6F6E6C]" style="clip-path: polygon(0 0, 100% 50%, 0 100%);"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Badge from '@/components/ui/badge/Badge.vue';

// 定义组件导出Props
const props = defineProps<{
    name?: string
    department?: string[]
    grade?: string
    major?: string
    stuId?: string
}>();

// 设置默认值
const {
    stuId = '24201111000',
    name = '测试',
    department = ['网络协会', '宣传部', '会长'],
    grade = '2024级',
    major = '导弹维修与技术',
} = props;

const hover = ref(false);
</script>

<style scoped>
.card {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
    transform-origin: center;
    will-change: transform;
    backface-visibility: hidden;
}

.card:hover {
    transform: translateY(-5px) rotateX(5deg);
}

.hide-scrollbar {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari/Opera */
}

</style>