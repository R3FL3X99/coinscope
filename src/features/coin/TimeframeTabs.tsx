import { cn } from '../../utils/classnames'
import type { CoinTimeframeOption } from './types'

const timeframeOptions: CoinTimeframeOption[] = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 },
]

type TimeframeTabsProps = {
  value: number
  onChange: (days: CoinTimeframeOption['days']) => void
}

export function TimeframeTabs({ value, onChange }: TimeframeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Chart timeframe"
      className="inline-flex w-full max-w-full overflow-x-auto rounded-full border border-slate-200 bg-slate-100 p-1 sm:w-auto"
    >
      {timeframeOptions.map((option) => {
        const isActive = option.days === value
        return (
          <button
            key={option.days}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.days)}
            className={cn(
              'min-w-[3.5rem] rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-200',
              isActive
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
