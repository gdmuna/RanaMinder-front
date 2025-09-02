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
                    <InterviewModify 
                        v-else 
                        :deliverClose="closeModify" 
                        :campaignId="(editData?.id as number)" 
                        :stages="editData?.stages"
                        :isEdit="true"
                        :editData="editData" 
                    />
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

// 格式化日期函数，统一格式为 yyyy-MM-ddThh:mm 格式
function formatDateForInput(dateString: string | Date): string {
    if (!dateString) return '';

    let date: Date;
    if (typeof dateString === 'string') {
        // 处理 MySQL 格式: "YYYY-MM-DD HH:MM:SS"
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
            date = new Date(dateString.replace(' ', 'T'));
        } 
        // 处理ISO格式: "YYYY-MM-DDTHH:MM:SS.sssZ"
        else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString)) {
            date = new Date(dateString);
        } 
        // 处理简单日期格式: "YYYY-MM-DD"
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            const dateParts = dateString.split('-');
            date = new Date(
                parseInt(dateParts[0]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[2]),
                0, 0, 0
            );
        } 
        // 尝试直接解析其他格式
        else {
            date = new Date(dateString);
        }
        
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            return formatDateForInput(new Date());
        }
    } else {
        date = dateString;
    }

    // 格式化为 yyyy-MM-ddThh:mm 格式
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 格式化面试数据，统一字段名和格式
function formatInterviewData(data: any) {
    if (!data) return null;
    
    const { campaign, stages } = data;
    
    // 1. 格式化面试基本信息
    const formattedCampaign = {
        ...campaign,
        // 统一字段名称和格式
        startTime: formatDateForInput(campaign.startDate || campaign.start_date || new Date()),
        endTime: formatDateForInput(campaign.endDate || campaign.end_date || new Date()),
        isActive: campaign.isActive || campaign.is_active || false
    };
    
    // 2. 格式化环节信息
    const formattedStages = stages.map((stage: any) => {
        // 格式化环节数据
        const formattedStage = {
            ...stage,
            title: stage.title || '默认环节',
            description: stage.description || '请添加环节描述',
            isRequired: stage.isRequired || stage.is_required || false,
        };
        
        // 格式化场次数据
        if (stage.sessions && stage.sessions.length > 0) {
            formattedStage.sessions = stage.sessions.map((session: any) => {
                const formattedSession = {
                    ...session,
                    title: session.title || '默认场次',
                    location: session.location || '请添加场次地点',
                    startTime: formatDateForInput(session.startTime || session.start_time || new Date()),
                    endTime: formatDateForInput(session.endTime || session.end_time || new Date(Date.now() + 3600000)),
                };
                
                // 格式化时间段数据
                if (session.timeSlots && session.timeSlots.length > 0) {
                    formattedSession.timeSlots = session.timeSlots.map((slot: any) => {
                        return {
                            ...slot,
                            startTime: formatDateForInput(slot.startTime || slot.start_time || new Date()),
                            endTime: formatDateForInput(slot.endTime || slot.end_time || new Date(Date.now() + 1800000)),
                            maxSeats: Number(slot.maxSeats || slot.max_seats || 10)
                        };
                    });
                } else {
                    // 添加默认时间段
                    formattedSession.timeSlots = [{
                        startTime: formatDateForInput(new Date()),
                        endTime: formatDateForInput(new Date(Date.now() + 1800000)),
                        maxSeats: 10
                    }];
                }
                
                return formattedSession;
            });
        } else {
            // 添加默认场次
            formattedStage.sessions = [{
                title: '默认场次',
                startTime: formatDateForInput(new Date()),
                endTime: formatDateForInput(new Date(Date.now() + 3600000)),
                location: '请添加场次地点',
                timeSlots: [{
                    startTime: formatDateForInput(new Date()),
                    endTime: formatDateForInput(new Date(Date.now() + 1800000)),
                    maxSeats: 10
                }]
            }];
        }
        
        return formattedStage;
    });
    
    return { campaign: formattedCampaign, stages: formattedStages };
}

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

    // 4. 格式化数据
    const formattedData = formatInterviewData({ campaign, stages });
    
    // 返回格式化后的结果，供其他组件使用
    return formattedData;
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
    // 查询完整流程数据并获取格式化后的数据
    const flowData = await fetchInterviewFlow(id);
    if (flowData) {
        // 使用格式化后的数据
        editData.value = { ...flowData.campaign, stages: flowData.stages };
        console.log('格式化后的编辑数据:', editData.value);
        loading.value = false;
        showModify.value = true;
    } else {
        loading.value = false;
    }
}


const formData = reactive<InterviewForm>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isActive: false,
    stages: [
        {
            title: '',
            description: '',
            isRequired: false,
            sessions: [
                {
                    title: '',
                    startTime: '',
                    endTime: '',
                    location: '',
                    timeSlots: [
                        {
                            startTime: '',
                            endTime: '',
                            maxSeats: 1,
                        }
                    ]
                }
            ]
        }
    ]
})

interface InterviewForm {
    title: string
    description: string
    startTime: string
    endTime: string
    isActive: boolean
    stages: Stage[]
}

interface Stage {
    title: string
    description: string
    isRequired: boolean
    sessions: Session[]
}

interface Session {
    title: string
    startTime: string
    endTime: string
    location: string
    timeSlots: TimeSlot[]
}

interface TimeSlot {
    startTime: string
    endTime: string
    maxSeats: number
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