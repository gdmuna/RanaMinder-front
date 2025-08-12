<template>
    <div class="md:w-[47rem] md:h-[20rem] w-auto h-[19rem] md:px-0 px-[0.7rem] border-3 border-transparent bg-transparent relative select-none">
        <div
            class="md:absolute relative bottom-0 left-0 md:w-[44rem] md:h-[14rem] w-full h-full border-2 border-[#EEEEEE] rounded-lg bg-transparent flex flex-col justify-between p-8">
            <!-- 标题 -->
            <div class="w-full flex items-start mb-4 overflow-x-auto md:whitespace-nowrap hide-scrollbar">
                <span class="font-[优设标题黑] md:text-[4rem] text-[3.8rem] tracking-wide text-gradient drop-shadow-lg"
                    :style="{ '--main-color': color }">
                    {{ title }}
                </span>
            </div>
            <!-- 底部按钮和时间 -->
            <div class="w-full items-end flex -mb-[0.5rem]">
                <!-- 按钮 -->
                <div class="flex space-x-8">
                    <div class="relative group flex items-center justify-center">
                        <svg
                            class="absolute left-[-1.5rem] top-[0.1rem] h-8 w-24 opacity-0 group-hover:opacity-100 transition-all duration-200 z-0">
                            <path :fill="color" d="M24 0 H96 L72 32 H0 Z"
                                style="-webkit-clip-path: polygon(25% 0%, 100% 1%, 100% 100%, 25% 100%, 0% 50%);clip-path: polygon(25% 0%, 100% 1%, 100% 100%, 25% 100%, 0% 50%);" />
                        </svg>
                        <div
                            class="text-[1.3rem] font-extrabold dark:text-[#EEEEEE] tracking-wide cursor-pointer relative z-10 group-hover-black">
                            查看
                        </div>
                    </div>
                    <div class="relative group flex items-center justify-center">
                        <svg
                            class="absolute left-[-1.5rem] top-[0.1rem] h-8 w-24 opacity-0 group-hover:opacity-100 transition-all duration-200 z-0">
                            <path :fill="color" d="M24 0 H96 L72 32 H0 Z"
                                style="-webkit-clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);clip-path: polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%);" />
                        </svg>
                        <div
                            class="text-[1.3rem] font-extrabold dark:text-[#EEEEEE] tracking-wide cursor-pointer relative z-10 group-hover-black">
                            修改
                        </div>
                    </div>
                </div>
                <!-- 时间 -->
                <span class="text-[1rem] font-extrabold text-[#EEEEEE] tracking-widest ml-auto md:mr-[5rem] mb-[0.25rem]">
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
    title: string
    time: Date
    color?: string
}>()

const { 
    title = '这是一个面试活动',
    time = new Date(),
    color = '#FADCD9'
} = props;

function formatDate(date: Date) {
    return `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()}`
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

.group:hover .group-hover-black {
    color: #000000;
}

.text-gradient {
    background: linear-gradient(270deg, #EEEEEE 0%, var(--main-color, #FADCD9) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}
</style>