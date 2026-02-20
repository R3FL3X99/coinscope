import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/classnames'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/about', label: 'About' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[1px] transition-opacity duration-200 md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-slate-200 bg-white p-4 shadow-lg shadow-slate-900/10 transition-transform duration-200 md:w-64 md:translate-x-0 md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-6 hidden text-lg font-semibold text-slate-900 md:block">CoinScope</div>
        <nav aria-label="Primary navigation" className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative block rounded-lg px-3 py-2 text-sm transition-all duration-150 ease-out focus-visible:ring-2 focus-visible:ring-indigo-200',
                  isActive
                    ? 'bg-slate-50 text-slate-900 font-medium before:absolute before:bottom-2 before:left-0 before:top-2 before:w-1 before:rounded-r before:bg-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
