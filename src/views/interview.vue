<template>
    <div>
        <div class="flex flex-col items-center mt-[5rem] mb-[2rem]">
            <div>
                <div v-for="(item, index) in interviews" :key="item.id" class="mb-8">
                    <InterviewShow
                        :title="item.title"
                        :time="item.time"
                        :color="colors[index % colors.length]"
                        :gradient="gradients[index % gradients.length]"
                    />
                </div>
                <!-- 创建新面试 --><NewInterview/>
                
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// 逻辑代码
import InterviewShow from '@/components/interviewShow.vue';
import NewInterview from '@/components/newInterview.vue';
// 伪数据
const interviews = [
    { id: 1, title: '2024年干事招新面试干事招新面试', time: new Date('2024-09-12T14:00:00') },
    { id: 2, title: '2024年干部招新', time: new Date('2024-12-13T10:30:00') },
    { id: 3, title: '2025年干事招新', time: new Date('2025-09-14T09:00:00') },
    { id: 4, title: '2025年干部招新', time: new Date('2025-12-15T16:00:00') },
    { id: 5, title: '2026年干事招新', time: new Date('2026-09-16T15:00:00') },
    { id: 6, title: '2026年干部招新', time: new Date('2026-12-17T17:00:00') },
    { id: 7, title: '2027年干事招新', time: new Date('2027-09-18T14:00:00') },
    { id: 8, title: '2027年干部招新', time: new Date('2027-12-19T10:30:00') },
    { id: 9, title: '2028年干事招新', time: new Date('2028-09-20T13:00:00') },
    { id: 10, title: '2028年干部招新', time: new Date('2028-12-21T11:00:00') },
];
// 颜色
const colors = ['#0A90B4', '#A6C1EE', '#C4E0E5', '#FCB69F', '#71B280', '#DECBA4'];
// 渐变色
const gradients = [
    'linear-gradient(270deg, #71B280 0%, #0A90B4 100%)',
    'linear-gradient(270deg, #FBC2EB 0%, #A6C1EE 100%)',
    'linear-gradient(270deg, #4CA1AF 0%, #C4E0E5 100%)',
    'linear-gradient(270deg, #FCB69F 0%, #FFECD2 100%)',
    'linear-gradient(270deg, #71B280 0%, #FBC2EB 100%)',
    'linear-gradient(270deg, #DECBA4 0%, #BDC3C7 100%)',
];
</script>

<style scoped>
/* 样式 */
</style>