import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from '../../components/Container'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.overflow = ''
      return
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEsc)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="md:pl-64">
        <Topbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} isMenuOpen={isSidebarOpen} />
        <main className="w-full p-4 sm:p-6">
          <Container>
            <Outlet />
          </Container>
        </main>
      </div>
    </div>
  )
}
