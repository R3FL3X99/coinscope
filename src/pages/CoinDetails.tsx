import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PriceChart } from '../features/coin/PriceChart'
import { TimeframeTabs } from '../features/coin/TimeframeTabs'
import { getTrendInsight } from '../features/coin/trend'
import { useCoinDetails } from '../features/coin/useCoinDetails'
import { useCoinMarketChart } from '../features/coin/useCoinMarketChart'
import { WatchlistButton } from '../features/watchlist/WatchlistButton'
import type { WatchlistItem } from '../features/watchlist/types'
import { ApiError } from '../services/http'
import { formatNumber, formatPercent, formatUsd } from '../utils/format'

const kpiItems = ['Market Cap', '24h Volume', 'Circulating Supply', 'All-Time High', 'All-Time Low', 'Sentiment']

export function CoinDetails() {
  const { id } = useParams()
  const location = useLocation()
  const [selectedDays, setSelectedDays] = useState<1 | 7 | 30 | 365>(7)

  const { data, isLoading, isError, error, refetch, isFetching } = useCoinDetails(id)
  const {
    data: marketSeries = [],
    isLoading: isChartLoading,
    isError: isChartError,
    error: chartError,
    refetch: refetchChart,
  } = useCoinMarketChart(id, selectedDays)

  const rateLimitMessage = 'Rate limit reached — try again shortly.'

  const detailsErrorMessage =
    error instanceof ApiError && error.status === 429
      ? rateLimitMessage
      : error instanceof Error
        ? error.message
        : 'Unable to load coin details.'

  const chartErrorMessage =
    chartError instanceof ApiError && chartError.status === 429
      ? rateLimitMessage
      : chartError instanceof Error
        ? chartError.message
        : 'Unable to load chart data.'

  const trend = getTrendInsight(marketSeries)
  const routeCoin =
    (location.state as { coin?: { name?: string; symbol?: string } } | null)?.coin ?? null
  const watchlistCoin: WatchlistItem | undefined = id
    ? {
        id,
        name: data?.name || routeCoin?.name || id,
        symbol: (data?.symbol || routeCoin?.symbol || id).toUpperCase(),
      }
    : undefined

  const liveKpis: Record<string, string> = {
    'Market Cap': formatUsd(data?.marketData.marketCapUsd),
    '24h Volume': formatUsd(data?.marketData.totalVolumeUsd),
    'Circulating Supply': formatNumber(data?.marketData.circulatingSupply),
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Coin</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {data?.name ?? id ?? 'unknown-coin'}{' '}
            <span className="align-middle text-base font-semibold uppercase text-slate-500 sm:text-lg">
              ({data?.symbol ?? ''})
            </span>
          </h2>
        </div>
        <div className="text-left sm:min-w-[15rem] sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
          <p className="mt-1 text-3xl font-bold leading-none text-slate-900 sm:text-4xl">
            {formatUsd(data?.marketData.currentPriceUsd)}
          </p>
          <p
            className={
              typeof data?.marketData.priceChange24h === 'number'
                ? data.marketData.priceChange24h >= 0
                  ? 'mt-2 text-sm font-semibold text-emerald-600'
                  : 'mt-2 text-sm font-semibold text-rose-600'
                : 'mt-2 text-sm text-slate-500'
            }
          >
            24h: {formatPercent(data?.marketData.priceChange24h)}
          </p>
          <WatchlistButton coin={watchlistCoin} />
        </div>
      </header>

      {isLoading || isFetching ? (
        <Card>
          <p className="text-sm text-slate-500">Loading coin details...</p>
        </Card>
      ) : null}

      {isError ? (
        <Card className="space-y-4">
          <p className="text-sm text-rose-600">{detailsErrorMessage}</p>
          <Button onClick={() => void refetch()}>Retry</Button>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiItems.map((item) => (
          <Card key={item}>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{liveKpis[item] ?? '--'}</p>
          </Card>
        ))}
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Price Chart</h3>
            <p
              className={
                trend?.direction === 'up'
                  ? 'mt-1 text-sm font-medium text-emerald-600'
                  : trend?.direction === 'down'
                    ? 'mt-1 text-sm font-medium text-rose-600'
                    : 'mt-1 text-sm font-medium text-slate-500'
              }
            >
              {trend
                ? `${trend.direction === 'up' ? 'Uptrend' : trend.direction === 'down' ? 'Downtrend' : 'Flat'} ${trend.percentChange > 0 ? '+' : ''}${formatPercent(trend.percentChange)}`
                : 'Trend unavailable'}
            </p>
          </div>
          <TimeframeTabs value={selectedDays} onChange={setSelectedDays} />
        </div>

        {isChartLoading ? <div className="h-72 w-full animate-pulse rounded-lg bg-slate-100" aria-hidden="true" /> : null}

        {isChartError ? (
          <div className="space-y-3 rounded-lg border border-rose-100 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">{chartErrorMessage}</p>
            <Button onClick={() => void refetchChart()}>Retry</Button>
          </div>
        ) : null}

        {!isChartLoading && !isChartError ? (
          <PriceChart data={marketSeries} days={selectedDays} direction={trend?.direction} />
        ) : null}
      </Card>

      <Card>
        <h3 className="text-base font-semibold text-slate-900">About This Coin</h3>
        <p className="mt-3 text-sm text-slate-600">
          {data?.description
            ? `${data.description.replace(/<[^>]+>/g, '').slice(0, 260)}...`
            : 'Project description placeholder. Fundamental summary, use-cases, and ecosystem details will be shown here.'}
        </p>
      </Card>
    </section>
  )
}
