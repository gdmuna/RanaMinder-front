<template>
    <div
        class="fixed sm:top-14 bottom-0 right-0 sm:h-full h-14 sm:w-auto w-full header-bg shadow px-4 flex items-center">
        <header
            class="flex sm:flex-col flex-row sm:justify-normal justify-between sm:py-4 h-full flex-1 items-center *:shrink-0 sm:gap-y-[3.5rem] sm:mt-[1rem] sm:mx-0 mx-[0.5rem]">

            <!-- 分配面试时间 -->
            <div class="flex items-center group" :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
                @click="!isDisabled && openStatusDialog()">
                <div class="relative flex items-center select-none">
                    <div
                        class="absolute right-full translate-y-[0.3rem] mb-2 mr-1 px-3 py-2 bg-[#272727] dark:text-[#FEFCE4] text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                        分配面试时间
                    </div>
                    <Timer class="inline-block w-6 h-6 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                </div>
            </div>

            <!-- 修改面试状态 -->
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div class="flex items-center group" :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'">
                        <div class="relative flex items-center select-none">
                            <div
                                class="absolute right-full translate-y-[0.3rem] mb-2 mr-1 px-3 py-2 bg-[#272727] dark:text-[#FEFCE4] text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                                修改面试状态
                            </div>
                            <FilePen class="inline-block w-6 h-6 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent v-if="!isDisabled" :side="isSmUp ? 'left' : undefined"
                    class="mb-[0.9rem] sm:mb-0 sm:mr-[0.3rem] dark:bg-[#18181A] dark:text-[#FEFCE4] font-bold ">
                    <DropdownMenuLabel>
                        <span class="select-none font-bold">将面试状态修改为</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('通过')"
                        class="cursor-pointer mt-[0.5rem]">
                        <CircleCheckBig class="w-5 h-5 translate-y-[0.06rem] dark:text-[#50B48C]" />
                        <span>通过</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('未通过')"
                        class="cursor-pointer mt-[0.5rem]">
                        <CircleOff class="w-5 h-5 translate-y-[0.06rem] dark:text-[#DC5A5A]" />
                        <span>未通过</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem @mousedown.prevent @click="handleStatusClick('进行中')"
                        class="cursor-pointer mt-[0.5rem]">
                        <LoaderCircle class="w-5 h-5 translate-y-[0.06rem] dark:text-[#F0C864]" />
                        <span>进行中</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <!-- 发送结果邮件 -->
            <div class="flex items-center group" :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
                @click="!isDisabled && (showMail = true)">
                <div class="relative flex items-center select-none">
                    <div
                        class="absolute right-full translate-y-[0.3rem] mb-2 mr-1 px-3 py-2 bg-[#272727] dark:text-[#FEFCE4] text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
                        发送结果邮件
                    </div>
                    <Mail class="inline-block w-6 h-6 dark:text-[#FEFCE4] translate-y-[0.1rem]" />
                </div>
            </div>

        </header>

        <AlertDialog v-model:open="showDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认将面试状态修改为{{ selectStatus }}？</AlertDialogTitle>
                    <AlertDialogDescription>
                        该操作将使面试者得知其面试状态为{{ selectStatus }}。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="showDialog = false">取消</AlertDialogCancel>
                    <AlertDialogAction @click="showDialog = false">确认</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <SendMail v-model:open="showMail" :checkedIds="checkedIds" />

    </div>
    <StatusDialog v-model:open="statusDialog" :result="dialogData" @select="handleTimeSlotSelect" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Timer, FilePen, CircleCheckBig, LoaderCircle, CircleOff, FileClock, Mail } from 'lucide-vue-next'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import SendMail from '@/components/sendMail.vue'
import TimeTabs from '@/components/timeTabs.vue'
import StatusDialog from "@/components/statusDialog.vue"
import { nextTick } from 'vue'
const statusDialog = ref(false)

const showDialog = ref(false)
const showTimeTabs = ref(false)
const selectStatus = ref('')
const showMail = ref(false)
const isSmUp = ref(window.matchMedia('(min-width: 640px)').matches)

const props = defineProps<{ campaignId: number; checkedIds: string[] }>();
const campaignId = computed(() => props.campaignId);
const isDisabled = computed(() => !props.checkedIds || props.checkedIds.length === 0);

// 监视checkedIds变化
watch(() => props.checkedIds, (newIds: string[]) => {
    console.log('底部栏接收到的勾选ID列表:', newIds);
    console.log('底部栏按钮状态:', isDisabled.value ? '禁用' : '启用');
}, { deep: true })

function handleStatusClick(status: string) {
    selectStatus.value = status
    showDialog.value = true
    console.log('修改面试状态为:', status);
}

import { useInterviewStore } from '@/stores/interview'
const interviewStore = useInterviewStore()
const { getAllTimeSlotsByCampaignId } = interviewStore

async function getAllTimeSlots(campaignId: number) {
    let timeSlots: any[] = [];
    try {
    const res = await getAllTimeSlotsByCampaignId(campaignId) as any;
        if (res && res.data && Array.isArray(res.data.time_slots)) {
            timeSlots = res.data.time_slots;
        } else {
            console.warn('未获取到时间段数据', res);
            return [];
        }
        if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
            console.warn('未获取到时间段数据', timeSlots);
            return [];
        }
    } catch (err) {
        console.error('获取时间段失败', err);
        return [];
    }

    // 格式化为指定结构
    const result: any = {};
    for (const slot of timeSlots) {
        const stage = slot.session?.stage;
        const session = slot.session;
        if (!stage || !session) continue;
        // 活动ID
        const campaignId = stage.campaign_id;
        const campaignText = stage.title || '';
        if (!result[campaignId]) {
            result[campaignId] = {
                campaignId,
                campaignText,
                stages: {}
            };
        }
        // 环节ID
        const stageId = stage.id;
        if (!result[campaignId].stages[stageId]) {
            result[campaignId].stages[stageId] = {
                id: stageId,
                title: stage.title,
                sessions: {}
            };
        }
        // 场次ID
        const sessionId = session.id;
        if (!result[campaignId].stages[stageId].sessions[sessionId]) {
            result[campaignId].stages[stageId].sessions[sessionId] = {
                id: sessionId,
                title: session.title,
                timeSlots: []
            };
        }
        // 时间段
        result[campaignId].stages[stageId].sessions[sessionId].timeSlots.push({
            id: slot.id,
            start_time: slot.start_time,
            end_time: slot.end_time,
            max_seats: slot.max_seats
        });
    }
    return result;
}

const result = ref<any>({});

// 获取环节列表，明确类型
interface Stage {
    id: number;
    title: string;
    sessions: Record<string, any>;
}
const stageList = computed<Stage[]>(() => {
    if (!campaignId.value || !result.value[campaignId.value]) return [];
    return Object.values(result.value[campaignId.value].stages || {}) as Stage[];
});

// 点击分配面试时间时获取时间段
const dialogData = ref<any>(null);

async function openStatusDialog() {
    const res = await getAllTimeSlots(campaignId.value);
    result.value = res || {}; // 保存完整结果
    dialogData.value = res || {}; // 设置弹窗专用数据
    console.log('父组件传递给弹窗的数据:', dialogData.value);
    statusDialog.value = true;
}

// 处理时间段选择
async function handleTimeSlotSelect(selection: { stage: any, session: any, slot: any }) {
    console.log('选择的时间段:', selection);
    
    if (!selection.slot || !selection.slot.id || props.checkedIds.length === 0) {
        console.warn('没有选择时间段或没有选中的用户');
        return;
    }
    
    // 为每个选中的用户分配时间段
    for (const userId of props.checkedIds) {
        try {
            const result = await interviewStore.assignTimeSlot({
                userId: parseInt(userId),
                timeSlotId: selection.slot.id
            });
            console.log(`用户 ${userId} 分配时间段结果:`, result);
        } catch (error) {
            console.error(`为用户 ${userId} 分配时间段失败:`, error);
        }
    }
}
</script>

<style scoped>
.header-bg {
    background: linear-gradient(180.00deg, rgba(14, 16, 15, 0), rgba(14, 16, 15, 1) 100%);
    backdrop-filter: blur(2px);
}
</style>