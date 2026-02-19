import type { WatchlistItem, WatchlistItems } from './types'

const WATCHLIST_STORAGE_KEY = 'coinscope_watchlist'
export const WATCHLIST_UPDATED_EVENT = 'coinscope_watchlist_updated'

function getSafeWindow() {
  return typeof window !== 'undefined' ? window : null
}

function normalizeItem(input: unknown): WatchlistItem | null {
  if (typeof input === 'string') {
    const id = input.trim().toLowerCase()
    if (!id) {
      return null
    }

    // Legacy migration fallback for previous string[] shape.
    return { id, name: id, symbol: id }
  }

  if (!input || typeof input !== 'object') {
    return null
  }

  const candidate = input as Partial<WatchlistItem>
  const id = typeof candidate.id === 'string' ? candidate.id.trim().toLowerCase() : ''
  if (!id) {
    return null
  }

  const name =
    typeof candidate.name === 'string' && candidate.name.trim().length > 0
      ? candidate.name.trim()
      : id

  const symbol =
    typeof candidate.symbol === 'string' && candidate.symbol.trim().length > 0
      ? candidate.symbol.trim().toUpperCase()
      : id

  return { id, name, symbol }
}

function normalizeItems(input: unknown): WatchlistItems {
  if (!Array.isArray(input)) {
    return []
  }

  const map = new Map<string, WatchlistItem>()
  input.forEach((entry) => {
    const item = normalizeItem(entry)
    if (item) {
      map.set(item.id, item)
    }
  })

  return Array.from(map.values())
}

function persist(items: WatchlistItems): WatchlistItems {
  const safeWindow = getSafeWindow()
  if (!safeWindow) {
    return items
  }

  safeWindow.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(items))
  safeWindow.dispatchEvent(new Event(WATCHLIST_UPDATED_EVENT))
  return items
}

export function getWatchlist(): WatchlistItems {
  const safeWindow = getSafeWindow()
  if (!safeWindow) {
    return []
  }

  try {
    const raw = safeWindow.localStorage.getItem(WATCHLIST_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const normalized = normalizeItems(JSON.parse(raw))
    const rawTrimmed = raw.trim()
    const needsMigrationWriteback =
      rawTrimmed.startsWith('["') || rawTrimmed.includes('"id"') === false

    if (needsMigrationWriteback) {
      persist(normalized)
    }

    return normalized
  } catch {
    return []
  }
}

type AddWatchlistInput = {
  id: string
  name?: string
  symbol?: string
}

export function addToWatchlist(input: AddWatchlistInput): WatchlistItems {
  const normalizedId = input.id.trim().toLowerCase()
  if (!normalizedId) {
    return getWatchlist()
  }

  const current = getWatchlist()
  const existingIndex = current.findIndex((item) => item.id === normalizedId)
  const nextItem: WatchlistItem = {
    id: normalizedId,
    name: input.name?.trim() || normalizedId,
    symbol: input.symbol?.trim().toUpperCase() || normalizedId,
  }

  if (existingIndex >= 0) {
    const existing = current[existingIndex]
    const enrichedItem: WatchlistItem = {
      id: existing.id,
      name:
        existing.name !== existing.id || !nextItem.name
          ? existing.name
          : nextItem.name,
      symbol:
        existing.symbol !== existing.id || !nextItem.symbol
          ? existing.symbol
          : nextItem.symbol,
    }

    const next = [...current]
    next[existingIndex] = enrichedItem
    return persist(next)
  }

  return persist([...current, nextItem])
}

export function removeFromWatchlist(id: string): WatchlistItems {
  const normalizedId = id.trim().toLowerCase()
  if (!normalizedId) {
    return getWatchlist()
  }

  const next = getWatchlist().filter((item) => item.id !== normalizedId)
  return persist(next)
}

export function isInWatchlist(id: string): boolean {
  const normalizedId = id.trim().toLowerCase()
  if (!normalizedId) {
    return false
  }

  return getWatchlist().some((item) => item.id === normalizedId)
}
