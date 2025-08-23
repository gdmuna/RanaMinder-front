<template>
    <div class="fixed bottom-0 left-0 w-full h-12 bg-white dark:bg-[#0E100F] shadow px-4 flex items-center">
        <header class="flex h-full flex-1 items-center justify-between *:shrink-0 px-[2.5rem]">

            <!-- 分配面试时间 -->
            <div class="flex items-center cursor-pointer group" @click="">
                <div class="relative flex items-center">
                    <div
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#272727] text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap md:hidden">
                        分配面试时间
                    </div>
                    <Timer class="inline-block w-5 h-5 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                </div>
                <Button variant="link"
                    class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4] hidden md:block translate-y-[-0.2rem]">分配面试时间</Button>
            </div>

            <!-- 修改面试状态 -->
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div class="flex items-center cursor-pointer group">
                        <div class="relative flex items-center">
                            <div
                                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#272727] text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap md:hidden">
                                修改面试状态
                            </div>
                            <FilePen class="inline-block w-5 h-5 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                        </div>
                        <Button variant="link"
                            class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4] hidden md:block translate-y-[-0.2rem]">修改面试状态</Button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="mb-[0.7rem] dark:bg-[#18181A] dark:text-[#FEFCE4] font-bold ">
                    <DropdownMenuLabel><span class="select-none font-bold">将面试状态修改为</span></DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('通过')" class="cursor-pointer">
                        <CircleCheckBig class="w-5 h-5 translate-y-[0.06rem] dark:text-[#50B48C]" />
                        <span>通过</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('未通过')" class="cursor-pointer">
                        <CircleOff class="w-5 h-5 translate-y-[0.06rem] dark:text-[#DC5A5A]" />
                        <span>未通过</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('进行中')" class="cursor-pointer">
                        <LoaderCircle class="w-5 h-5 translate-y-[0.06rem] dark:text-[#F0C864]" />
                        <span>进行中</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- 发送结果邮件 -->
            <div class="flex items-center cursor-pointer group" @click="showMail = true">
                <div class="relative flex items-center">
                    <div
                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#272727] text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap md:hidden">
                        发送结果邮件
                    </div>
                    <Mail class="inline-block w-5 h-5 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                </div>
                <Button variant="link"
                    class="cursor-pointer p-2 text-lg dark:text-[#FEFCE4] hidden md:block translate-y-[-0.2rem]">发送结果邮件</Button>
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
</template>

<script setup lang="ts">
import Search from '@/components/search.vue'
// 导入 Vue 相关库和组件
import { onMounted, ref, computed, openBlock } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// 导入 Pinia 相关库
import { storeToRefs } from 'pinia'

// 导入 shadcn UI 组件
import { Button } from '@/components/ui/button'

// 导入图标
import { Github } from 'lucide-vue-next';
import { LogIn } from 'lucide-vue-next';
import { Smile } from 'lucide-vue-next';
import { Mail } from 'lucide-vue-next';
import { Sun } from 'lucide-vue-next';
import { Moon } from 'lucide-vue-next';
import { CalendarFold } from 'lucide-vue-next';
import { Timer } from 'lucide-vue-next';
import { FilePen } from 'lucide-vue-next';
import { CircleCheckBig } from 'lucide-vue-next';
import { LoaderCircle } from 'lucide-vue-next';
import { CircleOff } from 'lucide-vue-next';

import boundary from '@/assets/boundary.svg'

import { gsap } from 'gsap'

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
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import SendMail from '@/components/sendMail.vue'

const showDialog = ref(false)

const selectStatus = ref('')
function handleStatusClick(status: string) {
    selectStatus.value = status
    showDialog.value = true
}

const showMail = ref(false)

// 导入状态管理
import { useSystemStore } from '@/stores/system'
const systemStore = useSystemStore()

const { isDark } = storeToRefs(systemStore)
const { toggleTheme } = systemStore

const logo1 = ref<HTMLImageElement | null>(null)
const logo2 = ref<HTMLImageElement | null>(null)

onMounted((): void => {
    logoAnimate.init()
})

const disableSwitchTheme = computed(() => {
    return router.currentRoute.value.path === '/'
})

function routerGoTo(path: string): void {
    router.push(path)
}

const logoAnimate = {
    tl: null as gsap.core.Timeline | null,
    init() {
        this.tl = gsap.timeline({
            repeat: -1
        })
        this.tl.fromTo(
            logo1.value,
            {
                y: 0
            },
            {
                y: '-120%',
                duration: 0.75,
                ease: 'power2.in',
                delay: 2
            }
        )
        this.tl.fromTo(
            logo2.value,
            {
                y: '120%'
            },
            {
                y: 0,
                duration: 0.75,
                ease: 'power2.out'
            },
            '-=0.25'
        )
        this.tl.fromTo(
            logo2.value,
            {
                y: 0
            },
            {
                y: '-120%',
                duration: 0.75,
                ease: 'power2.in',
                delay: 2
            }
        )
        this.tl.fromTo(
            logo1.value,
            {
                y: '120%'
            },
            {
                y: 0,
                duration: 0.75,
                ease: 'power2.out'
            },
            '-=0.25'
        )
        gsap.set(logo1.value, { y: 0 });
        gsap.set(logo2.value, { y: '100%' });
    }
}



</script>

<style scoped>
.join-us-button {
    background: linear-gradient(90deg, #27C93F, #53B7DE);
    box-shadow: 0em 0.1em 0.5em rgba(39, 201, 63, 0.3);
    transition: box-shadow 0.2s ease;
}

.join-us-button:hover {
    box-shadow: 0 0.2em 1em rgba(39, 201, 63, 0.4);
}
</style>