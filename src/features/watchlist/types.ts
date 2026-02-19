export type WatchlistItem = {
  id: string
  name: string
  symbol: string
}

export type WatchlistItems = WatchlistItem[]

export type SimplePriceMap = Record<
  string,
  {
    usd?: number
    usd_24h_change?: number
  }
>

export type WatchlistPriceRow = {
  id: string
  name: string
  symbol: string
  priceUsd?: number
  change24h?: number
}
