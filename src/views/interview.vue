<template>
    <div class="flex flex-col items-center mt-[5rem] mb-[2rem]">
        <div v-for="(item, index) in interviewStore.campaigns" :key="item.id" class="mb-8">
            <InterviewShow :id="item.id" :title="item.title" :time="item.startDate" :style="{
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
                    class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end"
                    @click.stop.self="closeCreate">
                    <InterviewCreate :deliverClose="closeCreate" />
                </div>
            </Transition>
        </teleport>
        <!-- 编辑申请表弹窗 -->
        <teleport to="body">
            <Transition name="fade">
                <div v-if="showApply"
                    class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end "
                    @click.stop.self="closeApply">
                    <InterviewApply v-if="currentInterviewId !== null" :id="currentInterviewId"
                        :deliverClose="closeApply" />
                </div>
            </Transition>
        </teleport>
    </div>
</template>

<script setup lang="ts">
// 逻辑代码
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import InterviewShow from '@/components/interviewShow.vue';
import NewInterview from '@/components/newInterview.vue';
import InterviewCreate from '@/components/interviewCreate.vue';
import { useRouter } from 'vue-router';
import InterviewApply from '@/components/interviewApply.vue';

import { useInterviewStore } from '@/stores/interview';
const interviewStore = useInterviewStore();

const loading = ref(false);

async function fetchInterviews(page = 1) {
    if (loading.value) return;
    loading.value = true;
    await interviewStore.getCampaignList(page);
    console.log('interviewStore.campaigns', interviewStore.campaigns);
    loading.value = false;
}

onMounted(() => {
    fetchInterviews(1);
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (
        scrollTop + windowHeight >= docHeight * 0.8 &&
        interviewStore.currentPage < interviewStore.totalPages &&
        !loading.value
    ) {
        fetchInterviews(interviewStore.currentPage + 1);
    }
}

// 路由
const router = useRouter();
// 新增面试弹窗
const showCreate = ref(false)
// 申请表弹窗
const showApply = ref(false)
// 申请表id
const currentInterviewId = ref<number | null>(null)


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

function goToInfo(id: number) {
    router.push({ name: 'interviewId', params: { id } });
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