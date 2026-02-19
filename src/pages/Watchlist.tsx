import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { WatchlistTable } from '../features/watchlist/WatchlistTable'
import { useWatchlist } from '../features/watchlist/useWatchlist'
import { useWatchlistPrices } from '../features/watchlist/useWatchlistPrices'
import { ApiError } from '../services/http'

export function Watchlist() {
  const { items, ids, remove } = useWatchlist()
  const { rows, isLoading, isError, error, refetch } = useWatchlistPrices(items)

  const errorMessage =
    error instanceof ApiError && error.status === 429
      ? 'Rate limit reached — try again shortly.'
      : error instanceof Error
        ? error.message
        : 'Unable to load watchlist prices.'

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Watchlist</h2>
        <p className="mt-1 text-sm text-slate-600">Track your favorite assets in one place.</p>
      </header>

      {ids.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-600">No coins saved yet.</p>
          <p className="mt-2 text-sm text-slate-500">Add coins from the search page to start tracking prices.</p>
          <div className="mt-5">
            <Button to="/">Go to Search</Button>
          </div>
        </Card>
      ) : null}

      {ids.length > 0 && isLoading ? (
        <Card className="p-6">
          <p className="text-sm text-slate-500">Loading watchlist prices...</p>
        </Card>
      ) : null}

      {ids.length > 0 && isError ? (
        <Card className="space-y-4 p-6">
          <p className="text-sm text-rose-600">{errorMessage}</p>
          <Button onClick={() => void refetch()}>Retry</Button>
        </Card>
      ) : null}

      {ids.length > 0 && !isLoading && !isError ? <WatchlistTable rows={rows} onRemove={remove} /> : null}
    </section>
  )
}

