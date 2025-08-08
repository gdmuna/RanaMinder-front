<template>
    <div class="relative dark:bg-[#E8E7E2] rounded-xl overflow-hidden select-none w-[35%]">
        <!-- 顶部装饰 -->
        <div class="w-full h-16 flex">
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5">
                <Minimize2 />
            </div>
            <div class="w-full h-16 dark:bg-[#A3A2A0]"></div>
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 font-normal text-xs" style="letter-spacing: 0.2em;">
                <img src="@/assets/barcode.svg" alt="Barcode" class="w-full pt-1.5 object-contain" />
                {{ stuId }}
            </div>
        </div>
        <!-- 卡片主体 -->
        <form @submit="onSubmit">
            <!-- 卡片内容 -->
            <div class="space-y-13 lg:p-6 p-3">
                <!-- 姓名 -->
                <div class="flex">
                    <span class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C]">姓名</span>
                    <span class="md:text-xl text-[#000000] font-extrabold md:tracking-wide md:-mt-0.5">{{ name }}</span>
                </div>
                <!-- 部门 -->
                <div class="flex">
                    <span class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C]">部门</span>
                    <div class="flex flex-1 gap-2 w-[17rem] min-w-[17rem] max-w-[17rem] overflow-x-
                        auto whitespace-nowrap hide-scrollbar">
                        <div v-for="(item, index) in department" :key="'dept-' + index" class="inline-block">
                            <Badge>{{ item }}</Badge>
                        </div>
                    </div>
                </div>
                <!-- 年级 -->
                <FormField v-slot="{ componentField }" name="grade">
                    <FormItem class="flex items-center">
                        <FormLabel class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">年级
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="grade" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000]"
                                :style="{ width: gradeBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 专业 -->
                <FormField v-slot="{ componentField }" name="major">
                    <FormItem class="flex items-center">
                        <FormLabel class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">专业
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="major" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000]"
                                :style="{ width: majorBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 学号 -->
                <FormField v-slot="{ componentField }" name="stuId">
                    <FormItem class="flex items-center">
                        <FormLabel class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">学号
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="stuId" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000]"
                                :style="{ width: stuIdBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 邮箱 -->
                <FormField v-slot="{ componentField }" name="email">
                    <FormItem class="flex items-center">
                        <FormLabel class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">邮箱
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="email" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000]"
                                :style="{ width: emailBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 手机号 -->
                <FormField v-slot="{ componentField }" name="phoneNum">
                    <FormItem class="flex items-center">
                        <FormLabel class="md:w-[5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">手机号
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="phoneNum" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000]"
                                :style="{ width: phoneNumBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';
import TagSelect from '@/components/tagSelect.vue'
import { Minimize2 } from 'lucide-vue-next';

// 定义组件导出Props
const props = defineProps<{
    name?: string
    department?: string[]
    grade?: string
    major?: string
    stuId?: string
    email?: string
    phoneNum?: string
}>();

// 设置默认值
const {
    name = '测试',
    department = ['网络协会', '会长团', '会长'],
    grade = '2024级',
    major = '导弹维修与技术',
    stuId = '24201111000',
    email = '123456789@qq.com',
    phoneNum = '13800000000',
} = props;





import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = toTypedSchema(z.object({
    username: z.string().min(2).max(50),
}))

const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
    console.log('Form submitted!', values)
})
import { ref, onMounted, watch } from 'vue'

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
    span.style.fontSize = '0.875rem'
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
    gradeBadgeWidth.value = calcPlaceholderWidth(grade)
    majorBadgeWidth.value = calcPlaceholderWidth(major)
    stuIdBadgeWidth.value = calcPlaceholderWidth(stuId)
    emailBadgeWidth.value = calcPlaceholderWidth(email)
    phoneNumBadgeWidth.value = calcPlaceholderWidth(phoneNum)
}

watch(
    [() => grade, () => major, () => stuId, () => email, () => phoneNum],
    updateAllBadgeWidths
)

</script>

<style scoped>
.hide-scrollbar {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari/Opera */
}

.inputBadge {
    display: inline-block;
    border-radius: 999px;
    background-color: #8FAFC4;
    color: #000000;
    font-size: 0.875rem;
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
    outline: none;
}
</style>