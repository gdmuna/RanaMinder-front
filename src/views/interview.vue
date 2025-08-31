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
        <!-- 编辑面试弹窗 -->
        <teleport to="body">
            <Transition name="fade">
                <div v-if="showEdit"
                    class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end"
                    @click.stop.self="closeEdit">
                    <InterviewCreate :deliverClose="closeEdit" :isEdit="true" :editData="editData" />
                </div>
            </Transition>
        </teleport>
    </div>
</template>

<script setup lang="ts">
// 逻辑代码
import { ref, onMounted, onBeforeUnmount } from 'vue';
import InterviewShow from '@/components/interviewShow.vue';
import NewInterview from '@/components/newInterview.vue';
import InterviewCreate from '@/components/interviewCreate.vue';
import { useRouter } from 'vue-router';
import InterviewApply from '@/components/interviewApply.vue';
import type { Campaign } from '@/types/interview'

import { useInterviewStore } from '@/stores/interview';
const interviewStore = useInterviewStore();

const loading = ref(false);
const showEdit = ref(false)

const editData = ref<Campaign | null>(null)

async function handleEdit(id: number) {
    try {
        
        // 1. 获取面试基本信息（本地缓存）
        const campaign = interviewStore.campaigns.find(item => item.id === id)
        if (!campaign) {
            return;
        }
        

        // 2. 查询环节
        let stages: any[] = [];
        try {
            const stageRes = await interviewStore.getStage(id);
            stages = stageRes?.stages || [];
        } catch (err) {
            console.error('获取环节数据失败:', err);
            // 即使获取环节失败，也继续执行
        }

        // 如果没有获取到环节数据，创建一个默认环节
        if (!stages || stages.length === 0) {
            stages = [{
                id: -1, // 使用临时ID
                title: '默认环节',
                description: '请填写环节描述',
                is_required: false,
                sessions: []
            }];
        }

        // 3. 查询每个环节的场次和时间段
        for (const stage of stages) {
            try {
                if (stage.id > 0) { // 只有有效ID才查询场次
                    const sessionRes = await interviewStore.getSession(stage.id);
                    (stage as any).sessions = sessionRes?.sessions || [];
                } else {
                    (stage as any).sessions = [];
                }
                
                // 如果没有场次数据，创建默认场次
                if (!stage.sessions || stage.sessions.length === 0) {
                    (stage as any).sessions = [{
                        id: -1,
                        title: '默认场次',
                        start_time: formatDateString(new Date()),
                        end_time: formatDateString(new Date(Date.now() + 3600000)), // 一小时后
                        location: '请填写场次地点',
                        timeSlots: []
                    }];
                }
                
                for (const session of (stage as any).sessions) {
                    try {
                        if (session.id > 0) { // 只有有效ID才查询时间段
                            const timeSlotRes = await interviewStore.getTimeSlot(session.id);
                            (session as any).timeSlots = timeSlotRes?.timeSlots || [];
                        } else {
                            (session as any).timeSlots = [];
                        }
                        
                        // 如果没有时间段数据，创建默认时间段
                        if (!session.timeSlots || session.timeSlots.length === 0) {
                            (session as any).timeSlots = [{
                                id: -1,
                                start_time: formatDateString(new Date()),
                                end_time: formatDateString(new Date(Date.now() + 1800000)), // 半小时后
                                max_seats: 10
                            }];
                        }
                    } catch (err) {
                        console.error('获取时间段数据失败:', err);
                        // 设置默认时间段
                        (session as any).timeSlots = [{
                            id: -1,
                            start_time: formatDateString(new Date()),
                            end_time: formatDateString(new Date(Date.now() + 1800000)), // 半小时后
                            max_seats: 10
                        }];
                    }
                }
            } catch (err) {
                console.error('获取场次数据失败:', err);
                // 设置默认场次
                (stage as any).sessions = [{
                    id: -1,
                    title: '默认场次',
                    start_time: formatDateString(new Date()),
                    end_time: formatDateString(new Date(Date.now() + 3600000)), // 一小时后
                    location: '请填写场次地点',
                    timeSlots: [{
                        id: -1,
                        start_time: formatDateString(new Date()),
                        end_time: formatDateString(new Date(Date.now() + 1800000)), // 半小时后
                        max_seats: 10
                    }]
                }];
            }
        }

        // 4. 组装 editData
        editData.value = {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            isActive: campaign.isActive,
            deleteAt: campaign.deleteAt,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            stages
        } as any;
        
        showEdit.value = true;
    } catch (error) {
        console.error('处理编辑操作失败:', error);
    }
}

// 日期格式化辅助函数
function formatDateString(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function closeEdit() {
    showEdit.value = false
    editData.value = null
}

async function fetchInterviews(page = 1) {
    if (loading.value) return;
    loading.value = true;
    await interviewStore.getCampaignList(page);
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