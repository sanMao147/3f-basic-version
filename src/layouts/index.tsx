import { Outlet } from 'react-router-dom'
import LayoutContent from './LayoutContent'

const Layout = () => {
  return (
    <LayoutContent>
      <Outlet />
    </LayoutContent>
  )
}

export default Layout
