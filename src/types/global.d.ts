export { }

declare global {
    interface Window {
        lenis?: Lenis
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