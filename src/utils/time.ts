export function formatAxisTime(timestampMs: number, days: number) {
  if (days === 1) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
    }).format(timestampMs)
  }

  if (days === 365) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
    }).format(timestampMs)
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(timestampMs)
}

export function formatTooltipTime(timestampMs: number, days: number) {
  if (days === 1) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(timestampMs)
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(timestampMs)
}
