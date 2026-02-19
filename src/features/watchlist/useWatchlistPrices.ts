import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getSimplePrices } from '../../services/coingecko'
import { ApiError } from '../../services/http'
import type { WatchlistItem, WatchlistPriceRow } from './types'

const WATCHLIST_PRICES_STALE_TIME = 1000 * 45
const WATCHLIST_PRICES_REFETCH_INTERVAL = 1000 * 60

export function useWatchlistPrices(items: WatchlistItem[]) {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.id.localeCompare(b.id)),
    [items],
  )
  const sortedIds = sortedItems.map((item) => item.id)
  const idsKey = sortedIds.join(',')

  const query = useQuery({
    queryKey: ['watchlistPrices', idsKey],
    queryFn: ({ signal }) => getSimplePrices(sortedIds, signal),
    enabled: sortedIds.length > 0,
    staleTime: WATCHLIST_PRICES_STALE_TIME,
    refetchInterval: sortedIds.length > 0 ? WATCHLIST_PRICES_REFETCH_INTERVAL : false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 429) {
        return false
      }

      return failureCount < 1
    },
  })

  const rows: WatchlistPriceRow[] = useMemo(() => {
    if (sortedItems.length === 0) {
      return []
    }

    const data = query.data ?? {}
    return sortedItems.map((item) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      priceUsd: data[item.id]?.usd,
      change24h: data[item.id]?.usd_24h_change,
    }))
  }, [query.data, sortedItems])

  return {
    ...query,
    rows,
  }
}
