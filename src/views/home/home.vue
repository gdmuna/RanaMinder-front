<template>
    <div class="w-full">
        <div class="space-y-6 px-10 py-8">
            <functionCard title="人员管理" subtitle="PERSONNEL MANAGEMENT" sideLabel="PERSONNEL" :icon="UserIcon"
                backgroundColor="#6B719E" link="/personnel" />
            <functionCard title="面试管理" subtitle="INTERVIEW MANAGEMENT" sideLabel="INTERVIEW" :icon="FileTextIcon"
                backgroundColor="#AD8D73" link="/interview" />
        </div>
    </div>
</template>

<script setup lang="ts">
import functionCard from '@/components/functionCard.vue'
import { UserIcon, FileTextIcon } from 'lucide-vue-next'
</script>

<style scoped>
@import './index.css';
</style>