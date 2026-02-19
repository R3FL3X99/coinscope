import type { CoinMarketPoint } from './types'

export type TrendInsight = {
  firstPrice: number
  lastPrice: number
  percentChange: number
  direction: 'up' | 'down' | 'flat'
}

export function getTrendInsight(series: CoinMarketPoint[]): TrendInsight | null {
  if (series.length < 2) {
    return null
  }

  const firstPrice = series[0]?.price
  const lastPrice = series[series.length - 1]?.price

  if (
    typeof firstPrice !== 'number' ||
    typeof lastPrice !== 'number' ||
    Number.isNaN(firstPrice) ||
    Number.isNaN(lastPrice) ||
    firstPrice <= 0
  ) {
    return null
  }

  const percentChange = ((lastPrice - firstPrice) / firstPrice) * 100
  const magnitude = Math.abs(percentChange)

  let direction: TrendInsight['direction'] = 'flat'
  if (magnitude >= 0.1) {
    direction = percentChange > 0 ? 'up' : 'down'
  }

  return {
    firstPrice,
    lastPrice,
    percentChange,
    direction,
  }
}
