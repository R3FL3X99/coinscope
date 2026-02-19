import { useQuery } from '@tanstack/react-query'
import { getCoinDetails } from '../../services/coingecko'

const DETAILS_STALE_TIME = 1000 * 120

export function useCoinDetails(id?: string) {
  return useQuery({
    queryKey: ['coin-details', id],
    queryFn: ({ signal }) => getCoinDetails(id ?? '', signal),
    enabled: Boolean(id),
    staleTime: DETAILS_STALE_TIME,
  })
}
