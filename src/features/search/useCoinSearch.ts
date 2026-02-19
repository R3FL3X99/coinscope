import { useQuery } from '@tanstack/react-query'
import { searchCoins } from '../../services/coingecko'

const SEARCH_STALE_TIME = 1000 * 30

export function useCoinSearch(query: string) {
  return useQuery({
    queryKey: ['coin-search', query],
    queryFn: ({ signal }) => searchCoins(query, signal),
    enabled: query.trim().length >= 2,
    staleTime: SEARCH_STALE_TIME,
  })
}
