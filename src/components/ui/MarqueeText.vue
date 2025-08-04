<template>
    <div class="marquee-container" @mouseenter="pause" @mouseleave="resume">
        <div class="marquee-content" :style="{
            animationDuration: duration + 's',
            animationPlayState: isPaused ? 'paused' : 'running'
        }">
            <span v-for="n in repeatCount" :key="n" class="marquee-item">
                {{ text }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps<{
    text: string
    duration?: number
    repeatCount?: number
}>()

const isPaused = ref(false)

const duration = props.duration || 15
const repeatCount = props.repeatCount || 5

const pause = () => {
    isPaused.value = true
}
const resume = () => {
    isPaused.value = false
}
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

@keyframes scroll-left {
    from {
        transform: translateX(0%);
    }

    to {
        transform: translateX(-50%);
    }
}
</style>