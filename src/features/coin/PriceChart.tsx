import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { CoinMarketPoint } from './types'
import { formatUsd } from '../../utils/format'
import { formatAxisTime, formatTooltipTime } from '../../utils/time'
import type { TrendInsight } from './trend'

type PriceChartProps = {
  data: CoinMarketPoint[]
  days: number
  direction?: TrendInsight['direction']
}

type PriceChartTooltipProps = {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: number | string
  days: number
}

function PriceChartTooltip({
  active,
  payload,
  label,
  days,
}: PriceChartTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const value = payload[0]?.value
  if (typeof value !== 'number') {
    return null
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="text-slate-500">{typeof label === 'number' ? formatTooltipTime(label, days) : ''}</p>
      <p className="mt-1 font-semibold text-slate-900">{formatUsd(value)}</p>
    </div>
  )
}

export function PriceChart({ data, days, direction = 'flat' }: PriceChartProps) {
  const lineColor =
    direction === 'up' ? '#059669' : direction === 'down' ? '#dc2626' : '#0f172a'

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
        <p className="text-sm text-slate-500">No chart data available.</p>
      </div>
    )
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="t"
            minTickGap={24}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatAxisTime(value, days)}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={72}
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value: number) => formatUsd(value)}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <Tooltip content={<PriceChartTooltip days={days} />} />
          <Line type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2.25} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
