<template>
    <div class="h-screen w-full flex bg-[#0E100F]">
        <!-- 左侧区域 -->
        <div class="h-full w-2/5 flex items-center justify-start relative overflow-hidden">
            <!-- 蓝色背景 -->
            <div class="absolute inset-0 bg-[#3D536D] rounded-tr-lg rounded-br-lg"></div>
            <!-- 黑色背景 -->
            <div class="absolute bottom-0 right-0 w-[80%] h-[80%] bg-[#0E100F] rounded-lg"></div>
            <!-- 绿色背景 -->
            <div class="absolute bottom-0 right-0 w-[73%] h-[72%] bg-[#4F6B6F] rounded-lg"></div>
            <!-- 猫猫阴影 -->
            <img src="@/assets/cat-shadow.svg" alt="cat-shadow"
                class="absolute top-10 left-[-27%] max-w-[105%] pointer-events-none select-none" />
            <!-- 底部文字内容 -->
            <div class="relative flex items-start mt-15 ml-5 w-full select-none">
                <!-- 艺术字 -->
                <div class="relative text-6xl xl:text-7xl font-black tracking-[0.2em] !pointer-events-none mb-4 mt-135">
                    <div class="relative z-30">
                        <h1 class="text-[#FEFCE4]">NA&ACM</h1>
                    </div>
                    <div class="absolute top-0 left-0 translate-x-[1.8%] translate-y-[1.8%] text-[#0E100F] z-20">
                        <h1>NA&ACM</h1>
                    </div>
                    <div class="absolute top-0 left-0 translate-x-[2.5%] translate-y-[4%] z-10">
                        <h1 class="text-[#FEFCE4]">NA&ACM</h1>
                    </div>
                    <div class="w-45 xl:w-60 h-1 bg-[#FEFCE4] mt-5 ml-1"></div>
                </div>
                <!-- 欢迎文字 -->
                <div class="hidden 2xl:flex flex-col justify-center 2xl:ml-10 2xl:w-auto 2xl:mt-137">
                    <div class="text-base xl:text-[13px] font-bold text-[#C4C4C4]">Welcome</div>
                    <div class="text-sm xl:text-[11px] font-bold text-[#C4C4C4] mb-4">管理中心 • RanaMinder</div>
                    <div class="w-10 h-0.5 bg-[#C4C4C4]"></div>
                </div>
            </div>
        </div>
        <!-- 右侧区域 -->
        <div class="h-full w-3/5 flex flex-col">
            <!-- 滚动文字 -->
            <div class="mt-[-30px] mb-[60px]">
                <MarqueeText text="RANAMINDER" :duration="60" :repeatCount="6"/>
            </div>
            <!-- 功能卡片 -->
            <div class="flex flex-col items-center justify-center gap-8">
                <functionCard title="人员管理" subtitle="PERSONNEL MANAGEMENT" sideLabel="PERSONNEL" :icon="UsersRound"
                    backgroundColor="#656A8B" link="/personnel" />
                <functionCard title="面试管理" subtitle="INTERVIEW MANAGEMENT" sideLabel="INTERVIEW" :icon="FileUser"
                    backgroundColor="#AF8E73" link="/interview" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import functionCard from '@/components/functionCard.vue'
import { UsersRound, FileUser } from 'lucide-vue-next';
import MarqueeText from '@/components/ui/MarqueeText.vue'
</script>

<style scoped>
@import './home.css';
</style>