import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../services/http'

const TWENTY_MINUTES = 1000 * 60 * 20

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      gcTime: TWENTY_MINUTES,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 429) {
          return false
        }

        return failureCount < 1
      },
    },
  },
})
