<template>
    <div
        class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-14 gap-5 md:px-15 px-5 py-5 mt-[3.5rem] mb-[2.5rem] md:max-w-full max-w-[30rem] mx-auto">
        <InterviewCard v-for="person in personList" :key="person.stuId" :name="person.name"
            :intention="person.intention" :grade="person.grade" :major="person.major" :stuId="person.stuId"
            :checkedIds="checkedIds" @check="handleCheck" @click="handleOpen(person)" />
    </div>
    <!-- 底部导航栏 -->
    <teleport to="body">
        <BottomBar :checkedIds="checkedIds" />
    </teleport>
    <!-- 面试者详细卡片弹窗 -->
    <teleport to="body">
        <Transition name="fade">
            <div v-if="showPersonDetail"
                class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center md:justify-center flex-col justify-end"
                @click.self="closeDetail">
                <InterviewDetail :person="selectedPerson" :deliverCloseDetail="closeDetail" />
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">

import { ref, watch } from 'vue'
import InterviewCard from '@/components/interviewCard.vue';
import InterviewDetail from '@/components/interviewDetail.vue'
import BottomBar from '@/components/bottomBar.vue'

// 展示/关闭详情相关
const showPersonDetail = ref(false)
const selectedPerson = ref<{
    stuId: string;
    name: string;
    intention: string[];
    grade: string;
    major: string;
    email: string;
    phoneNum: string;
} | undefined>(undefined);

function showDetail(person: {
    stuId: string;
    name: string;
    intention: string[];
    grade: string;
    major: string;
    email: string;
    phoneNum: string;
}) {
    selectedPerson.value = person
    showPersonDetail.value = true
}

function closeDetail() {
    showPersonDetail.value = false
    selectedPerson.value = undefined
}

function handleOpen(person: {
    stuId: string;
    name: string;
    intention: string[];
    grade: string;
    major: string;
    email: string;
    phoneNum: string;
}) {
    showDetail(person);
}

// 卡片勾选相关
const checkedIds = ref<string[]>([]);

function handleCheck(stuId: string) {
    if (!checkedIds.value.includes(stuId)) {
        checkedIds.value.push(stuId);
    } else {
        checkedIds.value = checkedIds.value.filter(id => id !== stuId);
    }
    console.log('已选择卡片id:', [...checkedIds.value]);
}

// 监听器
watch(showPersonDetail, (Val) => {
    if (Val) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

const personList = [
    {
        stuId: '24201111000',
        name: '张三',
        intention: ['网络协会', '宣传部'],
        grade: '2025级',
        major: '计算机',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111001',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111002',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111003',
        name: '张三',
        intention: ['网络协会', '宣传部'],
        grade: '2025级',
        major: '计算机',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111004',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111005',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111006',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111007',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111008',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
    {
        stuId: '24201111009',
        name: '李四',
        intention: ['ACM协会', '教研部'],
        grade: '2024级',
        major: '数学',
        email: '123@qq.com',
        phoneNum: '12345678901'
    },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition:
        opacity 0.30s cubic-bezier(.4, 0, .2, 1),
        transform 0.30s cubic-bezier(.4, 0, .2, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(40px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.overflow-hidden {
    overflow: hidden;
}
</style>