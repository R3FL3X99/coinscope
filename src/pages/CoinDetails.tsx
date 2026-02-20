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
import { formatNumber, formatPercent, formatShortDate, formatUsd } from '../utils/format'

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
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Coin</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {data?.name ?? id ?? 'unknown-coin'}{' '}
            <span className="align-middle text-sm font-medium uppercase text-slate-500 sm:text-base">
              ({data?.symbol ?? ''})
            </span>
          </h2>
        </div>
        <div className="text-left sm:min-w-[14rem] sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Price</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {formatUsd(data?.marketData.currentPriceUsd)}
          </p>
          <span
            className={
              typeof data?.marketData.priceChange24h === 'number'
                ? data.marketData.priceChange24h >= 0
                  ? 'mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
                  : 'mt-2 inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700'
                : 'mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'
            }
          >
            24h: {formatPercent(data?.marketData.priceChange24h)}
          </span>
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
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item}</p>
            {item === 'All-Time High' ? (
              <>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {formatUsd(data?.market_data?.ath?.usd ?? undefined)}
                </p>
                {formatShortDate(data?.market_data?.ath_date?.usd) ? (
                  <p className="mt-1 text-xs text-slate-500">{formatShortDate(data?.market_data?.ath_date?.usd)}</p>
                ) : null}
              </>
            ) : null}

            {item === 'All-Time Low' ? (
              <>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {formatUsd(data?.market_data?.atl?.usd ?? undefined)}
                </p>
                {formatShortDate(data?.market_data?.atl_date?.usd) ? (
                  <p className="mt-1 text-xs text-slate-500">{formatShortDate(data?.market_data?.atl_date?.usd)}</p>
                ) : null}
              </>
            ) : null}

            {item === 'Sentiment' ? (
              <>
                {data?.sentiment_votes_up_percentage == null && data?.sentiment_votes_down_percentage == null ? (
                  <p className="mt-2 text-2xl font-semibold text-slate-900">N/A</p>
                ) : (
                  <p className="mt-2 text-sm font-medium">
                    <span className="text-emerald-700">Up {formatPercent(data?.sentiment_votes_up_percentage ?? undefined)}</span>{' '}
                    <span className="text-slate-400">/</span>{' '}
                    <span className="text-rose-700">Down {formatPercent(data?.sentiment_votes_down_percentage ?? undefined)}</span>
                  </p>
                )}
              </>
            ) : null}

            {item !== 'All-Time High' && item !== 'All-Time Low' && item !== 'Sentiment' ? (
              <p className="mt-2 text-2xl font-semibold text-slate-900">{liveKpis[item] ?? '--'}</p>
            ) : null}
          </Card>
        ))}
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Price Chart</h3>
            <span
              className={
                trend?.direction === 'up'
                  ? 'mt-1 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
                  : trend?.direction === 'down'
                    ? 'mt-1 inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700'
                    : 'mt-1 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600'
              }
            >
              {trend
                ? `${trend.direction === 'up' ? 'Uptrend' : trend.direction === 'down' ? 'Downtrend' : 'Flat'} ${trend.percentChange > 0 ? '+' : ''}${formatPercent(trend.percentChange)}`
                : 'Trend unavailable'}
            </span>
          </div>
          <TimeframeTabs value={selectedDays} onChange={setSelectedDays} />
        </div>

        {isChartLoading ? (
          <div className="h-[320px] w-full animate-pulse rounded-lg bg-slate-100 md:h-[340px]" aria-hidden="true" />
        ) : null}

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
