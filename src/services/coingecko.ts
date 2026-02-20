import type { CoinDetails, CoinMarketPoint } from '../features/coin/types'
import type { CoinSearchResult } from '../features/search/types'
import type { SimplePriceMap } from '../features/watchlist/types'
import { httpGet } from './http'

type SearchResponse = {
  coins?: Array<{
    id?: string
    name?: string
    symbol?: string
    thumb?: string
  }>
}

type CoinDetailsResponse = {
  id?: string
  name?: string
  symbol?: string
  description?: {
    en?: string
  }
  links?: {
    homepage?: string[]
  }
  market_data?: {
    current_price?: { usd?: number }
    price_change_percentage_24h?: number
    market_cap?: { usd?: number }
    total_volume?: { usd?: number }
    circulating_supply?: number
    ath?: { usd?: number | null }
    atl?: { usd?: number | null }
    ath_date?: { usd?: string | null }
    atl_date?: { usd?: string | null }
  }
  sentiment_votes_up_percentage?: number | null
  sentiment_votes_down_percentage?: number | null
}

type CoinMarketChartResponse = {
  prices?: Array<[number, number]>
}

type TopMarketResponseItem = {
  id?: string
  name?: string
  symbol?: string
  image?: string
  current_price?: number
  price_change_percentage_24h?: number
  market_cap?: number
}

export type TopMarketCoin = {
  id: string
  name: string
  symbol: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

export async function searchCoins(query: string, signal?: AbortSignal): Promise<CoinSearchResult[]> {
  const data = await httpGet<SearchResponse>(`/search?query=${encodeURIComponent(query)}`, { signal })

  return (data.coins ?? [])
    .filter((coin) => coin.id && coin.name && coin.symbol)
    .map((coin) => ({
      id: coin.id as string,
      name: coin.name as string,
      symbol: coin.symbol as string,
      thumb: coin.thumb,
    }))
}

export async function getCoinDetails(id: string, signal?: AbortSignal): Promise<CoinDetails> {
  const data = await httpGet<CoinDetailsResponse>(`/coins/${encodeURIComponent(id)}`, { signal })

  return {
    id: data.id ?? id,
    name: data.name ?? id,
    symbol: data.symbol ?? '',
    description: data.description?.en,
    homepage: data.links?.homepage?.[0] || undefined,
    market_data: {
      ath: { usd: data.market_data?.ath?.usd ?? null },
      atl: { usd: data.market_data?.atl?.usd ?? null },
      ath_date: { usd: data.market_data?.ath_date?.usd ?? null },
      atl_date: { usd: data.market_data?.atl_date?.usd ?? null },
    },
    sentiment_votes_up_percentage: data.sentiment_votes_up_percentage ?? null,
    sentiment_votes_down_percentage: data.sentiment_votes_down_percentage ?? null,
    marketData: {
      currentPriceUsd: data.market_data?.current_price?.usd,
      priceChange24h: data.market_data?.price_change_percentage_24h,
      marketCapUsd: data.market_data?.market_cap?.usd,
      totalVolumeUsd: data.market_data?.total_volume?.usd,
      circulatingSupply: data.market_data?.circulating_supply,
    },
  }
}

export async function getCoinMarketChart(id: string, days: number, signal?: AbortSignal): Promise<CoinMarketPoint[]> {
  const data = await httpGet<CoinMarketChartResponse>(
    `/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}`,
    { signal },
  )

  return (data.prices ?? [])
    .filter((entry): entry is [number, number] => Array.isArray(entry) && entry.length === 2)
    .map(([timestamp, price]) => ({
      t: timestamp,
      price,
    }))
}

export async function getSimplePrices(ids: string[], signal?: AbortSignal): Promise<SimplePriceMap> {
  if (ids.length === 0) {
    return {}
  }

  const idsParam = ids.map((id) => encodeURIComponent(id)).join(',')
  return httpGet<SimplePriceMap>(
    `/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true`,
    { signal },
  )
}

export async function getTopMarkets(signal?: AbortSignal): Promise<TopMarketCoin[]> {
  const data = await httpGet<TopMarketResponseItem[]>(
    '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
    { signal },
  )

  return (data ?? [])
    .filter((coin) => coin.id && coin.name && coin.symbol)
    .map((coin) => ({
      id: coin.id as string,
      name: coin.name as string,
      symbol: coin.symbol as string,
      image: coin.image ?? '',
      current_price: coin.current_price ?? 0,
      price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
      market_cap: coin.market_cap ?? 0,
    }))
}
