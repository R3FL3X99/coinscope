export type CoinDetails = {
  id: string
  name: string
  symbol: string
  description?: string
  homepage?: string
  market_data: {
    ath?: { usd?: number | null }
    atl?: { usd?: number | null }
    ath_date?: { usd?: string | null }
    atl_date?: { usd?: string | null }
  }
  sentiment_votes_up_percentage?: number | null
  sentiment_votes_down_percentage?: number | null
  marketData: {
    currentPriceUsd?: number
    priceChange24h?: number
    marketCapUsd?: number
    totalVolumeUsd?: number
    circulatingSupply?: number
  }
}

export type CoinMarketPoint = {
  t: number
  price: number
}

export type CoinTimeframeOption = {
  label: '24H' | '7D' | '30D' | '1Y'
  days: 1 | 7 | 30 | 365
}
