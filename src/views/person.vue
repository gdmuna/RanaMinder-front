<template>
    <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-14 gap-5 md:px-15 px-5 py-5 mb-[3.5rem]">
        <PersonCard v-for="person in personList" :key="person.stuId" :name="person.name" :department="person.department"
            :grade="person.grade" :major="person.major" :stuId="person.stuId" />
    </div>
</template>

<script setup lang="ts">
import PersonCard from '@/components/personCard.vue'

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
        department: ['ACM协会', '摸鱼部', '部长','网络协会', '摸鱼部', '部长'],
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
</script>