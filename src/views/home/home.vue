<template>
    <div class="w-[100vw] h-[100vh]">
        <div class="flex bg-[#0E100F]">
            <!-- 左侧区域 -->
            <div class="w-2/5 h-[100vh]">
            </div>

            <!-- 右侧区域 -->
            <div class="w-3/5 h-[100vh]">
                <div class="flex flex-col items-center justify-center space-y-[3rem]">
                    <functionCard title="人员管理" subtitle="PERSONNEL MANAGEMENT" sideLabel="PERSONNEL" :icon="UsersRound"
                        backgroundColor="#575C82" link="/personnel" />
                    <functionCard title="面试管理" subtitle="INTERVIEW MANAGEMENT" sideLabel="INTERVIEW" :icon="FileUser"
                        backgroundColor="#A98467" link="/interview" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import functionCard from '@/components/functionCard.vue'
import { UsersRound, FileUser } from 'lucide-vue-next';
</script>

<style scoped>
@import './home.css';
</style>