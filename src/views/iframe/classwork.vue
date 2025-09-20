<template>
    <div class="fullscreen-iframe-wrapper">
        <iframe :src="targetUrl" frameborder="0" class="iframe" allowfullscreen></iframe>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import { useClassworkStore } from '@/stores/classwork'

const router = useRouter();
const targetUrl = 'https://classwork.gdmuna.com/'
const classworkStore = useClassworkStore()

// 监听 message
async function handleMessage(event) {
    if (event.data.type === 'query' && Array.isArray(event.data.titles)) {
        try {
            const result = await classworkStore.fetchNamesByTitles(event.data.titles)
            const dataArr = Array.isArray(result) ? result : []
            const pureArr = JSON.parse(JSON.stringify(dataArr))
            event.source.postMessage({ type: 'result', data: pureArr }, event.origin)
        } catch (err) {
            console.error('后端请求失败', err)
            event.source.postMessage({ type: 'result', data: [] }, event.origin)
        }
    }
}

onMounted(() => {
    window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
    window.removeEventListener('message', handleMessage)
})

</script>

<style scoped>
.fullscreen-iframe-wrapper {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.iframe {
    width: 100%;
    height: 93.5%;
    border: none;
}
</style>