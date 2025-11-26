import Loading from '@/components/Loading'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import LayoutContent from './LayoutContent'

const Layout = () => {
  return (
    <LayoutContent>
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </LayoutContent>
  )
}

export default Layout
