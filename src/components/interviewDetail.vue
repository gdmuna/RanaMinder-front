<template>
    <div class="relative dark:bg-[#E8E7E2] rounded-xl overflow-hidden select-none md:w-auto min-w-[36%] w-full h-auto">
        <!-- 顶部装饰 -->
        <div class="w-full h-16 flex">
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5 cursor-pointer" @click="deliverCloseDetail">
                <Minimize2 />
            </div>
            <div class="w-full h-16 dark:bg-[#A3A2A0]"></div>
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 font-normal text-xs" style="letter-spacing: 0.2em;">
                <img src="@/assets/barcode.svg" alt="Barcode" class="w-full pt-1.5 object-contain" />
                {{ person.stuId }}
            </div>
        </div>
        <!-- 卡片主体 -->
            <div class="xl:space-y-13 md:space-y-8 space-y-9 xl:p-6 p-5">
                <!-- 姓名 -->
                <div class="flex items-center">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">姓名</span>
                    <span class="text-xl text-[#000000] font-extrabold md:tracking-wide md:-mt-0.5">{{ person.name
                    }}</span>
                </div>
                <!-- 意向协会及部门 -->
                <div class="flex items-center">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">意向</span>
                    <div class="flex space-x-5">
                        <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ person.intention[0] }}</span>
                        <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ person.intention[1] }}</span>
                    </div>
                </div>
                <!-- 年级 -->
                <div class="flex items-center">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">年级</span>
                    <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ person.grade }}</span>
                </div>
                <!-- 专业 -->
                <div class="flex items-center">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">专业</span>
                    <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ person.major }}</span>
                </div>
                <!-- 学号 -->
                <div class="flex items-center">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">学号</span>
                    <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ person.stuId }}</span>
                </div>
                <!-- 邮箱 -->
                <div class="flex items-center">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">邮箱</span>
                    <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ person.email }}</span>
                </div>
                <!-- 手机号 -->
                <div class="flex items-center">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">手机</span>
                    <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ person.phoneNum }}</span>
                </div>
                <div class="flex">
                    <div class="flex justify-start">
                        <Button type="submit"
                            class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                            通过
                        </Button>
                    </div>
                    <div class="flex flex-1 justify-end">
                        <Button
                            class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                            @click="deliverCloseDetail">
                            取消
                        </Button>
                    </div>
                </div>
            </div>
    </div>
</template>

<script setup lang="ts">
import { Minimize2 } from 'lucide-vue-next';

import { Button } from '@/components/ui/button'


// 定义组件导出Props
const props = defineProps<{
    person?: {
        stuId: string;
        name: string;
        intention: string[];
        grade: string;
        major: string;
        email: string;
        phoneNum: string;
    }
    deliverCloseDetail?: () => void
}>();

// 设置默认值
const {
    person = {
        stuId: '',
        name: '',
        intention: [],
        grade: '',
        major: '',
        email: '',
        phoneNum: ''
    }
} = props;

</script>

<style scoped>
.inputBadge {
    display: inline-block;
    border-radius: 999px;
    width: auto;
    padding: 0.5rem 1rem;
    background-color: #8FAFC4;
    color: #000000;
    font-weight: bold;
    border: none;
    outline: none;
    box-shadow: none;
}

.select-value {
    font-weight: bold;
    color: #000000;
}

.select-trigger {
    border-radius: 999px;
    background-color: #8FAFC4;
    height: auto;
    border: none;
    outline: none;
    box-shadow: none;
}
</style>