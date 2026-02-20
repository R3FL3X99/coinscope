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
          'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-slate-800 bg-slate-900 text-slate-300 shadow-lg shadow-slate-950/40 transition-transform duration-200 md:w-64 md:translate-x-0 md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="hidden border-b border-slate-800/60 px-4 pb-3 pt-4 md:block">
          <p className="text-lg font-semibold tracking-tight text-white">CoinScope</p>
          <p className="mt-1 text-xs text-slate-400">Market Intelligence</p>
        </div>
        <nav aria-label="Primary navigation" className="space-y-1 px-3 pt-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative block rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ease-out focus-visible:ring-2 focus-visible:ring-indigo-400/40',
                  isActive
                    ? 'bg-slate-800 text-white font-medium before:absolute before:bottom-2 before:left-0 before:top-2 before:w-1 before:rounded-r before:bg-indigo-500'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white',
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
