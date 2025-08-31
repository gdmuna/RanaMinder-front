<template>
    <div
        class="md:w-[47rem] md:h-[20rem] w-[100vw] h-[19rem] md:px-0 px-[0.7rem] border-3 border-transparent bg-transparent relative select-none">
        <div
            class="md:absolute relative bottom-0 left-0 md:w-[44rem] md:h-[14rem] w-full h-full border-2 border-[#EEEEEE] rounded-lg bg-transparent flex flex-col justify-between p-8">
            <!-- 标题 -->
            <div class="w-full flex items-start mb-4 overflow-x-auto md:whitespace-nowrap hide-scrollbar">
                <span class="font-[优设标题黑] md:text-[4rem] text-[3.8rem] tracking-wide text-gradient drop-shadow-lg">
                    {{ title }}
                </span>
            </div>
            <!-- 底部按钮和时间 -->
            <div class="w-full items-end flex -mb-[0.8rem]">
                <!-- 按钮 -->
                <div class="flex space-x-5 cursor-pointer">
                    <div class="relative flex items-center justify-center rounded-2xl p-[0.4rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md group"
                        :style="{ backgroundColor: 'var(--main-color)' }" @click="handleViewDetail">
                        <div class="text-[1rem] dark:text-[#000000] z-10">
                            <Eye />
                        </div>
                        <div
                            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#272727] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                            查看详情
                        </div>
                    </div>
                    <div class="relative flex items-center justify-center rounded-2xl p-[0.4rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md group"
                        :style="{ backgroundColor: 'var(--main-color)' }">
                        <div class="text-[1rem] dark:text-[#000000]">
                            <Pencil />
                        </div>
                        <div
                            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#272727] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                            编辑面试
                        </div>
                    </div>
                    <div class="relative flex items-center justify-center rounded-2xl p-[0.4rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md group"
                        :style="{ backgroundColor: 'var(--main-color)' }" @click="handleApply">
                        <div class="text-[1rem] dark:text-[#000000]">
                            <FileUser />
                            <div
                                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#272727] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                                申请表模板
                            </div>
                        </div>
                    </div>
                    <div class="relative flex items-center justify-center rounded-2xl py-[0.3rem] px-[0.4rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md group"
                        :style="{ backgroundColor: 'var(--main-color)' }">
                        <div
                            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#272727] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                            删除面试
                        </div>
                        <div class="text-[1rem] dark:text-[#000000]">
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div style="transform: translateY(2px);">
                                        <Trash2 />
                                    </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>确定要删除这个面试吗？</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            这将永久删除面试数据，无法恢复。
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>取消</AlertDialogCancel>
                                        <AlertDialogAction>删除</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
                <!-- 时间 -->
                <span
                    class="text-[1rem] font-extrabold text-[#EEEEEE] tracking-widest ml-auto mr-[7rem] mb-[0.3rem] md:block hidden">
                    {{ formatDate(time) }}
                </span>
            </div>
        </div>
        <!-- 可爱鱼猫图 -->
        <div class="absolute bottom-0 right-0 md:block hidden">
            <img :src="isOdd ? modem1 : modem2" alt="modem" class="max-w-[20rem] max-h-[20rem]">
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Eye, Pencil, FileUser, Trash2 } from 'lucide-vue-next';
import modem1 from '@/assets/modem1.svg'
import modem2 from '@/assets/modem2.png'

const props = defineProps<{
    id: number
    title: string
    time: Date
}>()

const emit = defineEmits(['view-detail', 'apply']);

const isOdd = props.id % 2 === 1

function handleViewDetail() {
    emit('view-detail', props.id);
}

function handleApply() {
    emit('apply', props.id);
}

function formatDate(date: Date) {
    return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}`
}
</script>

<style scoped>
@font-face {
    font-family: "优设标题黑";
    src: url('../assets/fonts/YouSheBiaoTiHei.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

.hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

.text-gradient {
    background: linear-gradient(270deg, #EEEEEE 0%, var(--main-color, #FADCD9) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}
</style>