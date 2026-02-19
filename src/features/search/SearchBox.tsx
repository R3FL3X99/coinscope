import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/Card'
import { ApiError } from '../../services/http'
import { debounce } from '../../utils/debounce'
import { cn } from '../../utils/classnames'
import { useCoinSearch } from './useCoinSearch'

const SEARCH_DEBOUNCE_MS = 400

export function SearchBox() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setDebouncedQuery(value.trim()), SEARCH_DEBOUNCE_MS),
    [],
  )

  useEffect(() => {
    debouncedSetQuery(query)
    return () => debouncedSetQuery.cancel()
  }, [debouncedSetQuery, query])

  const shouldSearch = debouncedQuery.length >= 2
  const { data = [], isLoading, isFetching, error } = useCoinSearch(debouncedQuery)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const hasResults = data.length > 0
  const isBusy = isLoading || isFetching

  const errorMessage =
    error instanceof ApiError && error.status === 429
      ? 'Rate limit reached — try again shortly.'
      : error instanceof Error
        ? error.message
        : 'Unable to search right now.'

  return (
    <div ref={containerRef} className="relative w-full">
      <label htmlFor="home-search" className="sr-only">
        Search coins
      </label>
      <input
        id="home-search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        type="text"
        placeholder="Try: bitcoin, ethereum, solana..."
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
      />

      {isOpen ? (
        <Card className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 max-h-80 overflow-y-auto p-2">
          {!shouldSearch ? <p className="p-3 text-sm text-slate-500">Type at least 2 characters to search.</p> : null}

          {shouldSearch && isBusy ? <p className="p-3 text-sm text-slate-500">Searching coins...</p> : null}

          {shouldSearch && !isBusy && error ? <p className="p-3 text-sm text-rose-600">{errorMessage}</p> : null}

          {shouldSearch && !isBusy && !error && !hasResults ? (
            <p className="p-3 text-sm text-slate-500">No coins found.</p>
          ) : null}

          {shouldSearch && !isBusy && !error && hasResults ? (
            <ul role="listbox" aria-label="Coin search results" className="space-y-1">
              {data.map((coin) => (
                <li key={coin.id}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-100',
                    )}
                    onClick={() => {
                      navigate(`/coin/${coin.id}`, {
                        state: {
                          coin: {
                            id: coin.id,
                            name: coin.name,
                            symbol: coin.symbol,
                          },
                        },
                      })
                      setIsOpen(false)
                    }}
                  >
                    {coin.thumb ? (
                      <img src={coin.thumb} alt="" className="h-6 w-6 rounded-full bg-slate-200 object-cover" />
                    ) : (
                      <span className="h-6 w-6 rounded-full bg-slate-200" aria-hidden="true" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">{coin.name}</span>
                      <span className="block truncate text-xs uppercase text-slate-500">{coin.symbol}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ) : null}
    </div>
  )
}

