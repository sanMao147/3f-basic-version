import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { routes } from '../routes'

interface RouteHandle {
  title?: string
  showInNav?: boolean
  isHome?: boolean
}

interface AppRoute {
  path?: string
  handle?: RouteHandle
  children?: AppRoute[]
}

// 递归筛选导航路由（showInNav: true）
const getNavRoutes = (routes: AppRoute[]): AppRoute[] => {
  const navRoutes: AppRoute[] = []
  routes.forEach((route) => {
    if (route.handle?.showInNav) navRoutes.push(route)
    if (route.children?.length) navRoutes.push(...getNavRoutes(route.children))
  })
  return navRoutes
}

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation() // 直接解构路径
  const navRoutes = getNavRoutes(routes)

  return (
    <div className='relative min-h-screen bg-[radial-gradient(#5a47ce,#232323_80%)]'>
      <main>{children}</main>

      <div className='fixed right-6 bottom-6 z-50'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='w-16 h-16 rounded-full bg-linear-to-tr from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:from-purple-500 hover:to-indigo-600 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95'
          aria-label={isOpen ? '收起导航' : '展开导航'}
        >
          {isOpen ? '↑' : '☰'}
        </button>

        {isOpen && (
          <div className='absolute bottom-20 right-0 w-52 bg-gray-900/90 backdrop-blur-md rounded-xl border border-purple-500/30 shadow-xl shadow-purple-500/10 p-3 animate-fadeIn'>
            <div className='flex flex-col gap-2'>
              {navRoutes.map((route) => {
                const path = route.path || ''
                const title = route.handle?.title || '未命名路由'
                const isActive = pathname.endsWith(path) // 或用 === 更精确

                return (
                  <Link
                    key={path} // 你的路由 path 都是唯一的，直接用 path 当 key
                    to={path} // 直接跳转到路由配置的 path（如 /home、/car）
                    className={`px-4 py-3 rounded-lg text-white text-left transition-all duration-200 block ${
                      isActive
                        ? 'bg-linear-to-r from-purple-600 to-indigo-700 font-bold shadow-md shadow-purple-500/20 border-l-4 border-purple-400'
                        : 'bg-gray-800/50 hover:bg-purple-700/50 hover:text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {title}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LayoutContent
