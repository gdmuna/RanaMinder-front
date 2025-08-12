<template>
    <div class="md:w-[47rem] md:h-[20rem] w-auto h-[19rem] md:px-0 px-[0.7rem] border-3 border-transparent bg-transparent relative select-none">
        <!-- 添加按钮 -->
        <div class="md:absolute relative bottom-0 left-0 md:w-[44rem] md:h-[14rem] w-full h-full border-2 border-[#EEEEEE] rounded-lg bg-transparent flex items-center justify-center">

            <svg width="80" height="80" viewBox="0 0 48 48">
                <path d="M24 12 V36 M12 24 H36" stroke="#EEEEEE" stroke-width="4" stroke-linecap="round" />
            </svg>
        </div>
        <!-- 可爱鱼猫图 -->
        <div class="absolute bottom-0 right-0 md:block hidden">
            <img src="@/assets/modem1.svg" alt="" class="max-w-[20rem] max-h-[20rem]">
        </div>
    </div>
</template>

<script setup lang="ts">

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