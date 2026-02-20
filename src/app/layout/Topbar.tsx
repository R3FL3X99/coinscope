type TopbarProps = {
  onMenuToggle: () => void
  isMenuOpen: boolean
}

export function Topbar({ onMenuToggle, isMenuOpen }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-200 md:hidden"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>

        <h1 className="text-lg font-semibold tracking-tight text-slate-900">CoinScope</h1>

        <div className="ml-auto w-full max-w-md">
          <label htmlFor="topbar-search" className="sr-only">
            Search
          </label>
          <input
            id="topbar-search"
            type="text"
            placeholder="Search coins (coming soon)"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-200"
          />
        </div>
      </div>
    </header>
  )
}
