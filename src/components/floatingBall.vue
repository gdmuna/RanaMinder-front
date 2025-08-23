<!-- <template>
    <div v-show="isVisible" class="floating-ball" @click="handleClick"
        :style="{ bottom: bottom + 'px', right: right + 'px' }">
        <div class="ball"></div>
        <div v-if="showReturn" class="return-btn" @click.stop="goToTop">
            ↑
        </div>
        <div v-if="showBack" class="back-btn" @click.stop="goBack">
            ←
        </div>
    </div>
</template> -->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 控制显示和隐藏
const isVisible = ref(true);
// 悬浮球的位置
const bottom = ref(50);
const right = ref(50);

// 显示返回顶部和返回按钮
const showReturn = ref(false);
const showBack = ref(false);

// 监听滚动事件来决定是否显示返回顶部按钮
const checkScrollPosition = () => {
    showReturn.value = window.scrollY > 300;
};

// 控制返回顶部
const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 控制返回上一页
const goBack = () => {
    window.history.back();
};

// 监听滚动
onMounted(() => {
    window.addEventListener('scroll', checkScrollPosition);
});

// 清除事件监听器
onBeforeUnmount(() => {
    window.removeEventListener('scroll', checkScrollPosition);
});
</script>

<style scoped>
.floating-ball {
    position: fixed;
    z-index: 1000;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ball {
    width: 50px;
    height: 50px;
    background-color: #4caf50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
}

.return-btn,
.back-btn {
    margin-top: 10px;
    padding: 5px;
    background-color: #4caf50;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.return-btn:hover,
.back-btn:hover {
    background-color: #388e3c;
}
</style>
