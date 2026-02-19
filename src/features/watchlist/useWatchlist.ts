import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  WATCHLIST_UPDATED_EVENT,
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from './storage'
import type { WatchlistItem } from './types'

export function useWatchlist() {
  // Read storage ONCE on mount (lazy init)
  const [items, setItems] = useState<WatchlistItem[]>(() => getWatchlist())

  // Keep in sync with other tabs / manual updates
  useEffect(() => {
    const handleStorage = () => {
      setItems(getWatchlist())
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener(WATCHLIST_UPDATED_EVENT, handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener(WATCHLIST_UPDATED_EVENT, handleStorage)
    }
  }, [])

  // Fast in-memory lookup (no storage reads during render)
  const idSet = useMemo(() => new Set(items.map((i) => i.id)), [items])

  const add = useCallback((item: WatchlistItem) => {
    setItems(addToWatchlist(item))
  }, [])

  const remove = useCallback((id: string) => {
    setItems(removeFromWatchlist(id))
  }, [])

  // IMPORTANT: do NOT call isInWatchlist() here (it may have side effects in storage/migration)
  const has = useCallback((id: string) => idSet.has(id), [idSet])

  // IMPORTANT: toggle based on current React state (not storage)
  const toggle = useCallback((item: WatchlistItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id)
      return exists ? removeFromWatchlist(item.id) : addToWatchlist(item)
    })
  }, [])

  const ids = items.map((item) => item.id)

  return {
    items,
    ids,
    add,
    remove,
    toggle,
    has,
  }
}
