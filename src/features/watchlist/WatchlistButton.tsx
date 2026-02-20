import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { useWatchlist } from './useWatchlist'
import type { WatchlistItem } from './types'

type WatchlistButtonProps = {
  coin?: WatchlistItem
}

export function WatchlistButton({ coin }: WatchlistButtonProps) {
  const { toggle, has } = useWatchlist()
  const [feedback, setFeedback] = useState('')
  const isSaved = coin ? has(coin.id) : false

  useEffect(() => {
    if (!feedback) {
      return
    }

    const timerId = window.setTimeout(() => setFeedback(''), 1000)
    return () => window.clearTimeout(timerId)
  }, [feedback])

  if (!coin) {
    return null
  }

  return (
    <div className="mt-3 space-y-2 sm:mt-4">
      <Button
        onClick={() => {
          toggle(coin)
          setFeedback(isSaved ? 'Removed' : 'Saved')
        }}
        variant={isSaved ? 'danger' : 'primary'}
      >
        {isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
      </Button>
      {feedback ? <p className="text-xs text-slate-500">{feedback}</p> : null}
    </div>
  )
}
