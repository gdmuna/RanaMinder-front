<template>
    <div class="flex flex-col items-center mt-[5rem] mb-[2rem]">
        <div v-for="(item, index) in interviewStore.campaigns" :key="item.id" class="mb-8">
            <InterviewShow :id="item.id" :title="item.title" :time="item.startDate" :style="{
                '--main-color': colors[index % colors.length],
                '--main-gradient': gradients[index % gradients.length]
            }" @view-detail="goToInfo" @apply="goToApply" @edit="handleEdit" />
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
        <!-- 编辑面试弹窗 -->
        <teleport to="body">
            <Transition name="fade">
                <div v-if="showModify"
                    class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end"
                    @click.stop.self="closeModify">
                    <div v-if="loading" class="flex items-center justify-center w-full h-full">
                        <span class="text-lg text-gray-500">加载中...</span>
                    </div>
                    <InterviewModify v-else :deliverClose="closeModify" :campaignId="(editData?.id as number)" :stages="editData?.stages" />
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
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import InterviewShow from '@/components/interviewShow.vue';
import NewInterview from '@/components/newInterview.vue';
import InterviewCreate from '@/components/interviewCreate.vue';
import InterviewModify from '@/components/interviewModify.vue';
import { useRouter } from 'vue-router';
import InterviewApply from '@/components/interviewApply.vue';
import type { Campaign } from '@/types/interview'
import { useInterviewStore } from '@/stores/interview'

const interviewStore = useInterviewStore();

const loading = ref(false);
// 编辑弹窗数据
const editData = ref<Campaign | null>(null)

// 查询并组装全部流程
async function fetchInterviewFlow(campaignId: number) {
    // 1. 查询面试活动详情
    const campaignRes = await interviewStore.getCampaignList() as { data?: { campaigns?: any[] } };
    const campaign = campaignRes?.data?.campaigns?.find((c: any) => c.id === campaignId)
    if (!campaign) return

    // 2. 查询所有环节
    const stageRes = await interviewStore.getStage(campaignId) as { data?: { stages?: any[] } };
    const stages = stageRes?.data?.stages || []

    // 3. 查询每个环节的场次和每个场次的时间段
    for (const stage of stages) {
    const sessionRes = await interviewStore.getSession(stage.id) as { data?: { sessions?: any[] } };
    stage.sessions = sessionRes?.data?.sessions || []
        for (const session of stage.sessions) {
            const timeSlotRes = await interviewStore.getTimeSlot(session.id)
            session.timeSlots = timeSlotRes.data.timeSlots || []
        }
    }

    // 返回查询结果，供其他组件使用
    return { campaign, stages };
}

// 查询面试列表
async function fetchInterviews(page = 1) {
    if (loading.value) return;
    loading.value = true;
    await interviewStore.getCampaignList(page);
    loading.value = false;
}

// 页面挂载时只查询列表数据
onMounted(() => {
    fetchInterviews(1);
    window.addEventListener('scroll', handleScroll);
});

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
// 编辑面试弹窗
const showModify = ref(false)
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
    currentInterviewId.value = id; // 保存当前面试id
    showApply.value = true;
}

function closeCreate() {
    showCreate.value = false
}

function closeModify() {
    showModify.value = false
}

function closeApply() {
    showApply.value = false
    currentInterviewId.value = null // 关闭弹窗时清空id
}

// 处理编辑按钮点击
async function handleEdit(id: number) {
    loading.value = true;
    // 查询完整流程数据
    const flowData = await fetchInterviewFlow(id);
    if (flowData) {
        editData.value = { ...flowData.campaign, stages: flowData.stages };
        loading.value = false;
        showModify.value = true;
    } else {
        loading.value = false;
    }
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