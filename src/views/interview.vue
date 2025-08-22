<template>
    <div class="flex flex-col items-center mt-[5rem] mb-[2rem]">
        <div v-for="(item, index) in interviews" :key="item.id" class="mb-8">
            <InterviewShow :id="item.id" :title="item.title" :time="item.time" :style="{
                '--main-color': colors[index % colors.length],
                '--main-gradient': gradients[index % gradients.length]
            }" @view-detail="goToInfo" @apply="goToApply" />

        </div>
        <!-- 新增面试 -->
        <NewInterview @click="showCreate = true" />
        
        <!-- 新增面试弹窗 -->
        <teleport to="body">
            <Transition name="fade">
                <div v-if="showCreate"
                    class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end "
                    @click.self="closeCreate">
                    <InterviewCreate :deliverClose="closeCreate" />
                </div>
            </Transition>
        </teleport>
        <!-- 编辑申请表弹窗 -->
        <teleport to="body">
            <Transition name="fade">
                <div v-if="showApply"
                    class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end "
                    @click.self="closeApply">
                    <InterviewApply v-if="currentInterviewId !== null" :id="currentInterviewId"
                        :deliverClose="closeApply" />
                </div>
            </Transition>
        </teleport>
    </div>
</template>

<script setup lang="ts">
// 逻辑代码
import { ref, watch } from 'vue';
import InterviewShow from '@/components/interviewShow.vue';
import NewInterview from '@/components/newInterview.vue';
import { useRouter } from 'vue-router';
import InterviewCreate from '@/components/interviewCreate.vue';
import InterviewApply from '@/components/interviewApply.vue';

// 路由
const router = useRouter();
// 新增面试弹窗
const showCreate = ref(false)
// 申请表弹窗
const showApply = ref(false)
// 申请表id
const currentInterviewId = ref<number | null>(null)

// 伪数据
const interviews = [
    { id: 1, title: '2024年干事招新面试干事招新面试', time: new Date('2024-09-12T14:00:00') },
    { id: 2, title: '2024年干部招新', time: new Date('2024-12-13T10:30:00') },
    { id: 3, title: '2025年干事招新', time: new Date('2025-09-14T09:00:00') },
    { id: 4, title: '2025年干部招新', time: new Date('2025-12-15T16:00:00') },
    { id: 5, title: '2026年干事招新', time: new Date('2026-09-16T15:00:00') },
    { id: 6, title: '2026年干部招新', time: new Date('2026-12-17T17:00:00') },
];
// 颜色
const colors = ['#0A90B4', '#A6C1EE', '#C4E0E5', '#FCB69F', '#71B280', '#DECBA4'];
// 渐变色
const gradients = [
    'linear-gradient(270deg, #71B280 0%, #0A90B4 100%)',
    'linear-gradient(270deg, #FBC2EB 0%, #A6C1EE 100%)',
    'linear-gradient(270deg, #4CA1AF 0%, #C4E0E5 100%)',
    'linear-gradient(270deg, #FCB69F 0%, #FFECD2 100%)',
    'linear-gradient(270deg, #71B280 0%, #FBC2EB 100%)',
    'linear-gradient(270deg, #DECBA4 0%, #BDC3C7 100%)',
];

watch(showApply, (Val) => {
    if (Val) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

function goToInfo(id: number) {
    router.push({ name: 'interviewInformation', params: { id } });
}

function goToApply(id: number) {
    console.log('申请表模板 id:', id);
    currentInterviewId.value = id; // 保存当前面试id
    showApply.value = true;
}

function closeCreate() {
    showCreate.value = false
}

function closeApply() {
    showApply.value = false
    currentInterviewId.value = null // 关闭弹窗时清空id
}

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.30s cubic-bezier(.4, 0, .2, 1),
        transform 0.30s cubic-bezier(.4, 0, .2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(40px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>