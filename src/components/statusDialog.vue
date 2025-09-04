<template>
    <teleport to="body">
        <Transition name="fade">
            <div v-if="open"
                class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center justify-center flex-col"
                @click.self="closeDialog">
                <div class="bg-white dark:bg-[#18181A] rounded-lg shadow-lg p-6 w-[28rem] max-h-[80vh] overflow-auto">
                    <h2 class="text-xl font-bold mb-4">选择面试时间段</h2>
                    <!-- 步骤1：选择环节 -->
                    <div v-if="step === 1">
                        <div class="mb-2 font-semibold">请选择环节：</div>
                        <div class="flex flex-col gap-3">
                            <Button v-for="stage in stages" :key="stage.id" class="cursor-pointer p-2 text-lg border"
                                @click="selectStage(stage)">
                                {{ stage.title }}
                            </Button>
                        </div>
                    </div>
                    <!-- 步骤2：选择场次 -->
                    <div v-else-if="step === 2">
                        <div class="mb-2 font-semibold">请选择场次：</div>
                        <div class="flex flex-col gap-3">
                            <Button v-for="session in sessions" :key="(session as any).id"
                                class="cursor-pointer p-2 text-lg border" @click="selectSession(session)">
                                {{ (session as any).title }}
                            </Button>
                        </div>
                        <div class="mt-4 flex justify-end">
                            <Button @click="step = 1">返回</Button>
                        </div>
                    </div>
                    <!-- 步骤3：选择时间段 -->
                    <div v-else-if="step === 3" class="flex flex-col gap-3">
                        <div class="mb-2 font-semibold">请选择时间段：</div>
                        <div v-for="slot in timeSlots" :key="slot.id"
                            class="cursor-pointer p-2 text-lg border flex flex-col items-start"
                            @click="handleTimeSlotClick(slot)">
                            <span class="font-bold">{{ formatTime(slot.start_time) }} - {{ formatTime(slot.end_time)
                                }}</span>
                            <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                最大容量: {{ slot.max_seats }}人 | ID: {{ slot.id }}
                            </span>
                        </div>
                        <div class="mt-4 flex justify-end">
                            <Button @click="step = 2">返回</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
    open: boolean;
    result: any
}>()

console.log('statusDialog初始数据:', props.result)

// 监听 result 变化
watch(() => props.result, (newVal) => {
    console.log('statusDialog收到新的数据:', newVal)
}, { immediate: true, deep: true })

console.log('statusDialog收到的数据:', props.result)
const emit = defineEmits(['update:open', 'select'])

const step = ref(1)
const selectedStage = ref<any>(null)
const selectedSession = ref<any>(null)

// 解析环节
const stages = computed(() => {
    if (!props.result) return []
    const campaignObj = Object.values(props.result)[0]
    if (!campaignObj || typeof campaignObj !== 'object' || !('stages' in campaignObj) || !campaignObj.stages) return []
    return Object.values(campaignObj.stages)
})

// 解析场次
const sessions = computed(() => {
    if (!selectedStage.value) return []
    return Object.values(selectedStage.value.sessions || {})
})

// 解析时间段
const timeSlots = computed(() => {
    if (!selectedSession.value) return []
    return selectedSession.value.timeSlots || []
})

function selectStage(stage: any) {
    selectedStage.value = stage
    step.value = 2
}
function selectSession(session: any) {
    selectedSession.value = session
    step.value = 3
}
function handleTimeSlotClick(slot: any) {
    // 确保时间段ID是数字类型
    const slotWithNumericId = {
        ...slot,
        id: Number(slot.id)
    };
    
    console.log('选中的时间段:', slotWithNumericId);
    console.log('选中的时间段ID:', slotWithNumericId.id, '类型:', typeof slotWithNumericId.id);
    
    const selection = {
        stage: selectedStage.value,
        session: selectedSession.value,
        slot: slotWithNumericId
    };
    
    console.log('发送给父组件的完整selection:', selection);
    emit('select', selection);
    closeDialog();
}
function closeDialog() {
    emit('update:open', false)
    step.value = 1
    selectedStage.value = null
    selectedSession.value = null
}

function formatTime(timeStr: string) {
    console.log('原始时间:', timeStr);
    if (!timeStr) return '';
    
    // 处理ISO日期时间格式 (2025-09-01T05:51)
    if (timeStr.includes('T')) {
        try {
            const date = new Date(timeStr);
            // 格式化为 小时:分钟
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } catch (e) {
            console.error('日期解析错误:', e);
        }
    }
    
    // 如果时间格式是 HH:MM:SS 格式，只保留 HH:MM
    if (timeStr.includes(':')) {
        const formatted = timeStr.split(':').slice(0, 2).join(':');
        console.log('格式化后:', formatted);
        return formatted;
    }
    
    return timeStr;
}
</script>