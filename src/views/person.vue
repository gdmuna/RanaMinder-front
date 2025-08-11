<template>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-14 gap-5 md:px-15 px-5 py-5 mb-[3.5rem]">
        <PersonCard v-for="person in personList" :key="person.stuId" :name="person.name" :department="person.department"
            :grade="person.grade" :major="person.major" :stuId="person.stuId" @click="showDetail(person)" />
    </div>
    <!-- 人员详细卡片弹窗 -->
    <teleport to="body">
        <Transition name="fade">
        <div v-if="showPersonDetail"
            class="fixed inset-0 dark:bg-black/50 backdrop-blur-xs z-10 flex items-center justify-center"
            @click.self="closeDetail">
            <PersonDetail :person="selectedPerson" :deliverCloseDetail="closeDetail" />
        </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import PersonCard from '@/components/personCard.vue'
import PersonDetail from '@/components/personDetail.vue'

const personList = [
    {
        stuId: '24201111000',
        name: '张三',
        department: ['网络协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '计算机'
    },
    {
        stuId: '24201111001',
        name: '李四',
        department: ['ACM协会', '摸鱼部', '部长', '网络协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '数学'
    },
    {
        stuId: '24201111002',
        name: '王五',
        department: ['ACM协会', '摸鱼部', '干部'],
        grade: '2025级',
        major: '物理'
    },
    {
        stuId: '24201111000',
        name: '张三',
        department: ['网络协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '计算机'
    },
    {
        stuId: '24201111001',
        name: '李四',
        department: ['ACM协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '数学'
    },
    {
        stuId: '24201111002',
        name: '王五',
        department: ['ACM协会', '摸鱼部', '干部'],
        grade: '2025级',
        major: '物理'
    },
    {
        stuId: '24201111000',
        name: '张三',
        department: ['网络协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '计算机'
    },
    {
        stuId: '24201111001',
        name: '李四',
        department: ['ACM协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '数学'
    },
    {
        stuId: '24201111002',
        name: '王五',
        department: ['ACM协会', '摸鱼部', '干部'],
        grade: '2025级',
        major: '物理'
    },
    {
        stuId: '24201111000',
        name: '张三',
        department: ['网络协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '计算机'
    },
    {
        stuId: '24201111001',
        name: '李四',
        department: ['ACM协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '数学'
    },
    {
        stuId: '24201111002',
        name: '王五',
        department: ['ACM协会', '摸鱼部', '干部'],
        grade: '2025级',
        major: '物理'
    },
    {
        stuId: '24201111000',
        name: '张三',
        department: ['网络协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '计算机'
    },
    {
        stuId: '24201111001',
        name: '李四',
        department: ['ACM协会', '摸鱼部', '部长'],
        grade: '2024级',
        major: '数学'
    },
    {
        stuId: '24201111002',
        name: '王五',
        department: ['ACM协会', '摸鱼部', '干部'],
        grade: '2025级',
        major: '物理'
    }
]

const showPersonDetail = ref(false)
const selectedPerson = ref(null)

function showDetail(person: any) {
    selectedPerson.value = person
    showPersonDetail.value = true
}

function closeDetail() {
    showPersonDetail.value = false
    selectedPerson.value = null
}

watch(showPersonDetail, (Val) => {
    if (Val) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: 
        opacity 0.30s cubic-bezier(.4,0,.2,1),
        transform 0.30s cubic-bezier(.4,0,.2,1);
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
</style>
