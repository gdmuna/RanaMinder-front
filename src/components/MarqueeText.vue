<template>
    <div class="marquee-container select-none">
        <div class="marquee-content" :style="{
            animationDuration: duration + 's',
        }">
            <span v-for="n in repeatCount" :key="n" class="marquee-item will-change-transform">
                {{ text }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    text: string
    duration?: number
    repeatCount?: number
}>()

const duration = props.duration || 15
const repeatCount = props.repeatCount || 5

</script>

<style scoped>

.marquee-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    background-color: transparent;
}

.marquee-content {
    display: inline-block;
    white-space: nowrap;
    animation: scroll-left linear infinite;
}

.marquee-item {
    display: inline-block;
    padding: 0 2rem;
    font-size: 7rem;
    color: #FEFCE4;
    font-weight: 1000;
    letter-spacing: 0.5rem;
    /* 伪立体效果 */
    text-shadow:
        6px 6px 0 #0E100F,    /* 右下阴影 */
        10px 10px 0 #FEFCE4,    /* 更深的右下阴影 */
        1px 1px 0 #0E100F;    /* 轻微阴影 */
}

/* 小屏适配 */
@media (max-width: 768px) {
    .marquee-item {
        font-size: 2.2rem;
        padding: 0 0.8rem;
        letter-spacing: 0.2rem;
        text-shadow:
            2px 2px 0 #0E100F,
            4px 4px 0 #FEFCE4,
            1px 1px 0 #0E100F;
    }
}

@keyframes scroll-left {
    from {
        transform: translateX(0%);
    }

    to {
        transform: translateX(-50%);
    }
}
</style>