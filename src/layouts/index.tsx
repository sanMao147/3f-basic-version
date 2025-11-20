import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// 全局悬浮布局组件（红色下拉框 + 导航）
const GlobalLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false) // 控制下拉框展开/收起
  const navigate = useNavigate()

  // 回到首页（直接跳转，不刷新页面）
  const goToHome = () => {
    navigate('home')
    setIsOpen(false) // 关闭下拉框
  }

  return (
    <div className='relative min-h-screen'>
      {/* 页面主体内容（子路由会渲染在这里） */}
      <main className='p-4'>{children}</main>

      {/* 红色悬浮下拉框（固定在右下角） */}
      <div className='fixed right-6 bottom-6 z-50'>
        {/* 下拉触发按钮（红色圆形） */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors'
          aria-label={isOpen ? '收起导航' : '展开导航'}
        >
          {isOpen ? '↑' : '☰'}
        </button>

        {/* 下拉菜单（红色背景，展开时显示） */}
        {isOpen && (
          <div className='absolute bottom-16 right-0 w-48 bg-red-500 rounded-lg shadow-xl p-3 animate-fadeIn'>
            <div className='flex flex-col gap-2'>
              {/* 回到首页 */}
              <button
                onClick={goToHome}
                className='px-4 py-2 rounded hover:bg-red-600 text-white text-left transition-colors'
              >
                回到首页
              </button>
              {/* 前往 Car 页面（Link 无刷新跳转） */}
              <Link
                to='/car'
                className='px-4 py-2 rounded hover:bg-red-600 text-white text-left transition-colors block'
                onClick={() => setIsOpen(false)}
              >
                极速狂飙
              </Link>
              {/* 前往 Marbel 页面 */}
              <Link
                to='/marbel'
                className='px-4 py-2 rounded hover:bg-red-600 text-white text-left transition-colors block'
                onClick={() => setIsOpen(false)}
              >
                疯狂的石头
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalLayout
