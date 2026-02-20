import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { formatPercent, formatUsd } from '../../utils/format'
import type { WatchlistPriceRow } from './types'

type WatchlistTableProps = {
  rows: WatchlistPriceRow[]
  onRemove: (id: string) => void
}

export function WatchlistTable({ rows, onRemove }: WatchlistTableProps) {
  const navigate = useNavigate()

  return (
    <Card className="p-0">
      <div className="grid grid-cols-1 gap-0">
        <div className="hidden grid-cols-[1.2fr_1fr_1fr_auto] items-center gap-3 border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid">
          <span>Coin</span>
          <span>Price</span>
          <span>24h Change</span>
          <span className="text-right">Action</span>
        </div>

        {rows.map((row) => (
          <div
            key={row.id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/coin/${row.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigate(`/coin/${row.id}`)
              }
            }}
            className="grid cursor-pointer grid-cols-1 gap-3 border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50 focus-within:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-slate-400 last:border-b-0 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:items-center"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">Coin</p>
              <p className="truncate text-sm font-semibold text-slate-900 transition hover:text-slate-700">
                {row.name} ({row.symbol})
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{row.id}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">Price</p>
              <p className="text-sm text-slate-900">{formatUsd(row.priceUsd)}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">24h Change</p>
              <p
                className={
                  typeof row.change24h === 'number'
                    ? row.change24h >= 0
                      ? 'text-sm font-semibold text-emerald-600'
                      : 'text-sm font-semibold text-rose-600'
                    : 'text-sm text-slate-500'
                }
              >
                {typeof row.change24h === 'number'
                  ? `${row.change24h > 0 ? '+' : ''}${formatPercent(row.change24h)}`
                  : '--'}
              </p>
            </div>

            <div className="sm:justify-self-end">
              <Button
                onClick={(event) => {
                  event.stopPropagation()
                  onRemove(row.id)
                }}
                variant="danger"
                className="w-full sm:w-auto"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
