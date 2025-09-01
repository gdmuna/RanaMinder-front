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
                <!-- 使用循环渲染表单字段 -->
                <template v-for="(field, index) in formFields" :key="index">
                    <FormField v-slot="{ componentField }" :name="field.name">
                        <FormItem class="flex items-center">
                            <FormLabel class="xl:w-[4.5rem] w-[3.5rem] inline-block dark:text-[#6F6E6C] text-[1rem]">
                                {{ field.label }}
                            </FormLabel>
                            <FormControl>
                                <Input type="text" :placeholder="getFieldValue(field.key)" v-bind="componentField"
                                    class="inputBadge dark:placeholder:text-[#000000] xl:text-[0.875rem]! text-[0.675rem]!"
                                    :style="{ width: getFieldWidth(field.name) }" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </template>
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

                <div class="flex justify-between">
                    <Button
                        class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer"
                        @click="deliverCloseDetail">
                        取消
                    </Button>
                    <Button type="submit"
                        class="dark:bg-[#A3A2A0] dark:text-[#000000] font-bold text-bold xl:px-[5rem] px-[4rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                        修改
                    </Button>
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
        properties?: { [key: string]: string }; // 添加properties字段
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
    toast.info("正在提交修改...");

    try {
        const personStore = usePersonStore();
        const authStore = useAuthStore();

        // 检查用户是否登录
        if (!authStore.isAuthenticated) {
            toast.error("请先登录后再尝试更新用户信息");
            return;
        }

        // 创建基础用户数据对象
        const userData: Partial<CasdoorUser> = {
            name: person.stuId,      // 学号作为name
            owner: 'gdmu',          // owner信息
        };

        // 处理自定义属性
        const modifiedProperties: Record<string, string> = {};

        // 处理常规字段
        if (values.email && values.email !== person.email) {
            userData.email = values.email;
        }

        if (values.phoneNum && values.phoneNum !== person.phoneNum) {
            userData.phone = values.phoneNum;
        }

        if (values.gender && values.gender !== person.gender) {
            userData.gender = values.gender;
        }

        // 处理自定义属性字段
        if (values.nickName && values.nickName !== person.nickName) {
            modifiedProperties.nickname = values.nickName;
        }

        if (values.links && values.links !== person.links) {
            modifiedProperties.links = values.links;
        }

        if (values.major && values.major !== person.major) {
            modifiedProperties.major = values.major;
        }

        if (values.grade && values.grade !== person.grade) {
            modifiedProperties.grade = values.grade;
        }

        // 处理groups字段
        if (values.groups && JSON.stringify(values.groups) !== JSON.stringify(person.groups)) {
            // 过滤掉"未分配"
            userData.groups = Array.isArray(values.groups)
                ? values.groups.filter(group => group !== '未分配')
                : [];
        }

        // 只有存在修改过的属性时才添加properties字段
        if (Object.keys(modifiedProperties).length > 0) {
            userData.properties = modifiedProperties;
        }

        // 检查是否有实际需要更新的字段
        const hasChanges = Object.keys(userData).some(key => !['name', 'owner', 'id'].includes(key)) ||
            (userData.properties && Object.keys(userData.properties).length > 0);

        if (!hasChanges) {
            toast.info("没有发现任何修改");
            setTimeout(() => props.deliverCloseDetail?.(), 1000);
            return;
        }

        // 调用API更新用户信息
        console.log('准备更新用户信息:', userData);
        const result = await personStore.updateCasdoorUserInfo(userData);

        if (result) {
            toast.success("用户信息更新成功！");
            setTimeout(() => props.deliverCloseDetail?.(), 1000);
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

// 表单字段定义
const formFields = ref([
    { name: 'grade', label: '年级', key: 'grade' },
    { name: 'major', label: '专业', key: 'major' },
    { name: 'stuId', label: '学号', key: 'stuId' },
    { name: 'gender', label: '性别', key: 'gender' },
    { name: 'nickName', label: '昵称', key: 'nickName' },
    { name: 'links', label: '外链', key: 'links' },
    { name: 'email', label: '邮箱', key: 'email' },
    { name: 'phoneNum', label: '手机', key: 'phoneNum' },
])

// 字段宽度集合
const fieldWidths = computed(() => ({
    grade: gradeBadgeWidth.value,
    major: majorBadgeWidth.value,
    stuId: stuIdBadgeWidth.value,
    gender: genderBadgeWidth.value,
    nickName: nickNameBadgeWidth.value,
    links: linkBadgeWidth.value,
    email: emailBadgeWidth.value,
    phoneNum: phoneNumBadgeWidth.value
}))

// 计算属性，过滤掉"未分配"的权限组
const filteredGroups = computed(() => {
    if (!person.groups || !Array.isArray(person.groups)) return [];
    return person.groups.filter(group => group !== '未分配');
})

// 获取字段值的辅助函数
function getFieldValue(key: string): string {
    switch (key) {
        case 'stuId': return person.stuId || '';
        case 'name': return person.name || '';
        case 'grade': return person.grade || '';
        case 'major': return person.major || '';
        case 'email': return person.email || '';
        case 'phoneNum': return person.phoneNum || '';
        case 'gender': return person.gender || '';
        case 'nickName': return person.nickName || '';
        case 'links': return person.links || '';
        default: return '';
    }
}

// 获取字段宽度的辅助函数
function getFieldWidth(name: string): string {
    switch (name) {
        case 'grade': return gradeBadgeWidth.value;
        case 'major': return majorBadgeWidth.value;
        case 'stuId': return stuIdBadgeWidth.value;
        case 'gender': return genderBadgeWidth.value;
        case 'nickName': return nickNameBadgeWidth.value;
        case 'links': return linkBadgeWidth.value;
        case 'email': return emailBadgeWidth.value;
        case 'phoneNum': return phoneNumBadgeWidth.value;
        default: return 'auto';
    }
}

// 处理内部滚动事件
const { lockScroll, unlockScroll } = useScrollLock()

// 滚动容器引用
const scrollContainerRef = ref<HTMLElement | null>(null)

// 更新所有字段宽度
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

// 统一处理滚动事件的函数
function handleScroll(event: Event) {
    const container = scrollContainerRef.value;
    if (!container) return;

    if (event instanceof WheelEvent) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const deltaY = event.deltaY;

        // 判断是否在顶部或底部
        const atTop = scrollTop === 0 && deltaY < 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight && deltaY > 0;

        if (!atTop && !atBottom) {
            // 内容可滚动时，阻止外部滚动
            event.preventDefault();
            event.stopPropagation();
            container.scrollTop += deltaY;
        }
    } else {
        // 触摸事件，阻止事件传播，但允许内部滚动
        event.stopPropagation();
    }
}

// 使用统一的处理函数
const handleInnerScroll = (event: WheelEvent) => handleScroll(event);
const handleInnerTouchMove = (event: TouchEvent) => handleScroll(event);

// 初始化组件
onMounted(async () => {
    // 更新所有字段宽度
    updateAllBadgeWidths();

    // 初始化权限组宽度
    if (person.groups?.length) {
        person.groups.filter(group => group !== '未分配').forEach(group => {
            groupBadgeWidths.value.set(group, calcPlaceholderWidth(group));
        });
    }

    await nextTick();

    // 初始化滚动位置并锁定外部滚动
    if (scrollContainerRef.value) {
        scrollContainerRef.value.scrollTop = 0;
        lockScroll();
    }
});

// 组件卸载前解锁滚动
onBeforeUnmount(() => unlockScroll());

// 监听人员信息变化，更新字段宽度
watch(
    [() => person.grade, () => person.major, () => person.stuId,
    () => person.email, () => person.phoneNum, () => person.gender],
    updateAllBadgeWidths
);

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