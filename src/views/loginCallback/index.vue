<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

onMounted(() => {
    const authStore = useAuthStore()
    authStore.loginCallback()
    console.log('logincallback page mounted', authStore);
});

</script>

<style scoped></style>