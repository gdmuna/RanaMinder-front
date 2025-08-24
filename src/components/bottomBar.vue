<template>
    <div
        class="fixed sm:top-14 bottom-0 right-0 sm:h-full h-14 sm:w-auto w-full header-bg shadow px-4 flex items-center">
        <header
            class="flex sm:flex-col flex-row sm:justify-normal justify-between sm:py-4 h-full flex-1 items-center *:shrink-0 sm:gap-y-[3.5rem] sm:mt-[1rem] sm:mx-0 mx-[0.5rem]">

            <!-- 分配面试时间 -->
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div class="flex items-center group" :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'">
                        <div class="relative flex items-center select-none">
                            <div
                                class="absolute right-full translate-y-[0.3rem] mb-2 mr-1 px-3 py-2 bg-[#272727] dark:text-[#FEFCE4] text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                                分配面试时间
                            </div>
                            <Timer class="inline-block w-7 h-7 dark:text-[#FEFCE4]" />
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent v-if="!isDisabled" :side="isSmUp ? 'left' : undefined"
                    class="mb-[0.9rem] sm:mb-0 sm:mr-[0.3rem] dark:bg-[#18181A] dark:text-[#FEFCE4] font-bold ">
                    <DropdownMenuLabel>
                        <span class="select-none font-bold">分配面试时间</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <template v-for="(round, idx) in interviewRounds" :key="idx">
                        <DropdownMenuItem @mousedown.prevent @click="round.onClick" class="cursor-pointer mt-[0.5rem]">
                            <FileClock class="w-5 h-5 translate-y-[0.06rem] dark:text-[#FEFCE4]" />
                            <span>{{ round.name }}</span>
                        </DropdownMenuItem>
                    </template>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- 修改面试状态 -->
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div class="flex items-center group" :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'">
                        <div class="relative flex items-center select-none">
                            <div
                                class="absolute right-full translate-y-[0.3rem] mb-2 mr-1 px-3 py-2 bg-[#272727] dark:text-[#FEFCE4] text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                                修改面试状态
                            </div>
                            <FilePen class="inline-block w-6 h-6 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent v-if="!isDisabled" :side="isSmUp ? 'left' : undefined"
                    class="mb-[0.9rem] sm:mb-0 sm:mr-[0.3rem] dark:bg-[#18181A] dark:text-[#FEFCE4] font-bold ">
                    <DropdownMenuLabel>
                        <span class="select-none font-bold">将面试状态修改为</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('通过')"
                        class="cursor-pointer mt-[0.5rem]">
                        <CircleCheckBig class="w-5 h-5 translate-y-[0.06rem] dark:text-[#50B48C]" />
                        <span>通过</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('未通过')"
                        class="cursor-pointer mt-[0.5rem]">
                        <CircleOff class="w-5 h-5 translate-y-[0.06rem] dark:text-[#DC5A5A]" />
                        <span>未通过</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('进行中')"
                        class="cursor-pointer mt-[0.5rem]">
                        <LoaderCircle class="w-5 h-5 translate-y-[0.06rem] dark:text-[#F0C864]" />
                        <span>进行中</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- 发送结果邮件 -->
            <div class="flex items-center group" :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
                @click="!isDisabled && (showMail = true)">
                <div class="relative flex items-center select-none">
                    <div
                        class="absolute right-full translate-y-[0.3rem] mb-2 mr-1 px-3 py-2 bg-[#272727] dark:text-[#FEFCE4] text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                        发送结果邮件
                    </div>
                    <Mail class="inline-block w-6 h-6 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                </div>
            </div>

        </header>

        <AlertDialog v-model:open="showDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认将面试状态修改为{{ selectStatus }}？</AlertDialogTitle>
                    <AlertDialogDescription>
                        该操作将使面试者得知其面试状态为{{ selectStatus }}。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="showDialog = false">取消</AlertDialogCancel>
                    <AlertDialogAction @click="showDialog = false">确认</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <SendMail v-model:open="showMail" />

    </div>
    <TimeTabs v-model:open="showTimeTabs" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Timer, FilePen, CircleCheckBig, LoaderCircle, CircleOff, FileClock, Mail } from 'lucide-vue-next'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import SendMail from '@/components/sendMail.vue'
import TimeTabs from '@/components/timeTabs.vue'

const showDialog = ref(false)
const showTimeTabs = ref(false)
const selectStatus = ref('')
const showMail = ref(false)
const isSmUp = ref(window.matchMedia('(min-width: 640px)').matches)

const props = defineProps<{ checkedIds: string[] }>()
const isDisabled = computed(() => !props.checkedIds || props.checkedIds.length === 0)

function openTimeTabs() {
    showTimeTabs.value = true
}

function handleStatusClick(status: string) {
    selectStatus.value = status
    showDialog.value = true
}

const interviewRounds = [
    { name: '一面', onClick: () => openTimeTabs() },
    { name: '溜面', onClick: () => openTimeTabs() },
    { name: '三面', onClick: () => openTimeTabs() },
]
</script>

<style scoped>
.header-bg {
    background: linear-gradient(180.00deg, rgba(14, 16, 15, 0), rgba(14, 16, 15, 1) 100%);
    backdrop-filter: blur(2px);
}
</style>