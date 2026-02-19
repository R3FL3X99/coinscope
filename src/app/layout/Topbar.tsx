import { cn } from '../../utils/classnames'

type TopbarProps = {
  onMenuToggle: () => void
  isMenuOpen: boolean
}

export function Topbar({ onMenuToggle, isMenuOpen }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Toggle navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 md:hidden"
        >
          {isMenuOpen ? (
            <span className="text-lg leading-none">X</span>
          ) : (
            <span className={cn('text-base leading-none')}>Menu</span>
          )}
        </button>

        <h1 className="text-lg font-bold tracking-tight text-slate-900">CoinScope</h1>

        <div className="ml-auto w-full max-w-md">
          <label htmlFor="topbar-search" className="sr-only">
            Search
          </label>
          <input
            id="topbar-search"
            type="text"
            placeholder="Search coins (coming soon)"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>
    </header>
  )
}
