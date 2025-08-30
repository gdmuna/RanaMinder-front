import { defineStore } from 'pinia'

import { h, ref, computed } from 'vue'

import { toast } from 'vue-sonner'

import { useRouter } from 'vue-router'

import { useMediaQuery } from '@vueuse/core'

export const useSystemStore = defineStore('system', () => {
    const router = useRouter()
    const isDark = ref<boolean>(true)
    function initTheme(): void {
        // if (localStorage.getItem('isDark') === 'true') {
        //     document.documentElement.classList.add('dark')
        //     isDark.value = true
        // } else if (localStorage.getItem('isDark') === 'false') {
        //     document.documentElement.classList.remove('dark')
        //     isDark.value = false
        // } else {
        //     // 默认主题为深色
        //     document.documentElement.classList.add('dark')
        //     isDark.value = true
        //     localStorage.setItem('isDark', 'true')
        // }
        document.documentElement.classList.add('dark')
        isDark.value = true
        localStorage.setItem('isDark', 'true')
    }
    // 切换主题
    function toggleTheme(): void {
        if (isDark.value == false) {
            document.documentElement.classList.add('dark')
            isDark.value = true
            localStorage.setItem('isDark', 'true')
        } else {
            document.documentElement.classList.remove('dark')
            isDark.value = false
            localStorage.setItem('isDark', 'false')
        }
    }
    // 强制切换主题
    function forceToggleTheme(theme: string): void {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            isDark.value = true
        } else {
            document.documentElement.classList.remove('dark')
            isDark.value = false
        }
    }

    const prevPath = ref<string | null>(null)

    function routerGoto(path: string) {
        const currentPath = router.currentRoute.value.path
        setPrevPath(currentPath)
        router.push(path)
    }

    function routerBack() {
        const toPath = localStorage.getItem('prevPath') || prevPath.value || '/'
        router.push(toPath)
    }
    
    function setPrevPath(path: string | null) {
        console.log('setPrevPath1', path);
        localStorage.setItem('prevPath', path || '/')
        prevPath.value = path
    }

    const isMobile = useMediaQuery('(max-width: 768px)')
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
    const isDesktop = useMediaQuery('(min-width: 1024px)')
    const isXlDesktop = useMediaQuery('(min-width: 1280px)')

    const isLoginCallback = computed(() => {
        console.log('isLoginCallback', router.currentRoute.value.path);
        
        return router.currentRoute.value.path === '/loginCallback'
    })


    return {
        isDark,
        isMobile,
        isTablet,
        isDesktop,
        isXlDesktop,
        initTheme,
        toggleTheme,
        forceToggleTheme,
        isLoginCallback,
        routerGoto,
        routerBack,
        prevPath,
        setPrevPath
    }
})