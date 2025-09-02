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

import { onMounted, onUnmounted } from 'vue'

import { useInterviewStore } from '@/stores/interview'
const interviewStore = useInterviewStore()

onMounted(() => {
    document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
    document.body.style.overflow = ''
})

const props = defineProps<{ deliverClose?: () => void }>()

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

const { handleSubmit, resetForm: veeResetForm } = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
    // 创建面试
    const campaignReq = await interviewStore.createCampaign({
        title: values.title,
        description: values.description,
        startDate: new Date(values.startTime),
        endDate: new Date(values.endTime),
        isActive: !!values.isActive
    })
    // 创建环节
    const campaignId = (campaignReq as any).data.campaigns.id
    for (let sIndex = 0; sIndex < values.stages.length; sIndex++) {
        const stage = values.stages[sIndex];
        console.log('准备创建环节:', stage)
        try {
            const stageRes = await interviewStore.createStage({
                campaign_id: campaignId,
                title: stage.title,
                description: stage.description,
                sort_order: sIndex,
                is_required: !!stage.isRequired
            })
            const stageId = (stageRes as any).data.stages.id
            console.log('创建环节成功:', stageRes)
            // 创建场次
            for (let ssIndex = 0; ssIndex < stage.sessions.length; ssIndex++) {
                const session = stage.sessions[ssIndex];
                console.log('准备创建场次:', session)
                try {
                    const sessionRes = await interviewStore.createSession({
                        stage_id: stageId,
                        title: session.title,
                        start_time: session.startTime,
                        end_time: session.endTime,
                        location: session.location
                    })
                    const sessionId = (sessionRes as any).data.sessions.id
                    console.log('创建场次成功:', sessionRes)
                    // 创建时间段
                    for (let tsIndex = 0; tsIndex < session.timeSlots.length; tsIndex++) {
                        const timeSlot = session.timeSlots[tsIndex];
                        try {
                            const timeSlotRes = await interviewStore.createTimeSlot({
                                session_id: sessionId,
                                start_time: timeSlot.startTime,
                                end_time: timeSlot.endTime,
                                max_seats: timeSlot.maxSeats
                            })
                            console.log('创建时间段成功:', timeSlotRes)
                        } catch (err) {
                            console.error('创建时间段失败:', err)
                        }
                    }
                } catch (err) {
                    console.error('创建场次失败:', err)
                }
            }
        } catch (err) {
            console.error('创建环节失败:', err)
        }
    }
    toast(
        markRaw(
            h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
                h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
            )
        )
    )
})

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