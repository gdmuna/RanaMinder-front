export { }

declare global {
    interface Window {
        lenis?: Lenis
        RANAMINDER_BASE_URL?: string
        CASDOOR_ENDPOINT?: string
    }
}

declare module 'vue-router' {
    interface RouteMeta {
        parentAction?: {
            doNotScrollToTop?: boolean
        }
        // ...其他meta属性
    }
}