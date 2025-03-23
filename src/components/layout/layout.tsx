import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'
import TopBar from './top-bar'

export default function Layout() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}