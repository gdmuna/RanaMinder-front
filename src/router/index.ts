import { createWebHistory, createRouter } from 'vue-router'
import home from '../views/home.vue'
import person from '../views/person.vue'
import interview from '../views/interview.vue'
import interviewInformation from '../views/interviewInformation.vue'
import loginCallback from '../views/loginCallback/index.vue'
import notFound from '../views/notFound/notFound.vue'


import { useAuthStore } from '@/stores/auth'
import { useSystemStore } from '@/stores/system'
import { nextTick, h } from 'vue';

const routes = [
  {
    path: '/',
    component: home,
    name: 'home',
    meta: {
      title: '首页',
      requireAuth: false,
      scrollToTop: true
    }
  },
  {
    path: '/person',
    component: person,
    name: 'person',
    meta: {
      title: '人员管理',
      requireAuth: true,
      minManageLevel: 1,
      scrollToTop: true
    }
  },
  {
    path: '/interview',
    component: interview,
    name: 'interview',
    meta: {
      title: '面试管理',
      requireAuth: true,
      minManageLevel: 1,
      scrollToTop: true
    }
  },
  {
    path: '/interview/:id',
    component: interviewInformation,
    name: 'interviewId',
    meta: {
      title: '面试详细',
      requireAuth: true,
      minManageLevel: 1,
      scrollToTop: true
    }
  },
  {
    path: '/loginCallback',
    component: loginCallback,
    name: 'loginCallback',
    meta: {
      title: '登录回调',
      guest: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  },
  {
    path: '/404',
    name: 'NotFound',
    component: notFound,
    meta: {
      title: '404 Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  strict: true
})

router.beforeEach((to, from, next) => {
  const systemStore = useSystemStore()
  const authStore = useAuthStore()
  const minManageLevel = to.meta.minManageLevel

  // 页面标题设置
  const title = document.title
  document.title = title + ' - ' + (to.meta.title || 'RanaMinder')
  // 只有在不是子路由跳转时，且目标路由配置了 scrollToTop 时，才滚动到顶部
  const isChildRoute = from.matched.length > 0 && to.path === from.matched[0].path
  const scrollToTop = to.meta.scrollToTop && !(from.meta.parentAction?.doNotScrollToTop && isChildRoute)
  if (scrollToTop) {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // 检查是否需要登录
  if (to.meta.requireAuth && !authStore.isAuthenticated) {
    authStore.login()
    return next(false)
  } else if (to.meta.guest && authStore.isAuthenticated) {
    return next({ name: '/' })
  }

  // 检查是否需要权限
  if (minManageLevel !== undefined) {
    const minPermission = authStore.getGroupByRank('min')
    console.log('minPermission', minPermission);
    if (minPermission === null || minPermission.level > (minManageLevel as number)) {
      alert('您当前的权限等级不足，无法访问该页面。')
      return systemStore.routerBack()
    }
  }

  nextTick(() => {
    next()
  })
})

export default router