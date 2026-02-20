import { useNavigate } from 'react-router-dom'
import { Card } from '../components/Card'
import { useTopMarkets } from '../features/market/useTopMarkets'
import { SearchBox } from '../features/search/SearchBox'
import { formatUsd } from '../utils/format'

export function Home() {
  const navigate = useNavigate()
  const { data: markets = [], isLoading, isError } = useTopMarkets()

  return (
    <section className="space-y-6">
      <Card className="p-0">
        <div className="border-b border-slate-200/70 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Market Snapshot</h2>
          <p className="mt-1 text-sm text-slate-600">Top 10 cryptocurrencies by market cap</p>
        </div>

        <div className="grid grid-cols-1">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid">
            <span>Coin</span>
            <span>Price</span>
            <span>24h %</span>
            <span>Market Cap</span>
          </div>

          {isLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={`market-loading-${idx}`}
                  className="grid grid-cols-1 gap-3 border-t border-slate-100 px-5 py-4 sm:grid-cols-[1.4fr_1fr_1fr_1fr] sm:items-center"
                >
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                </div>
              ))
            : null}

          {!isLoading && isError ? (
            <p className="border-t border-slate-100 px-5 py-4 text-sm text-slate-500">Unable to load market data.</p>
          ) : null}

          {!isLoading && !isError
            ? markets.map((coin) => {
                const change = coin.price_change_percentage_24h ?? 0
                const isPositive = change >= 0

                return (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() =>
                      navigate(`/coin/${coin.id}`, {
                        state: {
                          coin: {
                            id: coin.id,
                            name: coin.name,
                            symbol: coin.symbol,
                          },
                        },
                      })
                    }
                    className="group grid w-full grid-cols-1 gap-3 border-t border-slate-100 px-5 py-4 text-left transition-colors duration-150 hover:bg-slate-50 focus-within:bg-slate-50 sm:grid-cols-[1.4fr_1fr_1fr_1fr] sm:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {coin.image ? (
                        <img src={coin.image} alt="" className="h-7 w-7 rounded-full bg-slate-200 object-cover" />
                      ) : (
                        <span className="h-7 w-7 rounded-full bg-slate-200" aria-hidden="true" />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-900">{coin.name}</span>
                        <span className="block truncate text-xs uppercase text-slate-500">{coin.symbol}</span>
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-900">{formatUsd(coin.current_price)}</p>

                    <p className={isPositive ? 'text-sm font-semibold text-emerald-600' : 'text-sm font-semibold text-rose-600'}>
                      {isPositive ? `▲ +${Math.abs(change).toFixed(2)}%` : `▼ -${Math.abs(change).toFixed(2)}%`}
                    </p>

                    <p className="text-sm text-slate-700 sm:flex sm:items-center sm:justify-between">
                      <span>{formatUsd(coin.market_cap)}</span>
                      <span
                        aria-hidden="true"
                        className="hidden text-slate-400 opacity-0 transition-opacity duration-150 group-hover:opacity-100 sm:inline"
                      >
                        →
                      </span>
                    </p>
                  </button>
                )
              })
            : null}
        </div>
      </Card>

      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Search Coins</h2>
        <p className="mt-1 text-sm text-slate-600">Find assets and open detailed analysis pages.</p>
      </header>

      <Card className="p-6 sm:p-8">
        <SearchBox />
      </Card>

      <Card className="min-h-52 p-6">
        <p className="text-sm text-slate-500">Search results open in the dropdown above. Select a coin to view details.</p>
      </Card>
    </section>
  )
}
