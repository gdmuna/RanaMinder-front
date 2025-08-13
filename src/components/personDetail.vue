<template>
    <div class="relative dark:bg-[#E8E7E2] rounded-xl overflow-hidden select-none md:w-auto min-w-[36%] w-full h-auto">
        <!-- 顶部装饰 -->
        <div class="w-full h-16 flex">
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5 cursor-pointer" @click="deliverCloseDetail">
                <Minimize2 />
            </div>
            <div class="w-full h-16 dark:bg-[#A3A2A0]"></div>
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 font-normal text-xs" style="letter-spacing: 0.2em;">
                <img src="@/assets/barcode.svg" alt="Barcode" class="w-full pt-1.5 object-contain" />
                {{ person.stuId }}
            </div>
        </div>
        <!-- 卡片主体 -->
        <form @submit="onSubmit">
            <!-- 卡片内容 -->
            <div class="xl:space-y-13 md:space-y-8 space-y-9 xl:p-6 p-5">
                <!-- 姓名 -->
                <div class="flex">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">姓名</span>
                    <span class="text-xl text-[#000000] font-extrabold md:tracking-wide md:-mt-0.5">{{ person.name }}</span>
                </div>
                <div class="flex space-x-5">
                    <!-- 协会 -->
                    <FormField v-slot="{ componentField }" name="association">
                        <FormItem class="flex items-center">
                            <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">部门
                            </FormLabel>
                            <FormControl>
                                <Select v-bind="componentField">
                                    <SelectTrigger class="select-trigger">
                                        <SelectValue :placeholder="person.department[0]" class="select-value xl:text-[0.875rem] text-[0.675rem]" />
                                    </SelectTrigger>
                                    <SelectContent class="dark:bg-[#A3A2A0] border-0 dark:text-[#000000]">
                                        <SelectItem value="网络协会">网络协会</SelectItem>
                                        <SelectItem value="ACM协会">ACM协会</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- 具体部门 -->
                    <FormField v-slot="{ componentField }" name="department">
                        <FormItem>
                            <FormControl>
                                <Select v-bind="componentField">
                                    <SelectTrigger class="select-trigger">
                                        <SelectValue :placeholder="person.department[1]" class="select-value xl:text-[0.875rem] text-[0.675rem]" />
                                    </SelectTrigger>
                                    <SelectContent class="dark:bg-[#A3A2A0] border-0 dark:text-[#000000]">
                                        <SelectItem value="会长团">会长团</SelectItem>
                                        <SelectItem value="宣传部">宣传部</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <!-- 职位 -->
                    <FormField v-slot="{ componentField }" name="position">
                        <FormItem>
                            <FormControl>
                                <Select v-bind="componentField">
                                    <SelectTrigger class="select-trigger">
                                        <SelectValue :placeholder="person.department[1]" class="select-value xl:text-[0.875rem] text-[0.675rem]" />
                                    </SelectTrigger>
                                    <SelectContent class="dark:bg-[#A3A2A0] border-0 dark:text-[#000000]">
                                        <SelectItem value="会长">会长</SelectItem>
                                        <SelectItem value="副会长">副会长</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                <!-- 年级 -->
                <FormField v-slot="{ componentField }" name="grade">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">年级
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.grade" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: gradeBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 专业 -->
                <FormField v-slot="{ componentField }" name="major">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">专业
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.major" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: majorBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 学号 -->
                <FormField v-slot="{ componentField }" name="stuId">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">学号
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.stuId" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: stuIdBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 邮箱 -->
                <FormField v-slot="{ componentField }" name="email">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">邮箱
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.email" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: emailBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 手机号 -->
                <FormField v-slot="{ componentField }" name="phoneNum">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">手机
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.phoneNum" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: phoneNumBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <div class="flex">
                    <div class="flex justify-start">
                        <Button type="submit"
                            class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                            修改
                        </Button>
                    </div>
                    <div class="flex flex-1 justify-end">
                        <Button
                            class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                            @click="deliverCloseDetail">
                            取消
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { Minimize2 } from 'lucide-vue-next';

import { ref, onMounted, watch } from 'vue'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { h, markRaw } from 'vue'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'vue-sonner';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// 定义组件导出Props
const props = defineProps<{
    person?: {
        stuId: string;
        name: string;
        department: string[];
        grade: string;
        major: string;
        email: string;
        phoneNum: string;
    }
    deliverCloseDetail?: () => void
}>();

// 设置默认值
const {
    person = {
        stuId: '',
        name: '',
        department: [],
        grade: '',
        major: '',
        email: '',
        phoneNum: ''
    }
} = props;

const formSchema = toTypedSchema(z.object({
    association: z.string().min(2).max(50),
    department: z.string().min(2).max(50),
    position: z.string().min(2).max(50),
    grade: z.string().min(2).max(50),
    major: z.string().min(2).max(50),
    stuId: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
    phoneNum: z.string().min(2).max(50),
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
    toast(
        markRaw(
            h("pre", { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
                h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
            )
        )
    )
})

const gradeBadgeWidth = ref<string>('auto')
const majorBadgeWidth = ref<string>('auto')
const stuIdBadgeWidth = ref<string>('auto')
const emailBadgeWidth = ref<string>('auto')
const phoneNumBadgeWidth = ref<string>('auto')

// 动态计算 placeholder 宽度
function calcPlaceholderWidth(text: string) {
    const span = document.createElement('span')
    span.style.visibility = 'hidden'
    span.style.position = 'absolute'
    if (window.innerWidth >= 1280) { // xl 及以上
        span.style.fontSize = '0.875rem'
    } else { // 小屏
        span.style.fontSize = '0.675rem'
    }
    span.style.fontWeight = 'bold'
    span.style.padding = '0.25rem 0.75rem'
    span.style.fontFamily = 'inherit'
    span.innerText = text
    document.body.appendChild(span)
    const width = span.offsetWidth
    document.body.removeChild(span)
    return `${width + 3}px`
}

onMounted(() => {
    updateAllBadgeWidths()
})

function updateAllBadgeWidths() {
gradeBadgeWidth.value = calcPlaceholderWidth(person.grade ?? '')
majorBadgeWidth.value = calcPlaceholderWidth(person.major ?? '')
stuIdBadgeWidth.value = calcPlaceholderWidth(person.stuId ?? '')
emailBadgeWidth.value = calcPlaceholderWidth(person.email ?? '')
phoneNumBadgeWidth.value = calcPlaceholderWidth(person.phoneNum ?? '')
}

watch(
    [() => person.grade, () => person.major, () => person.stuId, () => person.email, () => person.phoneNum],
    updateAllBadgeWidths
)

</script>

<style scoped>
.inputBadge {
    display: inline-block;
    border-radius: 999px;
    background-color: #8FAFC4;
    color: #000000;
    font-weight: bold;
    border: none;
    outline: none;
    box-shadow: none;
    transform: scale(1);
    transition: transform 0.25s ease-in-out;
}

.inputBadge:focus {
    transform: scale(1.1);
    transition: transform 0.25s ease-in-out;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
    outline: none;
}

.select-value {
    font-weight: bold;
    color: #000000;
}

.select-trigger {
    border-radius: 999px;
    background-color: #8FAFC4;
    height: auto;
    border: none;
    outline: none;
    box-shadow: none;
}
</style>