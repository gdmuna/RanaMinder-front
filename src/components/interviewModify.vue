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
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                @blur="onFieldBlur('title', $event.target.value)" />
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
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                @blur="onFieldBlur('description', $event.target.value)" />
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
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                @blur="onFieldBlur('startTime', $event.target.value)" />
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
                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                @blur="onFieldBlur('endTime', $event.target.value)" />
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
                                class="data-[state=checked]:bg-[#50C878]"
                                @update:model-value="onSelectorChange('isActive', $event)" />
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
                                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                            @blur="onFieldBlur('title', $event.target.value, sIndex)" />
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
                                            class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                            @blur="onFieldBlur('description', $event.target.value, sIndex)" />
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
                                            class="data-[state=checked]:bg-[#50C878] mt-1"
                                            @update:modelValue="(value) => onSelectorChange('isRequired', value, sIndex)" />
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
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                                @blur="onFieldBlur('title', $event.target.value, sIndex, seIndex)" />
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
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                                @blur="onFieldBlur('location', $event.target.value, sIndex, seIndex)" />
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
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                                @blur="onFieldBlur('startTime', $event.target.value, sIndex, seIndex)" />
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
                                                class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                                @blur="onFieldBlur('endTime', $event.target.value, sIndex, seIndex)" />
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
                                                        class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                                        @blur="onFieldBlur('maxSeats', $event.target.value, sIndex, seIndex, tIndex)" />
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
                                                        class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                                        @blur="onFieldBlur('startTime', $event.target.value, sIndex, seIndex, tIndex)" />
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
                                                        class="border-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:bg-input/10"
                                                        @blur="onFieldBlur('endTime', $event.target.value, sIndex, seIndex, tIndex)" />
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
                <!-- <div class="flex justify-between">
                    <Button type="reset"
                        class="mt-5 dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                        @click="resetForm">
                        重置</Button>
                    <Button type="submit"
                        class="mt-5 dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                        提交</Button>
                </div> -->
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
import { AutoUpdateInput } from "@/components/ui/auto-update-input"
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
import { interviewApi } from '@/api/interview';
import type { stage as StageType } from '@/types/interview';

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
    id?: number
    title: string
    description: string
    isRequired: boolean
    sessions: Session[]
}

interface Session {
    id?: number
    title: string
    startTime: string
    endTime: string
    location: string
    timeSlots: TimeSlot[]
}

interface TimeSlot {
    id?: number
    startTime: string
    endTime: string
    maxSeats: number
}

// 添加日期格式化
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
                id: stage.id,
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
                        id: session.id,
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
                                id: slot.id,
                                startTime: formattedSlotStartTime,
                                endTime: formattedSlotEndTime,
                                maxSeats: Number(slot.maxSeats || slot.max_seats || 10)
                            };                            newSession.timeSlots.push(newTimeSlot);
                        });
                    } else {
                        console.log(`场次 ${sessionIndex + 1} 没有时间段数据，创建默认时间段`);
                        // 添加默认时间段
                        newSession.timeSlots.push({
                            id: undefined, // 新创建的默认时间段没有ID
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
                    id: undefined, // 新创建的默认场次没有ID
                    title: '默认场次',
                    startTime: formatDateForInput(new Date()),
                    endTime: formatDateForInput(new Date(Date.now() + 3600000)), // 1小时后
                    location: '请添加场次地点',
                    timeSlots: [{
                        id: undefined, // 新创建的默认时间段没有ID
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
    console.log('调用 addStage 函数');
    addNewStage();
}

function removeStage(index: number) {
    console.log(`调用 removeStage 函数, index = ${index}`);
    deleteStageData(index);
}

function addSession(stageIndex: number) {
    console.log(`调用 addSession 函数, stageIndex = ${stageIndex}`);
    addNewSession(stageIndex);
}

function removeSession(stageIndex: number, sessionIndex: number) {
    console.log(`调用 removeSession 函数, stageIndex = ${stageIndex}, sessionIndex = ${sessionIndex}`);
    deleteSessionData(stageIndex, sessionIndex);
}

function addTimeSlot(stageIndex: number, sessionIndex: number) {
    console.log(`调用 addTimeSlot 函数, stageIndex = ${stageIndex}, sessionIndex = ${sessionIndex}`);
    addNewTimeSlot(stageIndex, sessionIndex);
}

function removeTimeSlot(stageIndex: number, sessionIndex: number, slotIndex: number) {
    console.log(`调用 removeTimeSlot 函数, stageIndex = ${stageIndex}, sessionIndex = ${sessionIndex}, slotIndex = ${slotIndex}`);
    deleteTimeSlotData(stageIndex, sessionIndex, slotIndex);
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
    try {
        // 如果是编辑模式且存在活动ID
        if (props.isEdit && props.editData && props.editData.id) {
            console.log("开始更新面试活动, id =", props.editData.id, "表单数据:", values);
            
            // 更新面试活动
            const campaignResponse = await interviewApi.updateCampaign(props.editData.id, {
                title: values.title,
                description: values.description,
                start_date: values.startTime,
                end_date: values.endTime,
                is_active: values.isActive || false
            });
            
            console.log("面试活动更新响应:", campaignResponse);
            
            if (campaignResponse && campaignResponse.res) {
                toast.success('面试活动更新成功');
                
                // 先记录当前环节状态，方便后续操作
                console.log("当前formData环节状态:", JSON.stringify(formData.stages));
                console.log("表单提交环节状态:", JSON.stringify(values.stages));                // 更新所有环节
                for (let i = 0; i < formData.stages.length; i++) {
                    const stage = formData.stages[i];

                    // 如果环节有ID，更新环节
                    if (stage.id) {
                        // 从values更新到formData
                        stage.title = values.stages[i]?.title || stage.title;
                        stage.description = values.stages[i]?.description || stage.description;
                        stage.isRequired = values.stages[i]?.isRequired || stage.isRequired;

                        await updateStageData(stage, i);

                        // 更新该环节下的所有场次
                        for (let j = 0; j < stage.sessions.length; j++) {
                            const session = stage.sessions[j];

                            // 如果场次有ID，更新场次
                            if (session.id) {
                                // 从values更新到formData
                                if (values.stages[i]?.sessions[j]) {
                                    session.title = values.stages[i].sessions[j].title || session.title;
                                    session.startTime = values.stages[i].sessions[j].startTime || session.startTime;
                                    session.endTime = values.stages[i].sessions[j].endTime || session.endTime;
                                    session.location = values.stages[i].sessions[j].location || session.location;
                                }

                                await updateSessionData(i, j);

                                // 更新该场次下的所有时间段
                                for (let k = 0; k < session.timeSlots.length; k++) {
                                    const timeSlot = session.timeSlots[k];

                                    // 如果时间段有ID，更新时间段
                                    if (timeSlot.id) {
                                        // 从values更新到formData
                                        if (values.stages[i]?.sessions[j]?.timeSlots[k]) {
                                            timeSlot.startTime = values.stages[i].sessions[j].timeSlots[k].startTime || timeSlot.startTime;
                                            timeSlot.endTime = values.stages[i].sessions[j].timeSlots[k].endTime || timeSlot.endTime;
                                            timeSlot.maxSeats = values.stages[i].sessions[j].timeSlots[k].maxSeats || timeSlot.maxSeats;
                                        }

                                        await updateTimeSlotData(i, j, k);
                                    } else {
                                        // 如果时间段没有ID，添加新时间段
                                        await addNewTimeSlot(i, j);
                                    }
                                }
                            } else {
                                // 如果场次没有ID，添加新场次
                                await addNewSession(i);
                            }
                        }
                    } else {
                        // 如果环节没有ID，添加新环节
                        await addNewStage();
                    }
                }

                // 关闭表单
                if (props.deliverClose) {
                    props.deliverClose();
                }
            } else {
                toast.error('面试活动更新失败');
            }
        } else {
            // 创建新面试活动
            const campaignResponse = await interviewApi.createCampaign({
                title: values.title,
                description: values.description,
                start_date: values.startTime,
                end_date: values.endTime,
                is_active: values.isActive || false
            });

            if (campaignResponse && campaignResponse.res && campaignResponse.res.data) {
                const campaignId = campaignResponse.res.data.id;
                toast.success('面试活动创建成功');

                // 为每个环节创建数据
                for (const stage of values.stages) {
                    const stageResponse = await interviewApi.createStage({
                        campaign_id: campaignId,
                        title: stage.title,
                        description: stage.description,
                        sort_order: values.stages.indexOf(stage),
                        is_required: stage.isRequired || false
                    });

                    if (stageResponse && stageResponse.res && stageResponse.res.stage) {
                        const stageId = stageResponse.res.stage.id;

                        // 为每个场次创建数据
                        for (const session of stage.sessions) {
                            const sessionResponse = await interviewApi.createSession({
                                stage_id: stageId,
                                title: session.title,
                                start_time: session.startTime,
                                end_time: session.endTime,
                                location: session.location
                            });

                            if (sessionResponse && sessionResponse.res && sessionResponse.res.session) {
                                const sessionId = sessionResponse.res.session.id;

                                // 为每个时间段创建数据
                                for (const timeSlot of session.timeSlots) {
                                    await interviewApi.createTimeSlot({
                                        session_id: sessionId,
                                        start_time: timeSlot.startTime,
                                        end_time: timeSlot.endTime,
                                        max_seats: timeSlot.maxSeats
                                    });
                                }
                            }
                        }
                    }
                }

                // 关闭表单
                if (props.deliverClose) {
                    props.deliverClose();
                }
            } else {
                toast.error('面试活动创建失败');
            }
        }
    } catch (error) {
        console.error('提交表单出错:', error);
        toast.error('提交表单失败');
    }

    // 为调试显示值
    toast(
        markRaw(
            h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
                h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
            )
        )
    );
})

// 环节操作
const updateStageData = async (stage: any, index: number) => {
    try {
        // 确保stage有id
        if (!stage.id) {
            throw new Error("环节ID不存在");
        }

        console.log(`更新环节数据，ID=${stage.id}，数据:`, {
            title: stage.title,
            description: stage.description,
            sort_order: index,
            is_required: stage.isRequired
        });

        const response = await interviewApi.updateStage(stage.id, {
            title: stage.title,
            description: stage.description,
            sort_order: index,
            is_required: stage.isRequired
        });

        console.log("环节更新API响应:", JSON.stringify(response, null, 2));
        
        if (response && response.err) {
            throw new Error(`API返回错误: ${response.err}`);
        }

        toast.success(`环节 ${index + 1} 更新成功`);
    } catch (error) {
        console.error("更新环节失败:", error);
        toast.error(`环节 ${index + 1} 更新失败: ${error instanceof Error ? error.message : String(error)}`);
    }
};

const deleteStageData = async (index: number) => {
    try {
        // 确保环节有ID
        if (!formData.stages[index].id) {
            throw new Error("环节ID不存在");
        }

        const stageId = formData.stages[index].id;
        await interviewApi.deleteStage(stageId);
        formData.stages.splice(index, 1);
        toast.success(`环节 ${index + 1} 删除成功`);
    } catch (error) {
        toast.error(`环节 ${index + 1} 删除失败`);
    }
};

// 字段变更自动更新功能
const onFieldBlur = async (fieldName: string, value: any, stageIndex?: number, sessionIndex?: number, timeSlotIndex?: number) => {
    console.log(`字段 ${fieldName} 值变更为:`, value, `索引: stage=${stageIndex}, session=${sessionIndex}, timeSlot=${timeSlotIndex}`);
    
    try {
        // 处理数字类型字段
        if (fieldName === 'maxSeats' && typeof value === 'string') {
            value = parseInt(value, 10);
            if (isNaN(value)) {
                throw new Error(`${fieldName} 必须是数字`);
            }
        }
        
        // 处理日期类型字段
        if (fieldName === 'startTime' || fieldName === 'endTime') {
            console.log(`处理日期字段 ${fieldName}，原始值:`, value, '类型:', typeof value);
            
            // 确保日期格式正确
            if (typeof value === 'string' && value.trim()) {
                try {
                    // 尝试解析日期
                    const date = new Date(value);
                    if (isNaN(date.getTime())) {
                        throw new Error(`${fieldName} 日期格式无效`);
                    }
                    // 转换为标准格式
                    value = formatDateForInput(date);
                    console.log(`${fieldName} 日期格式化后:`, value);
                } catch (dateError) {
                    console.error(`${fieldName} 日期解析错误:`, dateError);
                    throw new Error(`${fieldName} 日期格式无效: ${dateError instanceof Error ? dateError.message : String(dateError)}`);
                }
            }
        }
        
        // 根据不同的字段路径更新不同的数据
        if (stageIndex === undefined) {
            // 更新面试活动主信息
            if (!props.isEdit || !props.editData || !props.editData.id) return;
            
            // 更新 formData
            (formData as any)[fieldName] = value;
            
            // 构建要更新的数据对象 - 总是提供所有必要字段以避免MISSING_FIELDS错误
            const updateData: any = {
                // 始终包含所有必填字段
                title: formData.title,
                description: formData.description,
                start_date: formData.startTime,
                end_date: formData.endTime,
                is_active: Boolean(formData.isActive)
            };
            
            // 根据字段名更新特定字段的值
            switch (fieldName) {
                case 'title':
                    updateData.title = value;
                    break;
                case 'description':
                    updateData.description = value;
                    break;
                case 'startTime':
                    updateData.start_date = value;
                    break;
                case 'endTime':
                    updateData.end_date = value;
                    break;
                case 'isActive':
                    updateData.is_active = Boolean(value);
                    break;
                default:
                    console.warn(`未知的字段名: ${fieldName}`);
                    return;
            }
            
            console.log('设置完整的更新数据:', updateData);
            
            // 调试日志
            console.log(`调用更新API前的数据:`, {
                campaignId: props.editData.id,
                updateData,
                fieldName,
                value,
                isActiveType: typeof updateData.is_active
            });
            
            // 调用 API 更新
            const campaignResponse = await interviewApi.updateCampaign(props.editData.id, updateData);
            console.log('API响应:', campaignResponse);
            
            if (campaignResponse && campaignResponse.res) {
                console.log(`字段 ${fieldName} 更新成功`);
            } else {
                console.error('更新失败:', campaignResponse.err);
                throw new Error(`更新 ${fieldName} 失败: ${campaignResponse.err ? JSON.stringify(campaignResponse.err) : '未知错误'}`);
            }
        } else if (sessionIndex === undefined) {
            // 更新环节信息
            const stage = formData.stages[stageIndex];
            if (!stage || !stage.id) return;
            
            // 更新 formData
            (stage as any)[fieldName] = value;
            
            // 构建要更新的数据对象
            const updateData: any = {};
            
            // 根据字段名映射到 API 需要的字段名
            switch (fieldName) {
                case 'title':
                    updateData.title = value;
                    break;
                case 'description':
                    updateData.description = value;
                    break;
                case 'isRequired':
                    updateData.is_required = value;
                    break;
                default:
                    console.warn(`未知的环节字段名: ${fieldName}`);
                    return;
            }
            
            // 调用 API 更新环节
            await updateStageData(stage, stageIndex);
            console.log(`环节 ${stageIndex + 1} 的 ${fieldName} 更新成功`);
        } else if (timeSlotIndex === undefined) {
            // 更新场次信息
            const session = formData.stages[stageIndex].sessions[sessionIndex];
            if (!session || !session.id) return;
            
            // 更新 formData
            (session as any)[fieldName] = value;
            
            // 调用 API 更新场次
            await updateSessionData(stageIndex, sessionIndex);
            console.log(`环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 的 ${fieldName} 更新成功`);
        } else {
            // 更新时间段信息
            const timeSlot = formData.stages[stageIndex].sessions[sessionIndex].timeSlots[timeSlotIndex];
            if (!timeSlot || !timeSlot.id) return;
            
            // 更新 formData
            (timeSlot as any)[fieldName] = value;
            
            // 调用 API 更新时间段
            await updateTimeSlotData(stageIndex, sessionIndex, timeSlotIndex);
            console.log(`环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 时间段 ${timeSlotIndex + 1} 的 ${fieldName} 更新成功`);
        }
    } catch (error) {
        console.error('自动更新字段失败:', error);
        toast.error(`自动更新 ${fieldName} 失败: ${error instanceof Error ? error.message : String(error)}`);
    }
};

// 选择器值改变处理函数
const onSelectorChange = async (fieldName: string, value: any, stageIndex?: number, sessionIndex?: number, timeSlotIndex?: number) => {
    // 对选择器的值改变直接调用 onFieldBlur 进行处理
    await onFieldBlur(fieldName, value, stageIndex, sessionIndex, timeSlotIndex);
};

const addNewStage = async () => {
    try {
        // 确保活动ID存在
        if (!props.campaignId) {
            console.error("活动ID不存在:", props.campaignId);
            throw new Error("活动ID不存在");
        }
        
        // 创建默认环节数据，确保所有必需字段都存在
        const defaultStageData = {
            campaign_id: props.campaignId,
            title: '新环节',
            description: '请添加环节描述',
            sort_order: formData.stages.length,
            is_required: false
        };
        
        console.log("开始创建环节, campaignId =", props.campaignId, "数据:", defaultStageData);
        const response = await interviewApi.createStage(defaultStageData);
        
        console.log("环节创建响应:", JSON.stringify(response, null, 2));
        
        // 检查环节创建是否失败
        if (response && response.err) {
            console.error("API返回环节创建错误:", response.err);
            throw new Error("环节创建失败: " + JSON.stringify(response.err));
        }
        
        // 创建一个包含必要默认值的新环节
        const newStage: Stage = {
            id: Date.now(), // 使用时间戳作为临时ID
            title: defaultStageData.title,
            description: defaultStageData.description,
            isRequired: defaultStageData.is_required,
            sessions: []
        };
        
        // 如果API返回了成功响应和有效数据，使用API返回的ID
        let stageId: number | null = null;
        if (response && response.res) {
            try {
                // 尝试从response.res中获取stage数据
                const responseData = response.res as any;
                console.log("环节创建返回的完整数据:", responseData);
                
                // 调试所有可能包含ID的路径
                if (responseData.stage) console.log("responseData.stage:", responseData.stage);
                if (responseData.data) console.log("responseData.data:", responseData.data);
                
                if (responseData.stage && responseData.stage.id) {
                    newStage.id = responseData.stage.id;
                    stageId = responseData.stage.id;
                    console.log("从 responseData.stage.id 获取到环节ID:", stageId);
                } else if (responseData.data && responseData.data.id) {
                    newStage.id = responseData.data.id;
                    stageId = responseData.data.id;
                    console.log("从 responseData.data.id 获取到环节ID:", stageId);
                } else if (responseData.id) {
                    newStage.id = responseData.id;
                    stageId = responseData.id;
                    console.log("从 responseData.id 获取到环节ID:", stageId);
                } else {
                    // 尝试直接解析响应数据
                    console.log("尝试直接从响应中提取ID");
                    const jsonStr = JSON.stringify(responseData);
                    const idMatch = jsonStr.match(/"id"\s*:\s*(\d+)/);
                    if (idMatch && idMatch[1]) {
                        stageId = parseInt(idMatch[1], 10);
                        newStage.id = stageId;
                        console.log("通过正则表达式从响应中提取到ID:", stageId);
                    }
                }
                
                if (!stageId) {
                    console.error("无法从API响应中提取环节ID，响应数据:", responseData);
                }
            } catch (err) {
                console.warn("无法解析API返回的环节ID:", err);
            }
        }
        
        // 创建默认场次和时间段
        // 设置默认日期时间
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 3600000); // 1小时后
        const thirtyMinLater = new Date(now.getTime() + 1800000); // 30分钟后
        
        // 创建默认场次
        const defaultSession: Session = {
            id: Date.now() + 100, // 临时ID，与stage ID区分
            title: '默认场次',
            startTime: formatDateForInput(now),
            endTime: formatDateForInput(oneHourLater),
            location: '请添加场次地点',
            timeSlots: [
                {
                    id: Date.now() + 200, // 临时ID，与session ID区分
                    startTime: formatDateForInput(now),
                    endTime: formatDateForInput(thirtyMinLater),
                    maxSeats: 10
                }
            ]
        };
        
        // 将默认场次添加到新环节
        newStage.sessions.push(defaultSession);
        
        // 将新环节添加到表单数据
        console.log("添加的新环节(包含默认场次和时间段):", newStage);
        formData.stages.push(newStage);
        
        // 创建环节成功的提示会在完成所有操作后显示
        
        // 如果成功创建了环节并获取到ID，则通过API创建场次和时间段
        if (stageId) {
            try {
                console.log(`为环节ID=${stageId}创建默认场次`);
                // 创建场次
                console.log("准备创建场次，参数:", {
                    stage_id: stageId,
                    title: defaultSession.title,
                    start_time: defaultSession.startTime,
                    end_time: defaultSession.endTime,
                    location: defaultSession.location
                });
                
                // 确保所有参数类型正确
                const sessionParams = {
                    stage_id: Number(stageId),  // 确保是数字类型
                    title: String(defaultSession.title),
                    start_time: String(defaultSession.startTime),
                    end_time: String(defaultSession.endTime),
                    location: String(defaultSession.location || '请添加场次地点')
                };
                
                const sessionResponse = await interviewApi.createSession(sessionParams);
                
                console.log("场次创建响应:", JSON.stringify(sessionResponse, null, 2));
                
                // 检查是否有错误
                if (sessionResponse && sessionResponse.err) {
                    console.error("创建场次失败:", sessionResponse.err);
                    
                    // 获取更详细的错误信息
                    let errorDetail = '';
                    if (typeof sessionResponse.err === 'object') {
                        if (sessionResponse.err.data) {
                            errorDetail += ` 详情: ${JSON.stringify(sessionResponse.err.data)}`;
                        }
                        if (sessionResponse.err.message) {
                            errorDetail += ` 消息: ${sessionResponse.err.message}`;
                        }
                        if (sessionResponse.err.status) {
                            errorDetail += ` 状态码: ${sessionResponse.err.status}`;
                        }
                    }
                    
                    throw new Error(`创建场次失败:${errorDetail || JSON.stringify(sessionResponse.err)}`);
                }
                
                // 确保有响应数据
                if (!sessionResponse || !sessionResponse.res) {
                    console.error("创建场次无响应数据，完整响应:", sessionResponse);
                    throw new Error("创建场次无响应数据");
                }
                
                // 尝试从响应中获取场次ID
                let sessionId = null;
                const responseData = sessionResponse.res as any;
                
                console.log("场次创建返回的完整数据:", responseData);
                
                // 调试所有可能包含ID的路径
                if (responseData.session) console.log("responseData.session:", responseData.session);
                if (responseData.data) console.log("responseData.data:", responseData.data);
                
                // 尝试从各种可能的路径获取场次ID
                if (responseData.session && responseData.session.id) {
                    sessionId = responseData.session.id;
                    console.log("从 responseData.session.id 获取到场次ID:", sessionId);
                } else if (responseData.data && responseData.data.id) {
                    sessionId = responseData.data.id;
                    console.log("从 responseData.data.id 获取到场次ID:", sessionId);
                } else if (responseData.id) {
                    sessionId = responseData.id;
                    console.log("从 responseData.id 获取到场次ID:", sessionId);
                } else {
                    // 尝试直接解析响应数据
                    console.log("尝试直接从响应中提取场次ID");
                    const jsonStr = JSON.stringify(responseData);
                    const idMatch = jsonStr.match(/"id"\s*:\s*(\d+)/);
                    if (idMatch && idMatch[1]) {
                        sessionId = parseInt(idMatch[1], 10);
                        console.log("通过正则表达式从响应中提取到场次ID:", sessionId);
                    }
                }
                
                // 如果无法获取到场次ID，抛出错误
                if (!sessionId) {
                    throw new Error("无法获取场次ID");
                }
                
                // 更新前端场次ID
                const lastStageIndex = formData.stages.length - 1;
                formData.stages[lastStageIndex].sessions[0].id = sessionId;
                
                // 创建时间段
                const timeSlot = defaultSession.timeSlots[0];
                console.log(`为场次ID=${sessionId}创建默认时间段`);
                
                console.log("准备创建时间段，参数:", {
                    session_id: sessionId,
                    start_time: timeSlot.startTime,
                    end_time: timeSlot.endTime,
                    max_seats: timeSlot.maxSeats
                });
                
                // 确保所有参数类型正确
                const timeSlotParams = {
                    session_id: Number(sessionId), // 确保是数字类型
                    start_time: String(timeSlot.startTime),
                    end_time: String(timeSlot.endTime),
                    max_seats: Number(timeSlot.maxSeats || 10) // 确保是数字类型
                };
                
                const timeSlotResponse = await interviewApi.createTimeSlot(timeSlotParams);
                
                console.log("时间段创建响应:", JSON.stringify(timeSlotResponse, null, 2));
                
                // 检查时间段创建是否有错误
                if (timeSlotResponse && timeSlotResponse.err) {
                    console.error("创建时间段失败:", timeSlotResponse.err);
                    
                    // 获取更详细的错误信息
                    let errorDetail = '';
                    if (typeof timeSlotResponse.err === 'object') {
                        if (timeSlotResponse.err.data) {
                            errorDetail += ` 详情: ${JSON.stringify(timeSlotResponse.err.data)}`;
                        }
                        if (timeSlotResponse.err.message) {
                            errorDetail += ` 消息: ${timeSlotResponse.err.message}`;
                        }
                        if (timeSlotResponse.err.status) {
                            errorDetail += ` 状态码: ${timeSlotResponse.err.status}`;
                        }
                    }
                    
                    throw new Error(`创建时间段失败:${errorDetail || JSON.stringify(timeSlotResponse.err)}`);
                }
                
                // 确保有响应数据
                if (!timeSlotResponse || !timeSlotResponse.res) {
                    console.error("创建时间段无响应数据，完整响应:", timeSlotResponse);
                    throw new Error("创建时间段无响应数据");
                }
                
                // 尝试获取时间段ID并更新前端
                const timeSlotData = timeSlotResponse.res as any;
                let timeSlotId = null;
                
                console.log("时间段创建返回的完整数据:", timeSlotData);
                
                // 调试所有可能包含ID的路径
                if (timeSlotData.timeSlot) console.log("timeSlotData.timeSlot:", timeSlotData.timeSlot);
                if (timeSlotData.data) console.log("timeSlotData.data:", timeSlotData.data);
                
                if (timeSlotData.timeSlot && timeSlotData.timeSlot.id) {
                    timeSlotId = timeSlotData.timeSlot.id;
                    console.log("从 timeSlotData.timeSlot.id 获取到时间段ID:", timeSlotId);
                } else if (timeSlotData.data && timeSlotData.data.id) {
                    timeSlotId = timeSlotData.data.id;
                    console.log("从 timeSlotData.data.id 获取到时间段ID:", timeSlotId);
                } else if (timeSlotData.id) {
                    timeSlotId = timeSlotData.id;
                    console.log("从 timeSlotData.id 获取到时间段ID:", timeSlotId);
                } else {
                    // 尝试直接解析响应数据
                    console.log("尝试直接从响应中提取时间段ID");
                    const jsonStr = JSON.stringify(timeSlotData);
                    const idMatch = jsonStr.match(/"id"\s*:\s*(\d+)/);
                    if (idMatch && idMatch[1]) {
                        timeSlotId = parseInt(idMatch[1], 10);
                        console.log("通过正则表达式从响应中提取到时间段ID:", timeSlotId);
                    }
                }
                
                if (timeSlotId) {
                    formData.stages[lastStageIndex].sessions[0].timeSlots[0].id = timeSlotId;
                } else {
                    console.warn("无法获取时间段ID，但创建可能成功");
                }
                
                // 全部创建成功后显示成功消息
                const successMsg = `新增成功！环节ID: ${stageId}, 场次ID: ${sessionId}, 时间段ID: ${timeSlotId || '未知'}`;
                console.log(successMsg);
                toast.success(successMsg);
                
            } catch (apiError) {
                console.error("创建默认场次或时间段失败:", apiError);
                
                // 判断错误类型，给出更具体的错误信息
                let errorMessage = apiError instanceof Error ? apiError.message : String(apiError);
                
                // 如果是409冲突错误
                if (errorMessage.includes('409') || errorMessage.toLowerCase().includes('conflict')) {
                    errorMessage = "可能已存在相同的场次或时间段，请检查名称和时间";
                }
                
                // 显示错误信息
                toast.error(`创建场次或时间段失败: ${errorMessage}`);
                
                try {
                    // 回滚，删除已创建的环节
                    console.log(`尝试删除环节 ID=${stageId} 以保持数据一致性`);
                    
                    // 确保我们有有效的环节ID
                    if (stageId) {
                        const deleteResponse = await interviewApi.deleteStage(stageId);
                        console.log("删除环节响应:", deleteResponse);
                        
                        if (deleteResponse && deleteResponse.err) {
                            console.error("删除环节时发生错误:", deleteResponse.err);
                            toast.error(`注意: 无法回滚删除环节(ID=${stageId})，请手动清理数据`);
                        } else {
                            console.log("成功删除环节");
                            toast.info("已回滚删除环节，保持数据一致性");
                        }
                    } else {
                        console.warn("无法删除环节，因为没有有效的环节ID");
                    }
                    
                    // 从前端删除环节
                    const lastStageIndex = formData.stages.length - 1;
                    if (lastStageIndex >= 0) {
                        formData.stages.splice(lastStageIndex, 1);
                        console.log("已从前端删除环节");
                    }
                } catch (rollbackError) {
                    console.error("回滚删除环节失败:", rollbackError);
                    toast.error(`注意: 环节已创建(ID=${stageId})但场次或时间段创建失败，并且无法回滚，可能导致数据不一致`);
                }
            }
        } else {
            // 如果未能获取到环节ID，但前端已添加环节，则给出警告
            toast.warning('已在前端创建环节，但未能获取环节ID，可能导致数据不一致');
        }
        
        // 输出警告，如果API返回了错误
        if (response && response.err) {
            console.warn("API返回错误，但已在前端创建环节:", response.err);
        } else if (!stageId) {
            // 如果没有获取到有效的stageId，但API没有返回错误
            toast.warning('环节可能已创建，但无法获取其ID');
        } else if (!formData.stages[formData.stages.length - 1].sessions[0].id) {
            // 如果没有成功创建场次
            toast.warning('环节已创建，但场次创建可能失败');
        } else if (!formData.stages[formData.stages.length - 1].sessions[0].timeSlots[0].id) {
            // 如果没有成功创建时间段
            toast.warning('环节和场次已创建，但时间段创建可能失败');
        }
    } catch (error) {
        console.error("添加环节错误:", error);
        toast.error('新增环节失败: ' + (error instanceof Error ? error.message : String(error)));
        
        // 尝试回滚前端状态
        try {
            // 如果已经添加了环节到UI，则移除它
            if (formData.stages.length > 0) {
                const lastStageIndex = formData.stages.length - 1;
                formData.stages.pop();
                console.log('已回滚前端环节状态');
            }
        } catch (e) {
            console.error('回滚UI状态失败:', e);
        }
    }
};

// 场次操作
const updateSessionData = async (stageIndex: number, sessionIndex: number) => {
    try {
        const session = formData.stages[stageIndex].sessions[sessionIndex];

        // 确保场次有ID
        if (!session.id) {
            throw new Error("场次ID不存在");
        }

        console.log(`更新场次数据，ID=${session.id}，数据:`, {
            title: session.title,
            start_time: session.startTime,
            end_time: session.endTime,
            location: session.location
        });

        const response = await interviewApi.updateSession(session.id, {
            title: session.title,
            start_time: session.startTime,
            end_time: session.endTime,
            location: session.location
        });
        
        console.log("场次更新API响应:", JSON.stringify(response, null, 2));
        
        if (response && response.err) {
            throw new Error(`API返回错误: ${response.err}`);
        }
        
        toast.success(`环节 ${stageIndex + 1} 的场次 ${sessionIndex + 1} 更新成功`);
    } catch (error) {
        console.error("更新场次失败:", error);
        toast.error(`环节 ${stageIndex + 1} 的场次 ${sessionIndex + 1} 更新失败: ${error instanceof Error ? error.message : String(error)}`);
    }
};

const deleteSessionData = async (stageIndex: number, sessionIndex: number) => {
    try {
        const session = formData.stages[stageIndex].sessions[sessionIndex];

        // 确保场次有ID
        if (!session.id) {
            throw new Error("场次ID不存在");
        }

        await interviewApi.deleteSession(session.id);
        formData.stages[stageIndex].sessions.splice(sessionIndex, 1);
        toast.success(`环节 ${stageIndex + 1} 的场次 ${sessionIndex + 1} 删除成功`);
    } catch (error) {
        toast.error(`环节 ${stageIndex + 1} 的场次 ${sessionIndex + 1} 删除失败`);
    }
};

const addNewSession = async (stageIndex: number) => {
    try {
        console.log(`开始创建场次, stageIndex = ${stageIndex}`);
        
        // 确保环节有ID
        if (!formData.stages[stageIndex] || !formData.stages[stageIndex].id) {
            console.error("环节不存在或ID不存在:", formData.stages[stageIndex]);
            throw new Error("环节ID不存在");
        }

        const stageId = formData.stages[stageIndex].id;
        console.log(`为环节 ID=${stageId} 创建场次`);
        
        // 创建默认时间
        const now = new Date();
        const endTime = new Date(now.getTime() + 3600000); // 1小时后
        const slotEndTime = new Date(now.getTime() + 1800000); // 30分钟后
        
        // 生成一个唯一的场次标题，避免冲突
        const existingSessions = formData.stages[stageIndex].sessions || [];
        let sessionIndex = 1;
        let title = '新场次';
        
        // 如果已有"新场次"，尝试"新场次2"、"新场次3"等
        if (existingSessions.length > 0) {
            const basicTitle = '新场次';
            
            // 找出现有场次中以"新场次"开头的最大编号
            const pattern = new RegExp(`^${basicTitle}(\\d*)$`);
            let maxIndex = 0;
            
            existingSessions.forEach(session => {
                const match = session.title.match(pattern);
                if (match) {
                    const index = match[1] ? parseInt(match[1], 10) : 1;
                    maxIndex = Math.max(maxIndex, index);
                }
            });
            
            // 使用下一个编号
            sessionIndex = maxIndex + 1;
            title = maxIndex > 0 ? `${basicTitle}${sessionIndex}` : basicTitle;
        }
        
        // 确保时间不重叠
        if (existingSessions.length > 0) {
            // 找到当前最晚的结束时间，将新场次安排在其后
            let latestEndTime = now;
            
            existingSessions.forEach(session => {
                try {
                    const sessionEndTime = new Date(session.endTime);
                    if (!isNaN(sessionEndTime.getTime()) && sessionEndTime > latestEndTime) {
                        latestEndTime = new Date(sessionEndTime.getTime() + 600000); // 添加10分钟缓冲
                    }
                } catch (e) {
                    console.warn('解析场次时间失败:', e);
                }
            });
            
            // 如果有更晚的结束时间，使用它作为新场次的开始时间
            if (latestEndTime > now) {
                now.setTime(latestEndTime.getTime());
                endTime.setTime(now.getTime() + 3600000); // 1小时后
                slotEndTime.setTime(now.getTime() + 1800000); // 30分钟后
            }
        }
        
        // 先创建前端场次对象（包含一个默认时间段），不依赖API响应
        const newSession: Session = {
            id: Date.now(), // 临时ID
            title: title,
            startTime: formatDateForInput(now),
            endTime: formatDateForInput(endTime),
            location: '待定地点',
            timeSlots: [
                {
                    id: Date.now() + 1, // 临时ID
                    startTime: formatDateForInput(now),
                    endTime: formatDateForInput(slotEndTime),
                    maxSeats: 10
                }
            ]
        };
        
        // 先把新场次添加到界面，确保用户体验流畅
        formData.stages[stageIndex].sessions.push(newSession);
        toast.success(`环节 ${stageIndex + 1} 添加场次成功`);
        
        // 准备API请求数据
        const defaultSessionData = {
            stage_id: stageId,
            title: newSession.title,
            start_time: newSession.startTime,
            end_time: newSession.endTime,
            location: newSession.location
        };
        
        console.log("发送创建场次数据到API:", defaultSessionData);
        
        // 尝试调用API创建场次
        try {
            const sessionResponse = await interviewApi.createSession(defaultSessionData);
            console.log("场次创建API响应:", JSON.stringify(sessionResponse, null, 2));
            
            // 检查API是否返回错误
            if (sessionResponse.err) {
                // 提取错误信息
                const errData = sessionResponse.err.data || {};
                const errMessage = errData.message || '未知错误';
                const errDetail = errData.detail || '';
                
                // 检查是否是409冲突错误
                const errResponseData = sessionResponse.err.data?.response || {};
                const statusCode = errResponseData.status || sessionResponse.err.status || 0;
                
                let errorMsg = `场次创建失败: ${errMessage}`;
                if (errDetail) {
                    errorMsg += ` - ${errDetail}`;
                }
                
                console.error("创建场次API错误:", errorMsg, "状态码:", statusCode);
                
                if (statusCode === 409) {
                    errorMsg = '场次创建失败: 可能已存在相同的场次，请检查名称和时间';
                }
                
                toast.error(errorMsg);
                
                // 移除前端已添加的场次（回滚UI状态）
                formData.stages[stageIndex].sessions.pop();
                return;
            }
            
            // 如果API返回成功，更新前端对象的ID
            if (sessionResponse && sessionResponse.res) {
                const responseData = sessionResponse.res as any;
                let sessionId = null;
                
                // 尝试从各种可能的路径获取场次ID
                if (responseData.session && responseData.session.id) {
                    sessionId = responseData.session.id;
                } else if (responseData.data && responseData.data.id) {
                    sessionId = responseData.data.id;
                } else if (responseData.id) {
                    sessionId = responseData.id;
                }
                
                if (sessionId) {
                    // 找到最后添加的场次并更新ID
                    const lastIndex = formData.stages[stageIndex].sessions.length - 1;
                    formData.stages[stageIndex].sessions[lastIndex].id = sessionId;
                    console.log(`场次API创建成功，ID更新为: ${sessionId}`);
                    
                    // 场次创建成功后，尝试创建时间段
                    try {
                        const defaultTimeSlotData = {
                            session_id: sessionId,
                            start_time: newSession.timeSlots[0].startTime,
                            end_time: newSession.timeSlots[0].endTime,
                            max_seats: newSession.timeSlots[0].maxSeats
                        };
                        
                        console.log("发送创建时间段数据到API:", defaultTimeSlotData);
                        const timeSlotResponse = await interviewApi.createTimeSlot(defaultTimeSlotData);
                        console.log("时间段创建API响应:", JSON.stringify(timeSlotResponse, null, 2));
                        
                        // 如果API返回成功，更新时间段ID
                        if (timeSlotResponse && timeSlotResponse.res) {
                            const slotResponseData = timeSlotResponse.res as any;
                            let timeSlotId = null;
                            
                            // 尝试从各种可能的路径获取时间段ID
                            if (slotResponseData.timeSlot && slotResponseData.timeSlot.id) {
                                timeSlotId = slotResponseData.timeSlot.id;
                            } else if (slotResponseData.data && slotResponseData.data.time_slots && slotResponseData.data.time_slots.id) {
                                timeSlotId = slotResponseData.data.time_slots.id;
                            } else if (slotResponseData.time_slots && slotResponseData.time_slots.id) {
                                timeSlotId = slotResponseData.time_slots.id;
                            } else if (slotResponseData.id) {
                                timeSlotId = slotResponseData.id;
                            } else if (slotResponseData.data && slotResponseData.data.id) {
                                timeSlotId = slotResponseData.data.id;
                            }
                            
                            if (timeSlotId) {
                                formData.stages[stageIndex].sessions[lastIndex].timeSlots[0].id = timeSlotId;
                                console.log(`时间段API创建成功，ID更新为: ${timeSlotId}`);
                            } else {
                                console.warn("API返回的响应中未找到时间段ID:", slotResponseData);
                            }
                        }
                    } catch (timeSlotError) {
                        console.warn("创建时间段API调用失败，但不影响场次创建:", timeSlotError);
                    }
                } else {
                    console.warn("API返回的响应中未找到场次ID:", responseData);
                }
            }
        } catch (sessionError) {
            console.warn("创建场次API调用失败，但前端已添加场次:", sessionError);
            
            // 检查是否为409冲突错误
            const error = sessionError as any;
            let errorMessage = "API调用失败";
            
            if (error && error.response && error.response.status === 409) {
                errorMessage = "可能已存在相同的场次，请检查名称和时间";
            } else if (error && error.message) {
                errorMessage = error.message;
            }
            
            toast.error(`创建场次失败: ${errorMessage}`);
            
            // 移除前端已添加的场次（回滚UI状态）
            formData.stages[stageIndex].sessions.pop();
        }
    } catch (error) {
        console.error('添加场次错误:', error);
        
        let errorMessage = error instanceof Error ? error.message : String(error);
        
        // 检查是否包含409错误信息
        if (errorMessage.includes('409') || errorMessage.toLowerCase().includes('conflict')) {
            errorMessage = "可能已存在相同的场次，请检查名称和时间";
        }
        
        toast.error(`环节 ${stageIndex + 1} 添加场次失败: ${errorMessage}`);
        
        // 确保UI状态一致
        try {
            // 如果已经添加了场次到UI，则移除它
            const lastIndex = formData.stages[stageIndex].sessions.length - 1;
            if (lastIndex >= 0 && !formData.stages[stageIndex].sessions[lastIndex].id) {
                formData.stages[stageIndex].sessions.pop();
            }
        } catch (e) {
            console.error('回滚UI状态失败:', e);
        }
    }
};

// 时间段操作
const updateTimeSlotData = async (stageIndex: number, sessionIndex: number, timeSlotIndex: number) => {
    try {
        console.log(`开始更新时间段: stageIndex=${stageIndex}, sessionIndex=${sessionIndex}, timeSlotIndex=${timeSlotIndex}`);
        const timeSlot = formData.stages[stageIndex].sessions[sessionIndex].timeSlots[timeSlotIndex];

        // 确保时间段有ID
        if (!timeSlot.id) {
            throw new Error("时间段ID不存在");
        }

        // 确保日期格式正确
        let startTime = timeSlot.startTime;
        let endTime = timeSlot.endTime;
        let maxSeats = typeof timeSlot.maxSeats === 'number' ? timeSlot.maxSeats : parseInt(String(timeSlot.maxSeats || 10), 10);
        
        console.log("原始时间段数据:", {
            id: timeSlot.id,
            startTime: startTime + " (" + typeof startTime + ")",
            endTime: endTime + " (" + typeof endTime + ")",
            maxSeats: maxSeats + " (" + typeof maxSeats + ")"
        });
        
        try {
            // 尝试解析并格式化日期
            if (typeof startTime === 'string') {
                const startDate = new Date(startTime);
                if (!isNaN(startDate.getTime())) {
                    // 获取datetime-local格式的字符串 (YYYY-MM-DDTHH:MM)
                    startTime = formatDateForInput(startDate);
                    // 将T替换为空格，确保符合API的期望格式 (YYYY-MM-DD HH:MM:SS)
                    startTime = startTime.replace('T', ' ') + ':00';
                }
            }
            
            if (typeof endTime === 'string') {
                const endDate = new Date(endTime);
                if (!isNaN(endDate.getTime())) {
                    // 获取datetime-local格式的字符串 (YYYY-MM-DDTHH:MM)
                    endTime = formatDateForInput(endDate);
                    // 将T替换为空格，确保符合API的期望格式 (YYYY-MM-DD HH:MM:SS)
                    endTime = endTime.replace('T', ' ') + ':00';
                }
            }
        } catch (dateError) {
            console.warn("日期格式化警告:", dateError);
            // 继续使用原始日期
        }

        console.log(`更新时间段数据，ID=${timeSlot.id}，格式化后数据:`, {
            time_slot_id: timeSlot.id, // 使用正确的参数名
            start_time: startTime,
            end_time: endTime,
            max_seats: maxSeats
        });

        // 构建更新数据
        const updateData = {
            id: timeSlot.id, // API方法内会映射为time_slot_id
            start_time: startTime,
            end_time: endTime,
            max_seats: maxSeats
        };

        try {
            const response = await interviewApi.updateTimeSlot(updateData);
            console.log("时间段更新API响应:", JSON.stringify(response, null, 2));
            
            // 检查错误
            if (response && response.err) {
                console.error("API返回错误:", response.err);
                throw new Error(`API返回错误: ${JSON.stringify(response.err)}`);
            }
            
            // 检查响应中的错误信息
            if (response && response.res) {
                const resData = response.res as any;
                
                // 检查明确的失败标志
                if (resData.success === false) {
                    const errorMessage = resData.message || '更新失败';
                    console.error("API返回业务错误:", errorMessage);
                    throw new Error(`API返回业务错误: ${errorMessage}`);
                }
                
                // 检查其他可能的错误格式
                if (resData.code && resData.code !== 'SUCCESS' && resData.code !== '200') {
                    const errorMessage = resData.message || `错误代码: ${resData.code}`;
                    console.error("API返回业务错误代码:", errorMessage);
                    throw new Error(`API返回业务错误: ${errorMessage}`);
                }
                
                // 成功后更新本地数据
                console.log("API返回成功，更新本地数据");
                if (resData.timeSlot) {
                    // 如果API返回了更新后的时间段数据，使用它来更新本地状态
                    const updatedTimeSlot = resData.timeSlot;
                    console.log("API返回的更新后数据:", updatedTimeSlot);
                    
                    // 将API返回的数据格式化后更新到本地状态
                    formData.stages[stageIndex].sessions[sessionIndex].timeSlots[timeSlotIndex] = {
                        ...formData.stages[stageIndex].sessions[sessionIndex].timeSlots[timeSlotIndex],
                        ...updatedTimeSlot,
                        // 确保前端使用的字段名与API返回的保持一致
                        id: updatedTimeSlot.id,
                        sessionId: updatedTimeSlot.sessionId || updatedTimeSlot.session_id,
                        startTime: updatedTimeSlot.startTime || updatedTimeSlot.start_time,
                        endTime: updatedTimeSlot.endTime || updatedTimeSlot.end_time,
                        maxSeats: updatedTimeSlot.maxSeats || updatedTimeSlot.max_seats,
                        bookedSeats: updatedTimeSlot.bookedSeats || updatedTimeSlot.booked_seats || 0
                    };
                }
            } else {
                console.warn("API响应中没有找到res字段");
            }
        } catch (apiError) {
            console.error("API调用异常:", apiError);
            throw new Error(`API调用异常: ${apiError instanceof Error ? apiError.message : String(apiError)}`);
        }
        
        toast.success(`环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 的时间段 ${timeSlotIndex + 1} 更新成功`);
    } catch (error) {
        console.error("更新时间段失败:", error);
        toast.error(`环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 的时间段 ${timeSlotIndex + 1} 更新失败: ${error instanceof Error ? error.message : String(error)}`);
    }
};

const deleteTimeSlotData = async (stageIndex: number, sessionIndex: number, timeSlotIndex: number) => {
    try {
        const timeSlot = formData.stages[stageIndex].sessions[sessionIndex].timeSlots[timeSlotIndex];

        // 确保时间段有ID
        if (!timeSlot.id) {
            throw new Error("时间段ID不存在");
        }

        await interviewApi.deleteTimeSlot(timeSlot.id);
        formData.stages[stageIndex].sessions[sessionIndex].timeSlots.splice(timeSlotIndex, 1);
        toast.success(`环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 的时间段 ${timeSlotIndex + 1} 删除成功`);
    } catch (error) {
        toast.error(`环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 的时间段 ${timeSlotIndex + 1} 删除失败`);
    }
};

const addNewTimeSlot = async (stageIndex: number, sessionIndex: number) => {
    try {
        console.log(`开始创建时间段, stageIndex = ${stageIndex}, sessionIndex = ${sessionIndex}`);
        
        // 确保场次存在
        if (!formData.stages[stageIndex] || !formData.stages[stageIndex].sessions[sessionIndex]) {
            console.error("场次不存在:", formData.stages[stageIndex]?.sessions[sessionIndex]);
            throw new Error("场次不存在");
        }
        
        const session = formData.stages[stageIndex].sessions[sessionIndex];
        
        // 创建默认时间
        const now = new Date();
        const endTime = new Date(now.getTime() + 1800000); // 30分钟后
        
        // 先创建前端时间段对象，不依赖API响应
        const newTimeSlot: TimeSlot = {
            id: Date.now(), // 临时ID
            startTime: formatDateForInput(now),
            endTime: formatDateForInput(endTime),
            maxSeats: 10
        };
        
        // 先把新时间段添加到界面，确保用户体验流畅
        formData.stages[stageIndex].sessions[sessionIndex].timeSlots.push(newTimeSlot);
        toast.success(`环节 ${stageIndex + 1} 场次 ${sessionIndex + 1} 添加时间段成功`);
        
        // 如果场次有ID，尝试调用API创建时间段
        if (session.id) {
            // 准备API请求数据
            const defaultTimeSlotData = {
                session_id: session.id,
                start_time: newTimeSlot.startTime,
                end_time: newTimeSlot.endTime,
                max_seats: newTimeSlot.maxSeats
            };
            
            console.log("发送创建时间段数据到API:", defaultTimeSlotData);
            
            try {
                const response = await interviewApi.createTimeSlot(defaultTimeSlotData);
                console.log("时间段创建API响应:", JSON.stringify(response, null, 2));
                
                // 如果API返回成功，更新前端对象的ID
                if (response && response.res) {
                    const responseData = response.res as any;
                    let timeSlotId = null;
                    
                    // 尝试从各种可能的路径获取时间段ID
                    if (responseData.timeSlot && responseData.timeSlot.id) {
                        timeSlotId = responseData.timeSlot.id;
                    } else if (responseData.data && responseData.data.time_slots && responseData.data.time_slots.id) {
                        timeSlotId = responseData.data.time_slots.id;
                    } else if (responseData.time_slots && responseData.time_slots.id) {
                        timeSlotId = responseData.time_slots.id;
                    } else if (responseData.id) {
                        timeSlotId = responseData.id;
                    } else if (responseData.data && responseData.data.id) {
                        timeSlotId = responseData.data.id;
                    }
                    
                    if (timeSlotId) {
                        // 找到刚才添加的时间段并更新ID
                        const lastIndex = formData.stages[stageIndex].sessions[sessionIndex].timeSlots.length - 1;
                        formData.stages[stageIndex].sessions[sessionIndex].timeSlots[lastIndex].id = timeSlotId;
                        console.log(`时间段API创建成功，ID更新为: ${timeSlotId}`);
                    } else {
                        console.warn("API返回的响应中未找到时间段ID:", responseData);
                    }
                }
            } catch (apiError) {
                console.warn("创建时间段API调用失败，但前端已添加时间段:", apiError);
            }
        } else {
            console.warn("场次ID不存在，跳过API调用，仅在前端添加时间段");
        }
    } catch (error) {
        console.error("添加时间段错误:", error);
        toast.error(`添加时间段失败: ${error instanceof Error ? error.message : String(error)}`);
    }
};

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