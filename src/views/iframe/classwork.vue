<template>
    <div class="fullscreen-iframe-wrapper">
        <iframe :src="targetUrl" frameborder="0" class="iframe" allowfullscreen></iframe>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import { classworkApi } from '@/api/classwork'

const router = useRouter();
const targetUrl = 'https://classwork.gdmuna.com/'

// 监听 message
async function handleMessage(event) {
    console.log('收到目标页面发来的数据:', event.data)
    if (event.data.type === 'query' && Array.isArray(event.data.titles)) {
        try {
            const result = await classworkApi.getNamesByTitles(event.data.titles)
            const dataArr = result?.res?.data ?? []
            console.log('收到后端返回的数据:', dataArr)
            event.source.postMessage({ type: 'result', data: dataArr }, event.origin)
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