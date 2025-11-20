import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useRouteError } from 'react-router-dom'
import { routes } from '../routes'

// 扩展 RouteHandle 类型，增加 isHome 标记
interface RouteHandle {
  title?: string
  showInNav?: boolean
  isNotFound?: boolean
  isHome?: boolean // 首页标记类型
}

interface AppRoute {
  path?: string
  handle?: RouteHandle
  children?: AppRoute[]
}

// 递归筛选导航路由（showInNav: true）
const getNavRoutes = (routes: AppRoute[]): AppRoute[] => {
  let navRoutes: AppRoute[] = []
  routes.forEach((route) => {
    if (route.handle?.showInNav) {
      navRoutes.push(route)
    }
    if (route.children && route.children.length > 0) {
      navRoutes = [...navRoutes, ...getNavRoutes(route.children)]
    }
  })
  return navRoutes
}

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const error = useRouteError() as unknown

  // 判断是否为 404 页面
  const isNotFoundPage = useMemo(() => {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 404 &&
      'statusText' in error &&
      error.statusText === 'Not Found'
    )
  }, [error])

  // 提取导航路由
  const navRoutes = getNavRoutes(routes)

  // 导航点击处理：区分首页和普通路由，处理 404 禁用逻辑
  const handleNavClick = (route: AppRoute, e: React.MouseEvent) => {
    const isHome = route.handle?.isHome === true

    // 404 页面时：仅首页可点击，其余阻止跳转
    if (isNotFoundPage) {
      if (!isHome) {
        e.preventDefault() // 非首页路由阻止跳转
      } else {
        setIsOpen(false) // 首页跳转后收起导航
      }
      return
    }

    // 非 404 页面：所有路由正常跳转，收起导航
    setIsOpen(false)
    // 首页特殊跳转（可选，确保绝对路径正确）
    if (isHome) {
      navigate(`/${route.path}`)
    }
  }

  return (
    <div className='relative min-h-screen bg-[radial-gradient(#5a47ce,#232323_80%)]'>
      <main className='p-4 text-white/90 backdrop-blur-sm'>{children}</main>

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
              {/* 遍历生成导航按钮 */}
              {navRoutes.map((route) => {
                const path = route.path || ''
                const title = route.handle?.title || '未命名路由'
                const isHome = route.handle?.isHome === true
                const isActive = location.pathname.endsWith(path)

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`px-4 py-3 rounded-lg text-white text-left transition-all duration-200 block ${
                      // 404 页面样式：仅首页正常，其余禁用
                      isNotFoundPage
                        ? isHome
                          ? 'bg-purple-600/90 hover:bg-purple-500 font-bold shadow-md shadow-purple-500/20' // 404 时首页可点击样式
                          : 'bg-gray-800/70 text-white/50 cursor-not-allowed' // 404 时其他路由禁用样式
                        : isActive
                        ? 'bg-linear-to-r from-purple-600 to-indigo-700 font-bold shadow-md shadow-purple-500/20 border-l-4 border-purple-400' // 非 404 时活跃路由样式
                        : 'bg-gray-800/50 hover:bg-purple-700/50 hover:text-white' // 非 404 时普通样式
                    }`}
                    onClick={(e) => handleNavClick(route, e)}
                    aria-disabled={isNotFoundPage && !isHome} // 404 时仅首页启用
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
