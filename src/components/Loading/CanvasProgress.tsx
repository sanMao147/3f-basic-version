import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'

interface CanvasLoadingProgressProps {
  className?: string
}

export const CanvasLoadingProgress = ({
  className = '',
}: CanvasLoadingProgressProps) => {
  const { progress, active } = useProgress()
  const [isVisible, setIsVisible] = useState(true)
  const [hasRouteLoading, setHasRouteLoading] = useState(false)

  // 监听路由级Loading组件（移除冗余interval，MutationObserver已覆盖场景）
  useEffect(() => {
    const checkRouteLoading = () => {
      setHasRouteLoading(
        !!document.querySelector('[data-loading-component="true"]')
      )
    }

    checkRouteLoading()
    const observer = new MutationObserver(checkRouteLoading)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-loading-component'],
    })

    return () => observer.disconnect()
  }, [])

  // 控制显示/隐藏（简化条件判断）
  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
    if (active) setIsVisible(true)
  }, [active, progress])

  // 路由Loading存在或已隐藏时不渲染
  if (!isVisible || hasRouteLoading) return null

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{ zIndex: 5 }}
    >
      <div className='bg-black/50 backdrop-blur-sm rounded-lg px-8 py-6 flex flex-col items-center gap-4'>
        {/* 加载图标 */}
        <div className='w-12 h-12 relative'>
          <div className='absolute inset-0 rounded-full border-4 border-white/30 border-t-white animate-spin' />
        </div>
        {/* 进度条 */}
        <div className='w-64 h-2 bg-white/20 rounded-full overflow-hidden'>
          <div
            className='h-full bg-white transition-all duration-300 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* 进度文字 */}
        <div className='text-white text-sm font-medium'>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}
