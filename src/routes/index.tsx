import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../layouts/index'

const HomePage = lazy(() => import('../pages/Home/index'))
const CarRace = lazy(() => import('../pages/CarRace/index'))
const MarbelRace = lazy(() => import('../pages/MarbelRace/index'))
const NotFound = lazy(() => import('../pages/NotFound/index'))

export const routes = [
  {
    path: '/',
    element: <Layout />,
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
      // 首页：添加 isHome: true 标记，showInNav: true 显示在导航
      {
        path: 'home',
        element: <HomePage />,
        handle: { title: '首页', showInNav: true, isHome: true }, // 关键：首页标记
      },
      {
        path: 'car',
        element: <CarRace />,
        handle: { title: '极速狂飙', showInNav: true }, // 普通导航路由
      },
      {
        path: 'marbel',
        element: <MarbelRace />,
        handle: { title: '疯狂的石头', showInNav: true }, // 普通导航路由
      },
      {
        path: '*',
        element: <NotFound />,
        handle: { isNotFound: true, title: '页面未找到' },
      },
    ],
  },
]

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
})
export default router
