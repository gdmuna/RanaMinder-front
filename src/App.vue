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

import Lenis from 'lenis'

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

// 初始化 Lenis
onMounted(() => {
    const lenis = new Lenis({
        autoRaf: true,
        duration: 1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        infinite: false,
    });

    // lenis.on('scroll', (e) => {
    //     console.log(e);
    // });

    // 挂载到 window，方便其他组件访问
    (window as any).lenis = lenis

    // 滚动进度条逻辑
    function updateScrollProgress() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        if (scroll_progress.value) {
            scroll_progress.value.style.clipPath = `inset(0 0 ${100 - percent * 100}% 0)`;
        }
    }

    window.addEventListener('scroll', updateScrollProgress);
    nextTick(updateScrollProgress);
});

</script>


<style scoped>
.page-scroll-progress {
    background: linear-gradient(0deg, #D5C8B0, #0E100F);
    clip-path: inset(0 0 100% 0);
}
</style>