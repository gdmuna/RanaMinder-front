import { ref } from 'vue'

// 滚动锁定状态
const isLocked = ref(false)

/**
 * 滚动锁定钩子函数
 * 用于在模态窗口或弹出层打开时锁定背景滚动
 */
export function useScrollLock() {
  /**
   * 锁定页面滚动
   */
  const lockScroll = () => {
    if (isLocked.value) return
    isLocked.value = true
    
    // 保存当前滚动位置
    const scrollY = window.scrollY
    
    // 锁定body滚动
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflowY = 'scroll'
  }

  /**
   * 解锁页面滚动
   */
  const unlockScroll = () => {
    if (!isLocked.value) return
    isLocked.value = false
    
    // 恢复body滚动
    const scrollY = parseInt(document.body.style.top || '0') * -1
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
    document.body.style.overflowY = ''
    
    // 恢复滚动位置
    window.scrollTo(0, scrollY)
  }

  /**
   * 切换滚动锁定状态
   */
  const toggleScrollLock = () => {
    isLocked.value ? unlockScroll() : lockScroll()
  }

  /**
   * 阻止滚动事件传播
   * @param event 滚动事件
   */
  const preventScroll = (event: Event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return {
    isLocked,
    lockScroll,
    unlockScroll,
    toggleScrollLock,
    preventScroll
  }
}
