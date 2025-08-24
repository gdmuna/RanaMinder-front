<template>
    <div class="w-full flex flex-col dark:text-[#FEFCE4] min-h-screen">
        <!-- 页眉 -->
        <Header />
        <!-- 消息弹窗挂载点 -->
        <Toaster />
        <!-- 滚动进度条 -->
        <div ref="scroll_progress" class="fixed z-40 top-0 left-0 w-1 md:w-2 h-[100dvh] page-scroll-progress" />
        <!-- 主内容区 -->
        <main id="content" class="flex-1">
            <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">

// 导入 vue-sonner
import { Toaster } from 'vue-sonner'

// 导入组件
import Header from '@/components/header.vue'

import { onMounted, onBeforeMount, ref } from 'vue'

import { ScrollSmoother } from "gsap/ScrollSmoother";

import { useRouter } from 'vue-router'

import { useSystemStore } from '@/stores/system'
import { storeToRefs } from 'pinia'

import { nextTick } from 'vue'

const scroll_progress = ref<HTMLElement | null>(null)

const systemStore = useSystemStore()
const { initTheme, forceToggleTheme } = systemStore
const { isDark } = storeToRefs(systemStore)

const previousIsDark = ref(isDark.value)

const smoother = ref<ScrollSmoother | null>(null)

// 动态设置根元素字体大小
function setRootFontSize() {
    const html = document.documentElement;
    const val = Math.max((html.clientWidth / 1280) * 12, 16)
    console.log(val)
    html.style.fontSize = val + 'px'

}
window.addEventListener('resize', setRootFontSize);

onBeforeMount(() => {
    // 初始化根字体大小
    setRootFontSize();
    initTheme();
    if (localStorage.getItem('isDark') === 'true') {
        previousIsDark.value = true
    } else {
        previousIsDark.value = false
    }
})

const router = useRouter()

onMounted(async () => {
    // 初始化 GSAP ScrollSmoother
    smoother.value = ScrollSmoother.create({
        wrapper: '#app',
        content: '#content',
        smooth: 0.75,
        // smoothTouch: 0,
        onUpdate: (self: any) => {
            const progress = self.progress
            scroll_progress.value!.style.clipPath = `inset(0 0 ${100 - progress * 100}% 0)`;
        },
    })
    // 路由跳转后重置滚动进度
    // router.beforeEach(() => {
    //     // 立即滚动到顶部
    //     smoother.scrollTo(0, false)
    //     // if (from.path !== '/') {
    //     //     previousIsDark.value = isDark.value
    //     // }
    //     // if (from.path === '/' && previousIsDark.value === false) {
    //     //     forceToggleTheme(`${previousIsDark.value}`)
    //     // }
    //     nextTick(() => {
    //         return true
    //     })
    // })
    // if (!isXlDesktop.value) {
    //     toast.info('建议在大屏设备上使用本网站以获得最佳体验喵~', { duration: 5000 });
    // }
    // await initUserInfo()
})


</script>


<style scoped>
.page-scroll-progress {
    background: linear-gradient(0deg, #D5C8B0, #0E100F);
    clip-path: inset(0 0 100% 0);
}
</style>