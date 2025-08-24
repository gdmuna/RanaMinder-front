<template>
    <!-- 顶部导航栏容器 -->
    <div class="fixed top-0 left-0 w-full h-14 header-bg z-50 px-4 lg:flex lg:items-center select-none
    pointer-events-none lg:*:pointer-events-none *:pointer-events-auto">
        <!-- 移动端顶部：左侧菜单按钮 + 登录按钮 -->
        <div v-if="!isDesktop" class="size-full flex items-center justify-between">
            <ChartNoAxesGantt class="shrink-0 size-8 cursor-pointer" @click="headerAnimate.toggle()" />
            <!-- 搜索 -->
            <Search />
            <div class="flex items-center space-x-4">
                <!-- <primaryButton v-if="!isAuthenticated" class="cursor-pointer border-2 lg:w-auto w-full" @click="login">
                    <div class="flex items-center space-x-2 text-[1rem]">
                        <span>登录</span>
                        <LogIn class="size-6" />
                    </div>
                </primaryButton> -->
                <div class="flex items-center space-x-2 text-[1rem]">
                    <span>登录</span>
                    <LogIn class="size-6" />
                </div>
            </div>
        </div>
        <!-- 侧边栏/主导航区 -->
        <header ref="headerRef"
            class="flex lg:flex-row flex-col lg:h-full h-[100dvh] lg:w-full w-[min(24rem,70dvw)] -translate-x-full lg:-translate-x-0
        lg:items-center items-start lg:justify-between justify-start *:shrink-0 z-60 lg:p-0 p-3 space-y-4 lg:space-y-0 will-change-transform overscroll-contain
        overflow-x-auto *:pointer-events-auto relative -top-14 lg:-top-0 -left-4 lg:-left-0 lg:bg-transparent bg-[#0E100F]">
            <!-- 页眉左侧内容区域 -->
            <div class="flex lg:flex-row flex-col lg:h-full lg:items-center lg:w-auto w-full space-y-4 lg:space-y-0">
                <!-- LOGO区（含动画切换） -->
                <div class="flex items-center lg:h-full lg:p-0 p-3 rounded-lg lg:dark:bg-transparent dark:bg-[#1f1e1e]">
                    <div class="relative overflow-hidden cursor-pointer shrink-0 text-lg font-bold"
                        @click="router.push('/'), headerAnimate.toggle()">
                        <div ref="logo1" class="space-x-2 flex items-center will-change-transform">
                            <img src="/src/assets/gdmuna-logo_gradient.svg" alt=""
                                class="lg:size-10 size-12 will-change-transform">
                            <p class="mr-6 Association-NA">GDMU-NA</p>
                        </div>
                        <div ref="logo2"
                            class="absolute top-0 left-0 whitespace-nowrap space-x-1 flex items-center will-change-transform">
                            <img src="/src/assets/ACM-LOGO 1.svg" alt=""
                                class="lg:size-10 size-12 will-change-transform">
                            <p class="whitespace-nowrap Association-ACM">GDMU-ACM</p>
                        </div>
                    </div>
                    <ChartNoAxesGantt v-if="!isDesktop" class="shrink-0 size-8 cursor-pointer ml-auto"
                        @click="headerAnimate.toggle()" />
                </div>
                <!-- 移动端分隔线 -->
                <div v-if="!isDesktop" class="w-full h-[1px] dark:bg-neutral-600" @click="headerAnimate.toggle()" />
                <!-- 网站导航菜单区 -->
                <div class="lg:dark:bg-transparent dark:bg-[#191a19] lg:p-0 p-3 rounded-lg">
                    <h2 v-if="!isDesktop" class="text-2xl mb-4 text-center text-[#D5C8B0]">网站导航</h2>
                    <nav class="flex lg:flex-row flex-col lg:h-full ml-0 lg:items-center whitespace-nowrap lg:p-0 px-6 lg:space-x-4 lg:space-y-0 space-y-2
                        lg:dark:text-[#FEFCE4] dark:text-[#0E100F]">
                        <!-- 动态导航菜单项 -->
                        <template v-for="(item, index) in routeMeta" :key="index">
                            <div class="lg:p-0 p-2 lg:dark:bg-transparent dark:bg-[#FEFCE4] rounded cursor-pointer"
                                @click="router.push(item.path), headerAnimate.toggle()">
                                <outlineText v-show="isDesktop" :text="item.label" :keep-in-end="item.active"
                                    class="md:text-xl nav-item hover:text-blue-400 duration-300 w-fit"
                                    :class="[item.active ? 'text-blue-400' : '']" line-color="#51A2FF"
                                    transition-line-color />
                                <div v-show="!isDesktop" class="md:text-xl flex items-center space-x-2">
                                    <component :is="item.icon" class="size-6" />
                                    <p>{{ item.label }}</p>
                                </div>
                            </div>
                            <!-- 菜单项分隔符 -->
                            <img v-if="isDesktop && index < routeMeta.length - 1" :src="boundary" alt=""
                                class="shrink-0">
                        </template>
                    </nav>
                </div>
            </div>
            <!-- 移动端分隔线 -->
            <div v-if="!isDesktop" class="w-full h-[1px] dark:bg-neutral-600" />
            <!-- 页眉右侧内容区域 -->
            <div class="lg:ml-6 ml-0 flex lg:flex-row flex-col items-center lg:w-auto w-full space-y-4 lg:space-y-0">
                <!-- 主题切换/快捷操作区 -->
                <!-- <div class="flex lg:flex-row flex-col lg:items-center lg:gap-2 lg:space-y-0 space-y-2 rounded-lg
                lg:dark:bg-transparent dark:bg-[#191a19] lg:w-auto w-full lg:p-0 p-3">
                    <toggleThemeButton :disabled="disableSwitchTheme" :model-value="isDark"
                        @update:model-value="toggleTheme" class="cursor-pointer dark:bg-[#FEFCE4]">
                        <template #thumb>
                            <Moon v-if="isDark" class="size-5" />
                            <Sun v-else class="size-5" />
                        </template>
                    </toggleThemeButton>
                </div> -->
                <!-- 右侧操作区 -->
                <div v-if="isDesktop" class="flex lg:flex-row flex-col lg:items-center items-start lg:space-x-4 lg:w-auto w-full lg:p-0 p-3
                lg:space-y-0 space-y-2 lg:dark:bg-transparent dark:bg-[#1f1e1e] rounded-lg">
                    <!-- 搜索 -->
                    <Search />
                    <img v-if="isDesktop" :src="boundary" alt="" class="ml-2 mr-4 shrink-0">
                    <!-- <primaryButton v-if="!isAuthenticated" class="cursor-pointer border-2 lg:w-auto w-full"
                        @click="login">
                        <div class="flex items-center space-x-2 text-[1rem]">
                            <span>登录</span>
                            <LogIn class="size-6" />
                        </div>
                    </primaryButton> -->
                    <div class="flex items-center space-x-2 text-[1rem]">
                        <span>登录</span>
                        <LogIn class="size-6" />
                    </div>
                </div>
            </div>
        </header>
        <!-- 遮罩层动画（移动端侧边栏展开时显示） -->
        <transition name="bg">
            <div v-if="!isDesktop && isEnter" class="fixed inset-0 w-[100dvw] h-[100dvh] bg-[#0E100F]/50 z-30"
                @click="headerAnimate.toggle" />
        </transition>
    </div>
</template>

<script setup lang="ts">

// 导入 Vue 相关库和组件
import { onMounted, ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useSystemStore } from '@/stores/system'
// import { useAuthStore } from '@/stores/auth'
// import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { outlineText } from '@/components/ui/text'

import Search from '@/components/search.vue'

// 导入图标
import {
    Github,
    LogIn,
    Smile,
    Mail,
    Sun,
    Moon,
    CalendarFold,
    ChartNoAxesGantt,
    House,
    Megaphone,
    Newspaper,
    Youtube,
    Database
} from 'lucide-vue-next'

import boundary from '@/assets/boundary.svg'

import { gsap } from 'gsap'

import { useRoute } from 'vue-router'
const route = useRoute()

// 只保留 systemStore 状态管理
const systemStore = useSystemStore()
const { isDark, isDesktop } = storeToRefs(systemStore)
const { toggleTheme } = systemStore

const router = useRouter()

onMounted((): void => {
    logoAnimate.init()
    document.addEventListener('keyup', handleKeyup);
})

onUnmounted((): void => {
    document.removeEventListener('keyup', handleKeyup);
    logoAnimate.tl.kill()
    headerAnimate.tl.kill()
})

function handleKeyup(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !isDesktop.value) {
        headerAnimate.toggle()
    }
}

const disableSwitchTheme = computed(() => {
    return router.currentRoute.value.path === '/'
})

const routeMeta = ref([
    {
        label: '首页',
        path: '/home',
        active: false,
        icon: House
    },
    {
        label: '人员管理',
        path: '/person',
        active: false,
        icon: Megaphone
    },
    {
        label: '面试管理',
        path: '/interview',
        active: false,
        icon: Newspaper
    }
])

// const authStore = useAuthStore()
// const { isAuthenticated } = storeToRefs(authStore)
// const { login } = authStore

// const userStore = useUserStore()
// const { userInfo } = storeToRefs(userStore)

const logo1 = ref<HTMLImageElement | null>(null)
const logo2 = ref<HTMLImageElement | null>(null)

const logoAnimate = {
    tl: gsap.timeline({ repeat: -1 }),
    init() {
        this.tl.fromTo(
            logo1.value,
            {
                y: 0
            },
            {
                y: '-120%',
                duration: 0.75,
                ease: 'power2.in',
                delay: 5
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
                delay: 5
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

// “加入我们”相关动画及变量已移除

const headerRef = ref<HTMLElement | null>(null)
const isEnter = ref(false)

watch(isDesktop, (newVal) => {
    if (newVal) {
        headerAnimate.tl.kill()
        headerAnimate.tl.clear()
        headerRef.value && gsap.set(headerRef.value, { x: 0 })
        isEnter.value = false
    } else {
        headerRef.value && gsap.set(headerRef.value, { x: '-100%' })
    }
})

const headerAnimate = {
    tl: gsap.timeline(),
    toggle() {
        if (isDesktop.value) return
        this.tl.clear()
        if (isEnter.value) {
            this.tl.to(headerRef.value, {
                x: '-100%',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            this.tl.to(headerRef.value, {
                x: 0,
                duration: 0.3,
                ease: 'power2.out'
            })
        }
        isEnter.value = !isEnter.value
    }
}

watch(() => route.name, (newVal) => {
    switch (newVal) {
        case 'home':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/home'
            })
            break
        case 'person':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/person'
            })
            break
        case 'interview':
            routeMeta.value.forEach(item => {
                item.active = item.path === '/interview'
            })
            break
        default:
            routeMeta.value.forEach(item => {
                item.active = false
            })
            break
    }
})

</script>

<style scoped>
.btn-bg-1 {
    background: linear-gradient(90deg, #27C93F, #53B7DE);
    box-shadow: 0em 0.1em 0.5em rgba(39, 201, 63, 0.3);
}

.btn-bg-2 {
    background: linear-gradient(105deg, #53b7de, #4cbfce, #58c4ba, #71c6a6, #8dc694, #a8c486, #c0c080);
}

.header-bg {
    background: linear-gradient(180.00deg, rgba(14, 16, 15, 1), rgba(14, 16, 15, 0) 100%);
    backdrop-filter: blur(2px);
}

.nav-item-active {
    text-shadow: 0 0 8px #0d407a
}

.Association-NA {
    background: linear-gradient(90deg, rgba(117, 168, 237, 1), rgba(146, 219, 242, 1) 50%, rgba(210, 210, 247, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.Association-ACM {
    background: linear-gradient(90.00deg, rgba(199, 73, 105, 1), rgba(238, 140, 102, 1) 43%, rgba(163, 212, 222, 1) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.bg-enter-active,
.bg-leave-active {
    transition: opacity 0.2s ease;
}

.bg-leave-active {
    pointer-events: none;
}

.bg-enter-from,
.bg-leave-to {
    opacity: 0;
}
</style>
