/// <reference types="vite/client" />
// 导入 GSAP 与相关插件
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomBounce } from "gsap/CustomBounce";
import { SlowMo } from "gsap/EasePack";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Observer } from "gsap/Observer";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 注册 GSAP 插件
gsap.registerPlugin(
    CustomEase,
    CustomBounce,
    SlowMo,
    Draggable,
    DrawSVGPlugin,
    Flip,
    InertiaPlugin,
    MotionPathHelper,
    MotionPathPlugin,
    MorphSVGPlugin,
    Observer,
    Physics2DPlugin,
    PhysicsPropsPlugin,
    ScrollTrigger,
    ScrollToPlugin,
    ScrollSmoother,
    SplitText,
    TextPlugin
);

// 导入 Vue 相关库和组件
import { createApp } from 'vue'
import App from './App.vue'

// 导入 vue-router
import router from './router'

// 导入 Pinia 状态管理库
import { createPinia } from 'pinia'

// 导入样式文件
import './index.css' // shadcn-ui
import './main.css' // 全局样式
import 'vue-sonner/style.css' // vue-sonner

const pinia = createPinia()
const app = createApp(App)

app.use(router)
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.mount('#app')


