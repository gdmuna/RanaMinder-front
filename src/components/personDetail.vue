<template>
    <div
        class="relative dark:bg-[#E8E7E2] rounded-xl overflow-hidden select-none md:w-auto min-w-[36%] w-full max-h-[80vh] flex flex-col">
        <!-- 顶部装饰 -->
        <div class="w-full h-16 flex shrink-0">
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 py-5 cursor-pointer flex items-center"
                @click="deliverCloseDetail">
                <Minimize2 />
            </div>
            <div class="w-full h-16 dark:bg-[#A3A2A0]"></div>
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 font-normal text-xs" style="letter-spacing: 0.2em;">
                <img src="@/assets/barcode.svg" alt="Barcode" class="w-full pt-1.5 object-contain" />
                {{ person.stuId }}
            </div>
        </div>
        <!-- 卡片主体 -->
        <form @submit="onSubmit" class="flex-grow">
            <!-- 卡片内容 -->
            <div class="xl:space-y-13 md:space-y-8 space-y-9 xl:p-6 p-5 overflow-y-auto scrollbar-hide"
                style="max-height: calc(80vh - 4rem);" ref="scrollContainerRef" @wheel="handleInnerScroll"
                @touchmove="handleInnerTouchMove">
                <!-- 姓名 -->
                <div class="flex">
                    <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">姓名</span>
                    <span class="text-xl text-[#000000] font-extrabold md:tracking-wide md:-mt-0.5">{{ person.name
                    }}</span>
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
                <!-- 性别 -->
                <FormField v-slot="{ componentField }" name="gender">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">性别
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.gender" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: genderBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 昵称 -->
                <FormField v-slot="{ componentField }" name="nickName">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">昵称
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.nickName" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: nickNameBadgeWidth }" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <!-- 外链 -->
                <FormField v-slot="{ componentField }" name="links">
                    <FormItem class="flex items-center">
                        <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">外链
                        </FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="person.links" v-bind="componentField"
                                class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                :style="{ width: linkBadgeWidth }" />
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
                <!-- 权限组信息 -->
                <div class="flex">
                    <div class="flex items-start">
                        <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">权限</span>
                    </div>
                    <div class="flex flex-col xl:space-y-13 md:space-y-8 space-y-9 -mt-[0.3rem]">
                        <div v-for="(group, index) in filteredGroups" :key="index" class="flex flex-col">
                            <FormField v-slot="{ componentField }" :name="`groups[${index}]`">
                                <FormItem class="flex items-center">
                                    <FormControl>
                                        <Select v-bind="componentField">
                                            <SelectTrigger class="select-trigger">
                                                <SelectValue :placeholder="group"
                                                    class="select-value xl:text-[0.875rem] text-[0.675rem]" />
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
                        </div>
                    </div>
                </div>

                <div class="flex">
                    <div class="flex flex-1 justify-start">
                        <Button
                            class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                            @click="deliverCloseDetail">
                            取消
                        </Button>
                    </div>
                    <div class="flex justify-start">
                        <Button type="submit"
                            class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                            修改
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { Minimize2 } from 'lucide-vue-next';

import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import { useScrollLock } from '@/lib/useScrollLock'
import { usePersonStore } from '@/stores/person'
import { useAuthStore } from '@/stores/auth'
import type { CasdoorUser } from '@/types/person'

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
        id?: string;         // 添加id字段
        stuId: string;
        name: string;
        grade: string;
        major: string;
        email: string;
        phoneNum: string;
        gender: string;
        avatar: string;
        groups?: string[];
        nickName?: string;
        links?: string;
        properties?: {[key: string]: string}; // 添加properties字段
    }
    deliverCloseDetail?: () => void
}>();

// 设置默认值
const {
    person = {
        stuId: '未填写',
        name: '未填写',
        grade: '未填写',
        major: '未填写',
        email: '未填写',
        phoneNum: '未填写',
        gender: '未知',
        avatar: '',
        groups: [], // 改为空数组，不再默认为['未分配']
        nickName: '未填写',
        links: '未填写',
    }
} = props;

const formSchema = toTypedSchema(z.object({
    groups: z.preprocess(
        // 预处理任何输入
        val => val === null || val === undefined || (Array.isArray(val) && val.length === 0) ? undefined : val,
        // 验证预处理后的值
        z.array(z.string()).optional()
    ),
    grade: z.string().regex(/^\d{4}级$/, "年级格式错误").max(50).optional(),
    major: z.string().max(50).optional(),
    stuId: z.string().regex(/^\d{11}$/, "学号格式错误").max(50).optional(),
    email: z.string().email("邮箱格式错误").optional(),
    phoneNum: z.string().regex(/^1\d{10}$/, "手机号格式错误").max(50).optional(),
    gender: z.string().max(10).optional(),
    nickName: z.string().max(50).optional(),
    links: z.string().url('外链格式错误').max(200).optional(),
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
    initialValues: {
        // 确保初始值与验证规则匹配 - 过滤掉"未分配"
        groups: person.groups && person.groups.length > 0
            ? person.groups.filter(group => group !== '未分配')
            : undefined,
    }
})

const onSubmit = handleSubmit(async (values) => {
    // 处理提交的数据，确保空数组不传递
    const cleanedValues = { ...values };

    // 处理groups字段
    if (Array.isArray(cleanedValues.groups)) {
        // 过滤掉"未分配"值
        cleanedValues.groups = cleanedValues.groups.filter(group => group !== '未分配');

        // 如果过滤后数组为空，从提交数据中移除groups字段
        if (cleanedValues.groups.length === 0) {
            delete cleanedValues.groups;
        }
    }

    // 显示表单数据（可选）
    toast.info("正在提交修改...");

    // 调用personStore的updateUser方法
    try {
        // 初始化personStore
        const personStore = usePersonStore();
        
        // 确保person对象存在
        const personData = person || {
            stuId: '',
            name: '',
            email: '',
            phoneNum: '',
            gender: '',
            groups: [],
            properties: {}
        };
        
        // 准备用户数据 - 合并当前用户数据与表单数据
        const userData: CasdoorUser = {
            id: personData.id || '',     // 确保ID存在
            name: personData.stuId,      // 学号作为name
            owner: 'gdmu',
            
            // 可能会被修改的字段
            displayName: personData.name,  // 真实姓名
            email: cleanedValues.email || personData.email,
            phone: cleanedValues.phoneNum || personData.phoneNum,
            gender: cleanedValues.gender || personData.gender,
            groups: cleanedValues.groups || personData.groups,
            
            // 自定义属性
            properties: {
                ...(personData.properties || {}),  // 保留现有属性
                nickname: cleanedValues.nickName || personData.nickName || '',
                links: cleanedValues.links || personData.links || '',
                major: cleanedValues.major || personData.major || '',
                grade: cleanedValues.grade || personData.grade || ''
            }
        };
        
        // 调用personStore的updateCasdoorUserInfo方法
        console.log('准备调用updateCasdoorUserInfo，userData:', userData);
        
        // 检查 authStore 中是否有 token
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated) {
            console.error('用户未登录，无法更新用户信息');
            toast.error("请先登录后再尝试更新用户信息");
            return;
        }
        
        const result = await personStore.updateCasdoorUserInfo(userData);
        console.log('更新结果:', result);
        
        if (result) {
            toast.success("用户信息更新成功！");
            
            // 如果有传入关闭函数，则调用
            if (props.deliverCloseDetail) {
                setTimeout(() => {
                    props.deliverCloseDetail?.();
                }, 1000);
            }
        } else {
            toast.error("更新失败: 请检查输入是否正确");
        }
    } catch (error: any) {
        console.error('更新用户信息时发生错误:', error);
        toast.error(`更新失败: ${error?.message || '未知错误'}`);
    }
})

const gradeBadgeWidth = ref<string>('auto')
const majorBadgeWidth = ref<string>('auto')
const stuIdBadgeWidth = ref<string>('auto')
const emailBadgeWidth = ref<string>('auto')
const phoneNumBadgeWidth = ref<string>('auto')
const genderBadgeWidth = ref<string>('auto')
const nickNameBadgeWidth = ref<string>('auto')
const linkBadgeWidth = ref<string>('auto')
const groupBadgeWidths = ref<Map<string, string>>(new Map())

// 计算属性，过滤掉"未分配"的权限组
const filteredGroups = computed(() => {
    if (!person.groups || !Array.isArray(person.groups)) return [];
    return person.groups.filter(group => group !== '未分配');
})

// 处理内部滚动事件
const { lockScroll, unlockScroll } = useScrollLock()

// 滚动容器引用
const scrollContainerRef = ref<HTMLElement | null>(null)

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

// 处理内部滚轮滚动
function handleInnerScroll(event: WheelEvent) {
    const container = scrollContainerRef.value;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const deltaY = event.deltaY;

    // 判断是否在顶部或底部
    const atTop = scrollTop === 0 && deltaY < 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight && deltaY > 0;

    if (atTop || atBottom) {
        // 到达边界，允许外部滚动
        return;
    }

    // 内容可滚动时，阻止外部滚动
    event.preventDefault();
    event.stopPropagation();
    container.scrollTop += deltaY;
}

// 处理内部触摸滚动
function handleInnerTouchMove(event: TouchEvent) {
    if (!scrollContainerRef.value) return

    // 阻止事件传播，但允许内部滚动
    event.stopPropagation()
}

// 初始化组件
onMounted(async () => {
    updateAllBadgeWidths()

    // 初始化权限组宽度
    if (person.groups && person.groups.length) {
        // 仅处理非"未分配"的组
        person.groups.filter(group => group !== '未分配').forEach(group => {
            groupBadgeWidths.value.set(group, calcPlaceholderWidth(group))
        })
    }

    // 等待DOM更新
    await nextTick()

    // 确保滚动容器存在
    if (scrollContainerRef.value) {
        // 初始化滚动位置
        scrollContainerRef.value.scrollTop = 0

        // 锁定外部滚动
        lockScroll()

    } else {
    }
})

// 组件卸载前清理
onBeforeUnmount(() => {
    // 恢复外部滚动
    unlockScroll()
})

function updateAllBadgeWidths() {
    gradeBadgeWidth.value = calcPlaceholderWidth(person.grade ?? '')
    majorBadgeWidth.value = calcPlaceholderWidth(person.major ?? '')
    stuIdBadgeWidth.value = calcPlaceholderWidth(person.stuId ?? '')
    emailBadgeWidth.value = calcPlaceholderWidth(person.email ?? '')
    phoneNumBadgeWidth.value = calcPlaceholderWidth(person.phoneNum ?? '')
    genderBadgeWidth.value = calcPlaceholderWidth(person.gender ?? '')
    nickNameBadgeWidth.value = calcPlaceholderWidth(person.nickName ?? '')
    linkBadgeWidth.value = calcPlaceholderWidth(person.links ?? '')
}

watch(
    [() => person.grade, () => person.major, () => person.stuId, () => person.email, () => person.phoneNum, () => person.gender],
    updateAllBadgeWidths
)

</script>

<style scoped>
.scrollbar-hide {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    /* 为iOS设备添加平滑滚动 */
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari/Opera */
}

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