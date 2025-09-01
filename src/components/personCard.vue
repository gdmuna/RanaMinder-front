<template>
    <div class="relative card dark:bg-[#E8E7E2] rounded-xl overflow-hidden cursor-pointer select-none">
        <!-- 顶部装饰 -->
        <div class="w-full h-15 flex">
            <div class="w-full h-15  dark:bg-[#A3A2A0]"></div>
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 font-normal text-xs" style="letter-spacing: 0.2em;">
                <img src="@/assets/barcode.svg" alt="Barcode" class="w-full pt-1.5 object-contain" />
                {{ stuId }}
            </div>
        </div>
        <!-- 卡片主体 -->
        <div class="flex items-center pl-[0.5rem]">
            <!-- 卡片内容 -->
            <div class="space-y-7 lg:p-6 p-3">
                <!-- 姓名 -->
                <div class="flex">
                    <span class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C]">姓名</span>
                    <span class="md:text-xl text-[#000000] font-extrabold md:tracking-wide md:-mt-0.5">{{ name }}</span>
                </div>
                <!-- 部门 -->
                <div class="flex">
                    <span class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C]">部门</span>
                    <div
                        class="flex flex-1 gap-2 w-[17rem] min-w-[17rem] max-w-[17rem] overflow-x-auto whitespace-nowrap hide-scrollbar">
                        <div v-for="(item, index) in department" :key="'dept-' + index" class="inline-block">
                            <Badge>{{ item }}</Badge>
                        </div>
                    </div>
                </div>
                <!-- 年级 -->
                <div class="flex items-center">
                    <span class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C]">年级</span>
                    <Badge>{{ grade }}</Badge>
                </div>
                <!-- 专业 -->
                <div class="flex items-center">
                    <span class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C]">专业</span>
                    <Badge>{{ major }}</Badge>
                </div>
            </div>
            <!-- 右侧装饰三角 -->
            <div class="absolute right-[5px] pr-5 2xl:block hidden">
                <div class="w-6 h-7 dark:bg-[#A3A2A0]" style="clip-path: polygon(0 0, 100% 50%, 0 100%);"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
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
    stuId = '未填写',
    name = '未填写',
    department = ['未分配'],
    grade = '未填写',
    major = '未填写',
} = props;

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