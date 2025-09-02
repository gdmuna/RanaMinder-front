<template>
    <div data-lenis-prevent
        class="flex flex-col items-center md:justify-center justify-end min-h-screen w-full overflow-y-auto">
        <div class="rounded-t-lg dark:bg-[#A3A2A0] text-[#000000] md:w-[22rem] min-w-[35%] w-full">
            <div class="w-full h-13 flex">
                <div class="px-6 py-5 cursor-pointer flex items-center"
                    @click="props.deliverClose && props.deliverClose()">
                    <Minimize2 :size="22" />
                </div>
                <div class="rounded-tr-lg w-full h-13"></div>
            </div>
        </div>
        <div
            class="will-change-transform overflow-y-auto scrollbar-hide rounded-b-lg xl:p-6 p-5 dark:bg-[#E8E7E2] dark:text-[#000000] select-none md:w-auto min-w-[35%] w-full max-h-[75%] h-auto">
            <form @submit="onSubmit" class="space-y-8">
                <!-- 面试基础信息 -->

                <FormField name="title" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel
                            class="text-sm font-bold tracking-wide bg-[#8FAFC4] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                            面试标题
                        </FormLabel>
                        <FormControl>
                            <Input v-bind="componentField"
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="description" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel
                            class="text-sm font-bold tracking-wide bg-[#D48587] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                            面试描述
                        </FormLabel>
                        <FormControl>
                            <Textarea v-bind="componentField"
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="startTime" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel
                            class="text-sm font-bold tracking-wide bg-[#C490BD] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                            开始时间
                        </FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField"
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="endTime" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel
                            class="text-sm font-bold tracking-wide bg-[#8EB38A] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                            结束时间
                        </FormLabel>
                        <FormControl>
                            <Input type="datetime-local" v-bind="componentField"
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField name="isActive" type="checkbox" v-slot="{ componentField }">
                    <FormItem>
                        <FormLabel
                            class="text-sm font-bold tracking-wide bg-[#E6A5A0] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                            启动面试</FormLabel>
                        <FormControl>
                            <Switch v-bind="componentField" :value="undefined"
                                class="data-[state=checked]:bg-[#50C878]" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <!-- 面试环节 -->
                <div>
                    <div class="flex justify-between items-center">
                        <span
                            class="text-sm font-bold tracking-wide bg-[#b0d1c1] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">面试环节</span>
                        <div
                            class="flex  gap-1 text-sm font-bold tracking-wide bg-[#8FB6D1] rounded-lg px-[0.7rem] py-[0.3rem] w-auto text-[#f0eeee] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                            <CirclePlus class="w-5 h-5" />
                            <div @click="addStage">添加环节</div>
                        </div>
                    </div>

                    <div v-for="(stage, sIndex) in formData.stages" :key="sIndex"
                        class="border border-[#817f75a2] p-4 mt-4 rounded-lg space-y-4">
                        <div class="flex justify-between items-center">
                            <h1
                                class="text-sm font-bold tracking-wide bg-[#e6c492] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[4rem]">
                                环节 {{ sIndex + 1 }}</h1>
                            <div v-if="sIndex !== 0"
                                class="flex  gap-1 text-sm font-bold tracking-wide bg-[#A06B6B] rounded-lg px-[0.7rem] py-[0.3rem] w-auto text-[#f0eeee] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                                <CircleX class="w-5 h-5" />
                                <div @click="removeStage(sIndex)">
                                    删除环节
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <!-- 环节标题 -->
                            <FormField :name="`stages[${sIndex}].title`" v-slot="{ componentField }">
                                <FormItem>
                                    <FormLabel
                                        class="text-sm font-bold tracking-wide bg-[#B6E3C4] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                                        环节标题
                                    </FormLabel>
                                    <FormControl>
                                        <Input v-bind="componentField"
                                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <!-- 环节描述 -->
                            <FormField :name="`stages[${sIndex}].description`" v-slot="{ componentField }">
                                <FormItem>
                                    <FormLabel
                                        class="text-sm font-bold tracking-wide bg-[#EDC7DB] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                                        环节描述
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea v-bind="componentField"
                                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <!-- 进入环节 -->
                            <FormField :name="`stages[${sIndex}].isRequired`" type="checkbox"
                                v-slot="{ componentField }">
                                <FormItem>
                                    <FormLabel
                                        class="text-sm font-bold tracking-wide bg-[#E6CAA5] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                                        进入环节
                                    </FormLabel>
                                    <FormControl>
                                        <Switch v-bind="componentField"
                                            class="data-[state=checked]:bg-[#50C878] mt-1" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                        </div>

                        <!-- 场次 -->
                        <div class="mt-9">
                            <div class="flex justify-between items-center">
                                <h1
                                    class="text-sm font-bold tracking-wide bg-[#A79679] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[3.2rem]">
                                    场次</h1>
                                <div
                                    class="flex gap-1 text-sm font-bold tracking-wide bg-[#8FB6D1] rounded-lg px-[0.7rem] py-[0.3rem] w-auto text-[#f0eeee] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                                    <CirclePlus class="w-5 h-5" />
                                    <div @click="addSession(sIndex)">添加场次</div>
                                </div>
                            </div>

                            <div v-for="(session, seIndex) in stage.sessions" :key="seIndex"
                                class="border border-[#817f75a2] p-3 mt-3 rounded-lg  space-y-4">
                                <div class="flex justify-between items-center">
                                    <h1
                                        class="text-sm font-bold tracking-wide bg-[#C1DBAB] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[4rem]">
                                        场次 {{ seIndex + 1 }}</h1>
                                    <div v-if="seIndex !== 0"
                                        class="flex  gap-1 text-sm font-bold tracking-wide bg-[#A06B6B] rounded-lg px-[0.7rem] py-[0.3rem] w-auto text-[#f0eeee] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                                        <CircleX class="w-5 h-5" />
                                        <div @click="removeSession(sIndex, seIndex)">删除场次</div>
                                    </div>
                                </div>

                                <FormField :name="`stages[${sIndex}].sessions[${seIndex}].title`"
                                    v-slot="{ componentField }">
                                    <FormItem>
                                        <FormLabel
                                            class="text-sm font-bold tracking-wide bg-[#BBB16A] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                                            场次标题
                                        </FormLabel>
                                        <FormControl>
                                            <Input v-bind="componentField"
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>

                                <FormField :name="`stages[${sIndex}].sessions[${seIndex}].location`"
                                    v-slot="{ componentField }">
                                    <FormItem>
                                        <FormLabel
                                            class="text-sm font-bold tracking-wide bg-[#85c29b] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.1rem]">
                                            场次地点
                                        </FormLabel>
                                        <FormControl>
                                            <Input v-bind="componentField"
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>

                                <FormField :name="`stages[${sIndex}].sessions[${seIndex}].startTime`"
                                    v-slot="{ componentField }">
                                    <FormItem>
                                        <FormLabel
                                            class="text-sm font-bold tracking-wide bg-[#DBAAB4] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6.8rem]">
                                            场次开始时间
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" v-bind="componentField"
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>

                                <FormField :name="`stages[${sIndex}].sessions[${seIndex}].endTime`"
                                    v-slot="{ componentField }">
                                    <FormItem>
                                        <FormLabel
                                            class="text-sm font-bold tracking-wide bg-[#E4E1A0] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[6.8rem]">
                                            场次结束时间
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" v-bind="componentField"
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>

                                <!-- 时间段 -->
                                <div class="mt-9">
                                    <div class="flex justify-between items-center">
                                        <h1
                                            class="text-sm font-bold tracking-wide bg-[#9FC5B3] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[4.1rem]">
                                            时间段</h1>
                                        <div
                                            class="flex  gap-1 text-sm font-bold tracking-wide bg-[#8FB6D1] rounded-lg px-[0.7rem] py-[0.3rem] w-auto text-[#f0eeee] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                                            <CirclePlus class="w-5 h-5" />
                                            <div @click="addTimeSlot(sIndex, seIndex)">添加时间段</div>
                                        </div>
                                    </div>

                                    <div v-for="(slot, tIndex) in session.timeSlots" :key="tIndex"
                                        class="border border-[#817f75a2] p-2 mt-2 rounded-lg space-y-4">
                                        <div class="flex justify-between">
                                            <h1
                                                class="text-sm font-bold tracking-wide bg-[#D8A7C5] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5rem]">
                                                时间段 {{ tIndex + 1 }}</h1>
                                            <div v-if="tIndex !== 0"
                                                class="flex  gap-1 text-sm font-bold tracking-wide bg-[#A06B6B] rounded-lg px-[0.7rem] py-[0.3rem] w-auto text-[#f0eeee] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                                                <CircleX class="w-5 h-5" />
                                                <div @click="removeTimeSlot(sIndex, seIndex, tIndex)">删除时间段</div>
                                            </div>
                                        </div>

                                        <FormField
                                            :name="`stages[${sIndex}].sessions[${seIndex}].timeSlots[${tIndex}].maxSeats`"
                                            v-slot="{ componentField }">
                                            <FormItem>
                                                <FormLabel
                                                    class="text-sm font-bold tracking-wide bg-[#A0DFDA] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[5.9rem]">
                                                    最大座位数
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="number" v-bind="componentField"
                                                        class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </FormField>

                                        <FormField
                                            :name="`stages[${sIndex}].sessions[${seIndex}].timeSlots[${tIndex}].startTime`"
                                            v-slot="{ componentField }">
                                            <FormItem>
                                                <FormLabel
                                                    class="text-sm font-bold tracking-wide bg-[#C1A7D8] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[7.7rem]">
                                                    时间段开始时间
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" v-bind="componentField"
                                                        class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </FormField>

                                        <FormField
                                            :name="`stages[${sIndex}].sessions[${seIndex}].timeSlots[${tIndex}].endTime`"
                                            v-slot="{ componentField }">
                                            <FormItem>
                                                <FormLabel
                                                    class="text-sm font-bold tracking-wide bg-[#E6A5A0] rounded-[999px] px-[0.7rem] py-[0.3rem] w-[7.7rem]">
                                                    时间段结束时间
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" v-bind="componentField"
                                                        class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </FormField>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 按钮 -->
                <div class="flex justify-between">
                    <Button type="reset"
                        class="mt-5 dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                        @click="resetForm">
                        重置</Button>
                    <Button type="submit"
                        class="mt-5 dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                        提交</Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from '@/components/ui/switch'
import { Button } from "@/components/ui/button"
import { CirclePlus } from 'lucide-vue-next';
import { CircleX } from 'lucide-vue-next';
import { Minimize2 } from 'lucide-vue-next'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { h, markRaw } from 'vue'
import * as z from 'zod'
import { toast } from 'vue-sonner';
import { formatDateTime } from '@/lib/utils';

import { ref, onMounted, onUnmounted, watch } from 'vue'

import { useInterviewStore } from '@/stores/interview'

const interviewStore = useInterviewStore()
// 定义编辑数据和编辑状态
const editData = ref<any>(null)
const showEdit = ref(false)

onMounted(() => {
    document.body.style.overflow = 'hidden'
    
    // 如果是编辑模式且有完整editData
    if (props.isEdit && props.editData) {
        console.log('初始化编辑表单数据:', props.editData);
        initFormWithEditData(props.editData);
    } 
    // 否则，尝试使用单独传入的stages
    else if (props.stages && props.stages.length > 0) {
        formData.stages = props.stages.map(stage => ({
            title: stage.title,
            description: stage.description,
            isRequired: stage.isRequired ?? stage.is_required,
            sessions: (stage.sessions || []).map((session: any) => ({
                title: session.title,
                startTime: session.startTime ?? session.start_time,
                endTime: session.endTime ?? session.end_time,
                location: session.location,
                timeSlots: (session.timeSlots || []).map((slot: any) => ({
                    startTime: slot.startTime ?? slot.start_time,
                    endTime: slot.endTime ?? slot.end_time,
                    maxSeats: slot.maxSeats ?? slot.max_seats
                }))
            }))
        }));
    }
})

onUnmounted(() => {
    document.body.style.overflow = ''
})

const props = defineProps<{ 
    deliverClose?: () => void; 
    campaignId?: number; 
    stages?: any[];
    isEdit?: boolean;
    editData?: any 
}>()

const formData = reactive<InterviewForm>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    isActive: false,
    stages: []
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

// 添加日期格式化函数（用于将日期对象或ISO字符串转为input可用的格式）
function formatDateForInput(dateString: string | Date): string {
    if (!dateString) return ''

    console.log('格式化日期输入:', dateString, typeof dateString);
    
    let date: Date;
    
    if (typeof dateString === 'string') {
        // 1. 处理 MySQL 格式: "YYYY-MM-DD HH:MM:SS"
        if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
            console.log('检测到 MySQL 日期格式:', dateString);
            try {
                const parts = dateString.split(' ');
                const dateParts = parts[0].split('-');
                const timeParts = parts[1].split(':');
                
                // 使用正确的构造函数参数顺序
                date = new Date(
                    parseInt(dateParts[0]),      // 年
                    parseInt(dateParts[1]) - 1,  // 月 (0-11)
                    parseInt(dateParts[2]),      // 日
                    parseInt(timeParts[0]),      // 时
                    parseInt(timeParts[1]),      // 分
                    parseInt(timeParts[2])       // 秒
                );
                console.log('解析 MySQL 日期结果:', date, '时间戳:', date.getTime());
            } catch (err) {
                console.error('MySQL 日期解析错误:', err);
                // 尝试备用解析方法
                date = new Date(dateString.replace(' ', 'T'));
            }
        } 
        // 2. 处理ISO格式: "YYYY-MM-DDTHH:MM:SS.sssZ"
        else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateString)) {
            console.log('检测到 ISO 日期格式:', dateString);
            date = new Date(dateString);
        } 
        // 3. 处理简单日期格式: "YYYY-MM-DD"
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            console.log('检测到简单日期格式:', dateString);
            const dateParts = dateString.split('-');
            date = new Date(
                parseInt(dateParts[0]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[2]),
                0, 0, 0
            );
        } 
        // 4. 尝试直接解析其他格式
        else {
            console.log('尝试直接解析日期:', dateString);
            date = new Date(dateString);
        }
        
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            console.error('无效的日期格式:', dateString);
            // 返回当前日期作为后备
            return formatDateForInput(new Date());
        }
    } else {
        date = dateString;
        console.log('处理Date对象:', date);
    }

    // 格式化为 yyyy-MM-ddThh:mm 格式（适用于datetime-local输入框）
    const pad = (n: number) => n < 10 ? '0' + n : n;

    const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    console.log('格式化结果:', formatted);
    return formatted;
}

// 添加一个初始化表单的函数
function initFormWithEditData(data: any) {
    console.log('初始化编辑表单数据:', JSON.stringify(data));
    
    // 创建一个新的表单数据对象
    const newFormData = {
        title: data.title || '',
        description: data.description || '',
        startTime: formatDateForInput(data.startTime || data.startDate || data.start_date || new Date()),
        endTime: formatDateForInput(data.endTime || data.endDate || data.end_date || new Date()),
        isActive: data.isActive || data.is_active || false,
        stages: [] as Stage[]
    };

    console.log('表单基础数据初始化完成:', newFormData);

    // 环节数据填充
    if (data.stages && data.stages.length > 0) {
        console.log(`处理 ${data.stages.length} 个环节数据`);
        
        // 处理每个环节
        data.stages.forEach((stage: any, stageIndex: number) => {
            console.log(`处理环节 ${stageIndex + 1}:`, stage);
            
            const newStage: Stage = {
                title: stage.title || '默认环节',
                description: stage.description || '请添加环节描述',
                isRequired: stage.isRequired || stage.is_required || false,
                sessions: []
            };
            
            // 处理场次数据
            if (stage.sessions && stage.sessions.length > 0) {
                console.log(`环节 ${stageIndex + 1} 包含 ${stage.sessions.length} 个场次`);
                
                stage.sessions.forEach((session: any, sessionIndex: number) => {
                    console.log(`处理环节 ${stageIndex + 1} 的场次 ${sessionIndex + 1}:`, session);
                    
                    const startTime = session.startTime || session.start_time || new Date();
                    const endTime = session.endTime || session.end_time || new Date(Date.now() + 3600000);
                    
                    console.log('场次原始时间:', { 
                        startTime, 
                        endTime, 
                        startTimeType: typeof startTime, 
                        endTimeType: typeof endTime 
                    });
                    
                    const formattedStartTime = formatDateForInput(startTime);
                    const formattedEndTime = formatDateForInput(endTime);
                    
                    console.log('场次格式化后时间:', { 
                        formattedStartTime, 
                        formattedEndTime 
                    });
                    
                    const newSession: Session = {
                        title: session.title || '默认场次',
                        startTime: formattedStartTime,
                        endTime: formattedEndTime,
                        location: session.location || '请添加场次地点',
                        timeSlots: []
                    };
                    
                    // 处理时间段数据
                    if (session.timeSlots && session.timeSlots.length > 0) {
                        console.log(`场次 ${sessionIndex + 1} 包含 ${session.timeSlots.length} 个时间段`);
                        
                        session.timeSlots.forEach((slot: any, slotIndex: number) => {
                            console.log(`处理环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 的时间段 ${slotIndex + 1}:`, slot);
                            
                            // 获取时间段的开始和结束时间（处理多种可能的属性名）
                            const slotStartTime = slot.startTime || slot.start_time || new Date();
                            const slotEndTime = slot.endTime || slot.end_time || new Date(Date.now() + 1800000);
                            
                            console.log('时间段原始时间:', { 
                                slotStartTime, 
                                slotEndTime, 
                                startTimeType: typeof slotStartTime, 
                                endTimeType: typeof slotEndTime 
                            });
                            
                            // 格式化时间
                            const formattedSlotStartTime = formatDateForInput(slotStartTime);
                            const formattedSlotEndTime = formatDateForInput(slotEndTime);
                            
                            console.log('时间段格式化后时间:', { 
                                formattedSlotStartTime, 
                                formattedSlotEndTime 
                            });
                            
                            const newTimeSlot: TimeSlot = {
                                startTime: formattedSlotStartTime,
                                endTime: formattedSlotEndTime,
                                maxSeats: Number(slot.maxSeats || slot.max_seats || 10)
                            };
                            
                            newSession.timeSlots.push(newTimeSlot);
                        });
                    } else {
                        console.log(`场次 ${sessionIndex + 1} 没有时间段数据，创建默认时间段`);
                        // 添加默认时间段
                        newSession.timeSlots.push({
                            startTime: formatDateForInput(new Date()),
                            endTime: formatDateForInput(new Date(Date.now() + 1800000)), // 30分钟后
                            maxSeats: 10
                        });
                    }
                    
                    newStage.sessions.push(newSession);
                });
            } else {
                console.log(`环节 ${stageIndex + 1} 没有场次数据，创建默认场次`);
                // 添加默认场次
                const defaultSession: Session = {
                    title: '默认场次',
                    startTime: formatDateForInput(new Date()),
                    endTime: formatDateForInput(new Date(Date.now() + 3600000)), // 1小时后
                    location: '请添加场次地点',
                    timeSlots: [{
                        startTime: formatDateForInput(new Date()),
                        endTime: formatDateForInput(new Date(Date.now() + 1800000)), // 30分钟后
                        maxSeats: 10
                    }]
                };
                newStage.sessions.push(defaultSession);
            }
            
            newFormData.stages.push(newStage);
        });
    } else {
        console.log('没有环节数据，创建默认环节');
        // 添加默认环节
        newFormData.stages.push({
            title: '默认环节',
            description: '请添加环节描述',
            isRequired: false,
            sessions: [{
                title: '默认场次',
                startTime: formatDateForInput(new Date()),
                endTime: formatDateForInput(new Date(Date.now() + 3600000)), // 1小时后
                location: '请添加场次地点',
                timeSlots: [{
                    startTime: formatDateForInput(new Date()),
                    endTime: formatDateForInput(new Date(Date.now() + 1800000)), // 30分钟后
                    maxSeats: 10
                }]
            }]
        });
    }
    
    console.log('最终处理后的表单数据:', newFormData);
    
    // 更新响应式数据
    Object.assign(formData, newFormData);
    
    // 更新表单值（这是关键步骤）
    setValues(newFormData);
}

function addStage() {
    formData.stages.push({
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
    })
}

function removeStage(index: number) {
    formData.stages.splice(index, 1)
}

function addSession(stageIndex: number) {
    formData.stages[stageIndex].sessions.push({
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
    })
}

function removeSession(stageIndex: number, sessionIndex: number) {
    formData.stages[stageIndex].sessions.splice(sessionIndex, 1)
}

function addTimeSlot(stageIndex: number, sessionIndex: number) {
    formData.stages[stageIndex].sessions[sessionIndex].timeSlots.push({
        startTime: '',
        endTime: '',
        maxSeats: 1,
    })
}

function removeTimeSlot(stageIndex: number, sessionIndex: number, slotIndex: number) {
    formData.stages[stageIndex].sessions[sessionIndex].timeSlots.splice(slotIndex, 1)
}

function resetForm() {
    veeResetForm({
        values: {
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
        }
    })
}

const formSchema = toTypedSchema(z.object({
    title: z.string({ required_error: '面试标题不能为空' }).min(1, '面试标题不能为空'),
    description: z.string({ required_error: '面试描述不能为空' }).min(1, '面试描述不能为空'),
    startTime: z.string({ required_error: '开始时间不能为空' }).min(1, '开始时间不能为空'),
    endTime: z.string({ required_error: '结束时间不能为空' }).min(1, '结束时间不能为空'),
    isActive: z.boolean().optional(),
    stages: z.array(
        z.object({
            title: z.string({ required_error: '环节标题不能为空' }).min(1, '环节标题不能为空'),
            description: z.string({ required_error: '环节描述不能为空' }).min(1, '环节描述不能为空'),
            isRequired: z.boolean().optional(),
            sessions: z.array(
                z.object({
                    title: z.string({ required_error: '场次标题不能为空' }).min(1, '场次标题不能为空'),
                    startTime: z.string({ required_error: '场次开始时间不能为空' }).min(1, '场次开始时间不能为空'),
                    endTime: z.string({ required_error: '场次结束时间不能为空' }).min(1, '场次结束时间不能为空'),
                    location: z.string({ required_error: '场次地点不能为空' }).min(1, '场次地点不能为空'),
                    timeSlots: z.array(
                        z.object({
                            startTime: z.string({ required_error: '时间段开始时间不能为空' }).min(1, '时间段开始时间不能为空'),
                            endTime: z.string({ required_error: '时间段结束时间不能为空' }).min(1, '时间段结束时间不能为空'),
                            maxSeats: z.number({ required_error: '最大座位数必须为正整数' }).min(1, '最大座位数必须为正整数'),
                        })
                    ).min(1, '至少有一个时间段')
                })
            ).min(1, '至少有一个场次')
        })
    ).min(1, '至少有一个环节')
}))

const { handleSubmit, resetForm: veeResetForm, setValues } = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
    toast(
        markRaw(
            h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
                h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
            )
        )
    )
})

// 在组件挂载后自动加载面试数据
onMounted(async () => {
    if (props.campaignId) {
        await handleEdit(props.campaignId)
    }
})

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
            const stageRes = await interviewStore.getStage(id) as { data?: { stages?: any[] } };
            stages = stageRes?.data?.stages || [];
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
                    (stage as any).sessions = (sessionRes as any)?.data?.sessions || [];
                } else {
                    (stage as any).sessions = [];
                }

                // 如果没有场次数据，创建默认场次
                if (!stage.sessions || stage.sessions.length === 0) {
                    (stage as any).sessions = [{
                        id: -1,
                        title: '默认场次',
                        start_time: formatDateTime(new Date()),
                        end_time: formatDateTime(new Date(Date.now() + 3600000)), // 一小时后
                        location: '请填写场次地点',
                        timeSlots: []
                    }];
                }

                for (const session of (stage as any).sessions) {
                    try {
                        if (session.id > 0) { // 只有有效ID才查询时间段
                            const timeSlotRes = await interviewStore.getTimeSlot(session.id);
                            console.log(`获取场次 ${session.id} 的时间段:`, timeSlotRes);

                            // 使用标准格式，只检查data字段
                            if (timeSlotRes && timeSlotRes.data && Array.isArray(timeSlotRes.data.timeSlots)) {
                                console.log(`场次 ${session.id} 的时间段数据:`, timeSlotRes.data.timeSlots);
                                // 确保转换为驼峰命名格式
                                (session as any).timeSlots = timeSlotRes.data.timeSlots.map((slot: any) => {
                                    // 打印每个时间段的具体字段，便于调试
                                    console.log('处理时间段字段:', {
                                        原始id: slot.id,
                                        原始startTime: slot.startTime,
                                        原始start_time: slot.start_time,
                                        转换后: slot.startTime || slot.start_time
                                    });
                                    
                                    return {
                                        id: slot.id,
                                        startTime: slot.startTime || slot.start_time,
                                        endTime: slot.endTime || slot.end_time,
                                        maxSeats: slot.maxSeats || slot.max_seats,
                                        bookedSeats: slot.bookedSeats || slot.booked_seats,
                                        isAvailable: slot.isAvailable || slot.is_available
                                    };
                                });
                            } else {
                                console.warn(`场次 ${session.id} 没有时间段数据或格式不正确:`, timeSlotRes);
                                (session as any).timeSlots = [];
                            }
                        } else {
                            (session as any).timeSlots = [];
                        }

                        // 如果没有时间段数据，创建默认时间段
                        if (!session.timeSlots || session.timeSlots.length === 0) {
                            console.log(`为场次 ${session.id} 创建默认时间段`);
                            (session as any).timeSlots = [{
                                id: -1,
                                startTime: formatDateTime(new Date()),
                                endTime: formatDateTime(new Date(Date.now() + 1800000)), // 半小时后
                                maxSeats: 10
                            }];
                        }
                    } catch (err) {
                        console.error('获取时间段数据失败:', err);
                        // 设置默认时间段
                        console.log(`获取时间段失败，为场次 ${session.id} 创建默认时间段`);
                        (session as any).timeSlots = [{
                            id: -1,
                            startTime: formatDateTime(new Date()),
                            endTime: formatDateTime(new Date(Date.now() + 1800000)), // 半小时后
                            maxSeats: 10
                        }];
                    }
                }
            } catch (err) {
                console.error('获取场次数据失败:', err);
                // 设置默认场次
                console.log('获取场次失败，创建默认场次和时间段');
                (stage as any).sessions = [{
                    id: -1,
                    title: '默认场次',
                    startTime: formatDateTime(new Date()),
                    endTime: formatDateTime(new Date(Date.now() + 3600000)), // 一小时后
                    location: '请填写场次地点',
                    timeSlots: [{
                        id: -1,
                        startTime: formatDateTime(new Date()),
                        endTime: formatDateTime(new Date(Date.now() + 1800000)), // 半小时后
                        maxSeats: 10
                    }]
                }];
            }
        }

        // 4. 组装 editData
        editData.value = {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            startTime: campaign.startDate,
            endTime: campaign.endDate,
            isActive: campaign.isActive,
            deleteAt: campaign.deleteAt,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            stages
        } as any;

        // 填充表单数据
        formData.title = campaign.title;
        formData.description = campaign.description;
        formData.startTime = typeof campaign.startDate === 'string' ? campaign.startDate : formatDateTime(campaign.startDate);
        formData.endTime = typeof campaign.endDate === 'string' ? campaign.endDate : formatDateTime(campaign.endDate);
        formData.isActive = campaign.isActive;
        formData.stages = stages.map((stage: any) => {
            console.log('处理环节数据:', stage);
            return {
                title: stage.title,
                description: stage.description,
                isRequired: stage.isRequired || stage.is_required,
                sessions: (stage.sessions || []).map((session: any) => {
                    console.log('处理场次数据:', session);
                    return {
                        title: session.title,
                        startTime: session.startTime || session.start_time,
                        endTime: session.endTime || session.end_time,
                        location: session.location,
                        timeSlots: (session.timeSlots || []).map((slot: any) => {
                            console.log('处理时间段数据:', slot);
                            return {
                                startTime: slot.startTime || slot.start_time,
                                endTime: slot.endTime || slot.end_time,
                                maxSeats: slot.maxSeats || slot.max_seats
                            };
                        })
                    };
                })
            };
        });

        showEdit.value = true;
        
        // 添加调试代码，验证表单数据结构
        console.log('表单数据初始化完成:', JSON.stringify(formData, null, 2));
        // 验证时间段数据
        formData.stages.forEach((stage, sIndex) => {
            stage.sessions.forEach((session, seIndex) => {
                console.log(`环节${sIndex+1}场次${seIndex+1}的时间段数据:`, session.timeSlots);
            });
        });
    } catch (error) {
        console.error('处理编辑操作失败:', error);
    }

    
}

</script>

<style scoped>
.scrollbar-hide {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari/Opera */
}
</style>