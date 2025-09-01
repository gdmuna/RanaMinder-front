<template>
    <div
        class="relative flex flex-col items-center card dark:bg-[#E8E7E2] rounded-xl overflow-hidden cursor-pointer select-none">
        <!-- 顶部装饰 -->
        <div class="w-full h-15 flex" @click.stop="handleCheck">
            <div class="dark:bg-[#A3A2A0]">
                <SquarePlus v-show="!checkedIds?.includes(stuId)"
                    class="w-6 h-6 ml-[1.1rem] mt-[1.1rem] text-[#000000] transition-transform duration-250 hover:scale-105 active:scale-95 cursor-pointer" />
                <SquareMinus v-show="checkedIds?.includes(stuId)"
                    class="w-6 h-6 ml-[1.1rem] mt-[1.1rem] text-[#ce3030] transition-transform duration-250 hover:scale-105 active:scale-95 cursor-pointer"
                    :stroke-width="2.3" />
            </div>
            <div class="w-full h-15 dark:bg-[#A3A2A0]"></div>
            <div class="dark:bg-[#A3A2A0] text-[#000000] px-6 font-normal text-xs" style="letter-spacing: 0.2em;">
                <img src="@/assets/barcode.svg" alt="Barcode" class="w-full pt-1.5 object-contain" />
                {{ stuId }}
            </div>
        </div>

        <!-- 卡片主体 -->
        <div class="flex items-center justify-center lg:-mt-[0.5rem]" @click="handleOpen">
            <!-- 照片 -->
            <div class="bg-[#438EDB] aspect-[5/7] lg:w-[8.2rem] w-[7.2rem] rounded-lg shadow-md -ml-[1rem]">
                <img :src="photo" :alt="name" class="w-full h-full object-cover rounded-lg">
            </div>
            <!-- 信息内容 -->
            <div
                class="flex flex-col justify-center items-start lg:space-y-7 space-y-5 lg:p-6 p-3 lg:w-[17rem] sm:w-[14rem] w-[13rem] pl-[1rem]">
                <!-- 姓名 -->
                <div class="flex">
                    <span class="lg:w-[4.5rem] w-[3rem]  inline-block dark:text-[#6F6E6C]">姓名</span>
                    <span class="lg:text-xl text-[#000000] font-extrabold md:tracking-wide md:-mt-0.5">{{ name }}</span>
                </div>
                <!-- 年级 -->
                <div class="flex items-center">
                    <span class="lg:w-[4.5rem] w-[3rem] inline-block dark:text-[#6F6E6C]">年级</span>
                    <Badge>{{ grade }}</Badge>
                </div>
                <!-- 专业 -->
                <div class="flex items-center">
                    <span class="lg:w-[4.5rem] w-[3rem] inline-block dark:text-[#6F6E6C]">专业</span>
                    <Badge>{{ major }}</Badge>
                </div>
                <!-- 意向部门 -->
                <div class="flex">
                    <span class="lg:w-[4.5rem] w-[3rem] inline-block dark:text-[#6F6E6C]">意向</span>
                    <div
                        class="flex flex-1 gap-2 w-[17rem] min-w-[17rem] max-w-[17rem] overflow-x-auto whitespace-nowrap hide-scrollbar">
                        <div v-for="(item, index) in intention" :key="'dept-' + index" class="inline-block">
                            <Badge>{{ item }}</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Badge from '@/components/ui/badge/Badge.vue';
import { SquarePlus, SquareMinus } from 'lucide-vue-next';
import { ref, computed } from 'vue';

// 定义组件导出Props
const props = defineProps<{
    application?: any // 接收完整的application对象
    photo?: string
    intention?: string[]
    checkedIds: string[]
}>();

const emit = defineEmits(['check', 'open']);

// 从application中提取必要信息
const stuId = computed(() => props.application?.stu_id || '未填写');
const name = computed(() => props.application?.information?.name || '未填写');
const grade = computed(() => props.application?.information?.grade || '未填写');
const major = computed(() => props.application?.information?.major || '未填写');
const intention = computed(() => {
    // 如果传入了意向字段，直接使用
    if (props.intention && props.intention.length > 0) {
        return props.intention;
    }

    // 尝试从information中获取意向字段
    const info = props.application?.information || {};
    if (info.intention) {
        return Array.isArray(info.intention) ? info.intention : [info.intention];
    }

    // 默认值
    return ['未填写'];
});

// 照片URL处理
const photo = computed(() => {
    // 1. 如果传入了独立的photo属性，优先使用
    if (props.photo) return props.photo;
    
    // 2. 尝试从application对象的顶层（与information同级）查找photo字段
    if (props.application?.photo) {
        return props.application.photo;
    }
    
    // 3. 后备方案：尝试从information内部查找相关字段
    const info = props.application?.information || {};
    if (info.photo || info.photoUrl || info.avatar || info.image) {
        return info.photo || info.photoUrl || info.avatar || info.image;
    }
    
    // 4. 默认照片
    return '@/assets/妖精爱莉.png';
});

function handleCheck() {
    emit('check', stuId.value); // 只负责通知父组件自己被选中
}

function handleOpen() {
    emit('open');
}

</script>

<style scoped>
.card {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-style: preserve-3d;
    transform-origin: center;
    will-change: transform;
    backface-visibility: hidden;
}

.card:hover {
    transform: translateY(-5px) rotateX(5deg);
}

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
</style>