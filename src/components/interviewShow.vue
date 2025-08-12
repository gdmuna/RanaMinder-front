<template>
    <div
        class="md:w-[47rem] md:h-[20rem] w-[100vw] h-[19rem] md:px-0 px-[0.7rem] border-3 border-transparent bg-transparent relative select-none">
        <div
            class="md:absolute relative bottom-0 left-0 md:w-[44rem] md:h-[14rem] w-full h-full border-2 border-[#EEEEEE] rounded-lg bg-transparent flex flex-col justify-between p-8">
            <!-- 标题 -->
            <div class="w-full flex items-start mb-4 overflow-x-auto md:whitespace-nowrap hide-scrollbar">
                <span class="font-[优设标题黑] md:text-[4rem] text-[3.8rem] tracking-wide text-gradient drop-shadow-lg">
                    {{ title }}
                </span>
            </div>
            <!-- 底部按钮和时间 -->
            <div class="w-full items-end flex -mb-[0.8rem]">
                <!-- 按钮 -->
                <div class="flex space-x-5 cursor-pointer">
                    <div class="relative flex items-center justify-center rounded-lg px-[1.5rem] py-[0.3rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md" 
                    :style="{ backgroundColor: 'var(--main-color)' }"
                        @click="handleViewDetail">
                        <div
                            class="text-[1rem] font-extrabold dark:text-[#000000] tracking-wide relative z-10">
                            查看
                        </div>
                    </div>
                    <div class="relative flex items-center justify-center rounded-lg px-[1.5rem] py-[0.3rem] transition-transform duration-250 hover:scale-105 active:scale-95 hover:shadow-md"
                    :style="{ backgroundColor: 'var(--main-color)' }">
                        <div
                            class="text-[1rem] font-extrabold dark:text-[#000000] tracking-wide relative z-10">
                            修改
                        </div>
                    </div>
                </div>
                <!-- 时间 -->
                <span
                    class="text-[1rem] font-extrabold text-[#EEEEEE] tracking-widest ml-auto mr-[5rem] mb-[0.3rem] md:block hidden">
                    {{ formatDate(time) }}
                </span>
            </div>
        </div>
        <!-- 可爱鱼猫图 -->
        <div class="absolute bottom-0 right-0 md:block hidden">
            <img src="@/assets/modem1.svg" alt="" class="max-w-[20rem] max-h-[20rem]">
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps<{
    id: number
    title: string
    time: Date
}>()

const {
    title = '这是一个面试活动',
    time = new Date(),
} = props;

function formatDate(date: Date) {
    return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}`
}

const emit = defineEmits(['view-detail']);

function handleViewDetail() {
    emit('view-detail', props.id);
}


</script>

<style scoped>
@font-face {
    font-family: "优设标题黑";
    src: url('../assets/fonts/YouSheBiaoTiHei.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

.hide-scrollbar {
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* IE 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
    display: none;
    /* Chrome/Safari/Opera */
}

.text-gradient {
    background: linear-gradient(270deg, #EEEEEE 0%, var(--main-color, #FADCD9) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}
</style>