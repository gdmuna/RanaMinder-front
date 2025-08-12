<template>
  <div class="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-14 gap-5 md:px-15 px-5 py-5 mt-[3.5rem] md:max-w-full max-w-[30rem] mx-auto">
    <!-- <InterviewCard v-for="person in personList" :key="person.stuId" :name="person.name" :department="person.department"
      :grade="person.grade" :major="person.major" :stuId="person.stuId" @click="showDetail(person)" /> -->
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
    <InterviewCard />
  </div>
</template>

<script setup lang="ts">
// 这里可以获取路由参数
import { useRoute } from 'vue-router'
import InterviewCard from '@/components/interviewCard.vue';
const route = useRoute()
const interviewId = route.params.id
</script>