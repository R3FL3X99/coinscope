const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const numberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
})

export function formatUsd(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--'
  }

  return usdFormatter.format(value)
}

export function formatNumber(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--'
  }

  return numberFormatter.format(value)
}

export function formatPercent(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--'
  }

  return `${value.toFixed(2)}%`
}

export function formatShortDate(value?: string | null) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
