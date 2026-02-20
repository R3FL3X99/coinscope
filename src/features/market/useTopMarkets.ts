import { useQuery } from '@tanstack/react-query'
import { getTopMarkets } from '../../services/coingecko'

const TOP_MARKETS_STALE_TIME = 1000 * 90

export function useTopMarkets() {
  return useQuery({
    queryKey: ['topMarkets'],
    queryFn: ({ signal }) => getTopMarkets(signal),
    staleTime: TOP_MARKETS_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
