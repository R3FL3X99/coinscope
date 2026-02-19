export type CoinDetails = {
  id: string
  name: string
  symbol: string
  description?: string
  homepage?: string
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
