import { useQuery } from '@tanstack/react-query'
import { getCoinMarketChart } from '../../services/coingecko'
import { ApiError } from '../../services/http'

const MARKET_CHART_STALE_TIME = 1000 * 90

export function useCoinMarketChart(coinId?: string, days: number = 1) {
  return useQuery({
    queryKey: ['coinMarketChart', coinId, days],
    queryFn: ({ signal }) => getCoinMarketChart(coinId ?? '', days, signal),
    enabled: Boolean(coinId),
    staleTime: MARKET_CHART_STALE_TIME,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 429) {
        return false
      }

      return failureCount < 1
    },
  })
}
