<template>
    <div
        class="relative dark:bg-[#E8E7E2] rounded-xl overflow-hidden select-none md:w-auto min-w-[36%] md:max-w-[36%] w-full max-h-[80vh] flex flex-col">
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
        <!-- 卡片主体 - 添加滚动区域 -->
        <div class="xl:space-y-13 md:space-y-8 space-y-9 xl:p-6 p-5 overflow-y-auto scrollbar-hide flex-grow"
            ref="scrollContainerRef">
            <!-- 基本信息字段 -->
            <div v-for="(value, key) in displayableInfo" :key="key" class="flex items-center">
                <span class="xl:w-[5rem] w-[4rem] inline-block dark:text-[#6F6E6C]">{{ formatLabel(key) }}</span>
                <!-- 特殊处理姓名字段，保留原来的放大效果 -->
                <template v-if="key === 'name'">
                    <span class="text-xl text-[#000000] font-extrabold md:tracking-wide md:-mt-0.5">{{ value }}</span>
                </template>
                <!-- 数组类型字段 -->
                <template v-else-if="Array.isArray(value)">
                    <div class="flex space-x-5">
                        <span v-for="(item, idx) in value" :key="idx"
                            class="inputBadge xl:text-[0.875rem]! text-[0.675rem]!">{{ item }}</span>
                    </div>
                </template>
                <!-- 其他普通字段 -->
                <template v-else>
                    <span class="inputBadge xl:text-[0.875rem]! text-[0.675rem]! md:max-w-[25rem] max-w-[21rem]">{{ value }}</span>
                </template>
            </div>

            <!-- <div class="flex mt-5 justify-between">
                <div class="flex">
                    <Button
                        class="dark:bg-[#D78888] dark:text-[#000000] font-bold text-bold xl:px-[3rem] px-[2rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                        未通过
                    </Button>
                </div>
                <div class="flex">
                    <Button
                        class="dark:bg-[#E0D178] dark:text-[#000000] font-bold text-bold xl:px-[3rem] px-[2rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                        待定
                    </Button>
                </div>
                <div class="flex">
                    <Button type="submit"
                        class="dark:bg-[#8CBCA4] dark:text-[#000000] font-bold text-bold xl:px-[3rem] px-[2rem] py-[1.5rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer">
                        通过
                    </Button>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { Minimize2 } from 'lucide-vue-next';
import { computed, ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { Button } from '@/components/ui/button'

// 弹窗显示时禁止body滚动，关闭时恢复，并保持原滚动位置
let scrollY = 0;
onMounted(() => {
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
});
onBeforeUnmount(() => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, scrollY);
});

// 滚动容器引用
const scrollContainerRef = ref<HTMLElement | null>(null);

// 定义组件导出Props
const props = defineProps<{
    person?: {
        id?: number;
        stuId: string;
        name: string;
        intention: string[];
        intendedDepartment?: string; // 添加这个字段，表示后端可能会传递这个数据
        grade: string;
        major: string;
        email?: string;
        phoneNum?: string;
        information?: Record<string, any>;
    }
    deliverCloseDetail?: () => void
}>();

// 设置默认值
const {
    person = {
        id: 0,
        stuId: '',
        name: '',
        intention: [],
        intendedDepartment: '',
        grade: '',
        major: '',
        email: '',
        phoneNum: '',
        information: {}
    }
} = props;

// 处理字段显示顺序和过滤
const displayableInfo = computed(() => {
    const result: Record<string, any> = {};

    // 核心字段（小卡片）
        result['name'] = person.name;
        result['intendedDepartment'] = person.intendedDepartment;
        result['grade'] = person.grade;
        result['major'] = person.major;
        result['stuId'] = person.stuId;
        if (person.email) result['email'] = person.email;
        if (person.phoneNum) result['phone'] = person.phoneNum;

        // 跳过所有学号和手机号相关字段
        if (person.information) {
            const skipFields = [
                'name', 'intention', 'grade', 'major', 'stuId', 'studentNumber',
                'email', 'phone', 'phoneNum', 'phoneNumber', 'id', 'createdAt', 'updatedAt', 'photo'
            ];
            for (const [key, value] of Object.entries(person.information)) {
                if (!skipFields.includes(key) && value !== null && value !== undefined) {
                    result[key] = value;
                }
            }
        }
        return result;
    });

// 格式化标签名称
function formatLabel(key: string): string {
    const labelMap: Record<string, string> = {
        'name': '姓名',
        'intendedDepartment': '意向',
        'grade': '年级',
        'college': '学院',
        'major': '专业',
        'stuId': '学号',
        'studentNumber': '学号',
        'phoneNumber': '手机号',
        'email': '邮箱',
        'phone': '手机',
        'sex': '性别',
        'age': '年龄',
        'address': '住址',
        'nation': '民族',
        'politicalStatus': '政治面貌',
        'nativePlace': '籍贯',
        'education': '学历',
        'wechatId': '微信号',
        'qqNumber': 'QQ号',
        "intentionToStay": "未来意向",
        "hobbiesAndSpecialties": "爱好",
        "previousPositions": "过往职位",
        "honorsReceived": "曾获荣誉",
        "selfEvaluation": "自我评价",
    };

    return labelMap[key] || key;
}

// 在组件挂载后初始化滚动行为
onMounted(async () => {
    // 等待DOM更新
    await nextTick();
    // 确保滚动容器存在
    if (scrollContainerRef.value) {
        // 初始化滚动位置
        scrollContainerRef.value.scrollTop = 0;

        // 添加滚轮事件监听
        scrollContainerRef.value.addEventListener('wheel', handleWheel, { passive: false });
    }
});

// 处理滚轮事件
function handleWheel(event: WheelEvent) {
    if (!scrollContainerRef.value) return;

    // 获取滚动容器
    const container = scrollContainerRef.value;

    // 计算新的滚动位置
    const scrollAmount = event.deltaY;
    const newScrollTop = container.scrollTop + scrollAmount;

    // 检查是否已经到达顶部或底部边界
    const isAtTop = container.scrollTop === 0 && scrollAmount < 0;
    const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 1 && scrollAmount > 0;

    // 如果没有到达边界，阻止事件传播，使滚动仅发生在卡片内
    if (!isAtTop && !isAtBottom) {
        event.preventDefault();
        container.scrollTop = newScrollTop;
    }
}

// 组件卸载前清理事件监听器
onBeforeUnmount(() => {
    if (scrollContainerRef.value) {
        scrollContainerRef.value.removeEventListener('wheel', handleWheel);
    }
});
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

.inputBadge {
    display: inline-block;
    border-radius: 15px;
    width: auto;
    padding: 0.5rem 1rem;
    background-color: #8FAFC4;
    color: #000000;
    font-weight: bold;
    border: none;
    outline: none;
    box-shadow: none;
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