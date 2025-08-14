<script setup lang="ts">
import { reactive } from 'vue'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from '@/components/ui/switch'
import { Button } from "@/components/ui/button"

const formData = reactive<InterviewForm>({
    active: false,
    name: '',
    description: '',
    startTime: '',
    stages: []
})

interface InterviewForm {
    active: boolean
    name: string
    description: string
    startTime: string
    stages: Stage[]
}

interface Stage {
    title: string
    startTime: string
    active: boolean
    sessions: Session[]
}

interface Session {
    title: string
    location: string
    timeSlots: TimeSlot[]
}

interface TimeSlot {
    startTime: string
    maxSeats: number
}

function addStage() {
    formData.stages.push({
        title: '',
        startTime: '',
        active: true,
        sessions: []
    })
}

function removeStage(index: number) {
    formData.stages.splice(index, 1)
}

function addSession(stageIndex: number) {
    formData.stages[stageIndex].sessions.push({
        title: '',
        location: '',
        timeSlots: []
    })
}

function removeSession(stageIndex: number, sessionIndex: number) {
    formData.stages[stageIndex].sessions.splice(sessionIndex, 1)
}

function addTimeSlot(stageIndex: number, sessionIndex: number) {
    formData.stages[stageIndex].sessions[sessionIndex].timeSlots.push({
        startTime: '',
        maxSeats: 0
    })
}

function removeTimeSlot(stageIndex: number, sessionIndex: number, slotIndex: number) {
    formData.stages[stageIndex].sessions[sessionIndex].timeSlots.splice(slotIndex, 1)
}

function submitForm() {
    console.log('提交数据：', JSON.stringify(formData, null, 2))
}
</script>

<template>
    <Form @submit.prevent="submitForm">
        <!-- 面试基础信息 -->
        <FormField name="active">
            <FormItem>
                <FormLabel>面试是否激活</FormLabel>
                <FormControl>
                    <Switch v-model:checked="formData.active" />
                </FormControl>
            </FormItem>
        </FormField>

        <FormField name="name">
            <FormItem>
                <FormLabel>面试名称</FormLabel>
                <FormControl>
                    <Input v-model="formData.name" />
                </FormControl>
            </FormItem>
        </FormField>

        <FormField name="description">
            <FormItem>
                <FormLabel>面试描述</FormLabel>
                <FormControl>
                    <Textarea v-model="formData.description" />
                </FormControl>
            </FormItem>
        </FormField>

        <FormField name="startTime">
            <FormItem>
                <FormLabel>面试起始时间</FormLabel>
                <FormControl>
                    <Input type="datetime-local" v-model="formData.startTime" />
                </FormControl>
            </FormItem>
        </FormField>

        <!-- 面试环节 -->
        <div>
            <h3 class="mt-6 mb-2 font-bold">面试环节</h3>
            <Button type="button" @click="addStage">添加环节</Button>

            <div v-for="(stage, sIndex) in formData.stages" :key="sIndex" class="border p-4 mt-4 rounded-lg">
                <div class="flex justify-between items-center">
                    <h4 class="font-semibold">环节 {{ sIndex + 1 }}</h4>
                    <Button variant="destructive" type="button" @click="removeStage(sIndex)">删除环节</Button>
                </div>

                <Input placeholder="环节标题" v-model="stage.title" class="mt-2" />
                <Input type="datetime-local" placeholder="环节开始时间" v-model="stage.startTime" class="mt-2" />
                <div class="flex items-center gap-2 mt-2">
                    <Switch v-model:checked="stage.active" />
                    <span>是否激活</span>
                </div>

                <!-- 场次 -->
                <div class="mt-4">
                    <h5 class="font-medium">场次</h5>
                    <Button type="button" size="sm" @click="addSession(sIndex)">添加场次</Button>

                    <div v-for="(session, seIndex) in stage.sessions" :key="seIndex" class="border p-3 mt-3 rounded">
                        <div class="flex justify-between items-center">
                            <h6>场次 {{ seIndex + 1 }}</h6>
                            <Button variant="destructive" type="button" size="sm"
                                @click="removeSession(sIndex, seIndex)">删除场次</Button>
                        </div>

                        <Input placeholder="场次标题" v-model="session.title" class="mt-2" />
                        <Input placeholder="地点" v-model="session.location" class="mt-2" />

                        <!-- 时间段 -->
                        <div class="mt-3">
                            <h6 class="text-sm font-medium">时间段</h6>
                            <Button type="button" size="sm" @click="addTimeSlot(sIndex, seIndex)">添加时间段</Button>

                            <div v-for="(slot, tIndex) in session.timeSlots" :key="tIndex"
                                class="border p-2 mt-2 rounded">
                                <div class="flex justify-between">
                                    <span>时间段 {{ tIndex + 1 }}</span>
                                    <Button variant="destructive" size="sm" type="button"
                                        @click="removeTimeSlot(sIndex, seIndex, tIndex)">删除</Button>
                                </div>
                                <Input type="datetime-local" placeholder="起始时间" v-model="slot.startTime" class="mt-2" />
                                <Input type="number" placeholder="最大座位数" v-model="slot.maxSeats" class="mt-2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 提交按钮 -->
        <Button type="submit" class="mt-6">提交</Button>
    </Form>
</template>
