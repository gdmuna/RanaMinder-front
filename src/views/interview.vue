<template>
    <div>
        <!-- 页面内容 -->
        <div class="flex flex-col items-center">
            <modalWrapper>
                <PersonDetail />
            </modalWrapper>
        </div>
    </div>
</template>

<script setup lang="ts">
// 逻辑代码
import PersonDetail from '@/components/personDetail.vue';
import modalWrapper from '@/components/modalWrapper.vue';


</script>

<style scoped>
/* 样式 */
</style>