import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from '../../components/Container'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:pl-64">
        <Topbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} isMenuOpen={isSidebarOpen} />
        <main className="w-full py-6 md:py-8">
          <Container>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  )
}
