import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import Loading from '../components/Loading/index' // 之前的 Tailwind 加载组件
import GlobalLayout from '../layouts/index' // 全局悬浮布局

// 异步加载页面组件
const HomePage = lazy(() => import('../pages/Home/index'))
const CarRace = lazy(() => import('../pages/CarRace/index'))
const MarbelRace = lazy(() => import('../pages/MarbelRace/index'))
const NotFound = lazy(() => import('../pages/NotFound/index'))

const routes = [
  {
    path: '/', // 对应 /3f-basic-version/
    element: (
      <GlobalLayout>
        <Suspense fallback={<Loading />}>
          <Outlet /> {/* 子路由渲染出口（必须保留） */}
        </Suspense>
      </GlobalLayout>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate
            to='home'
            replace
          />
        ),
      },
      {
        path: 'home',
        element: <HomePage />,
        meta: { title: '首页' },
      },
      { path: 'car', element: <CarRace />, meta: { title: '极速狂飙' } },
      {
        path: 'marbel',
        element: <MarbelRace />,
        meta: { title: '疯狂的石头' },
      },
    ],
  },
  // 404 路由
  {
    path: '*',
    element: (
      <GlobalLayout>
        <Suspense fallback={<Loading />}>
          <NotFound />
        </Suspense>
      </GlobalLayout>
    ),
  },
]

// 创建路由
const router = createBrowserRouter(routes, {
  basename: '/3f-basic-version/', // 与 vite.config.js 中的 base 保持同步
})

export default router
