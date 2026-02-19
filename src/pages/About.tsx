import { Card } from '../components/Card'

export function About() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">About CoinScope</h2>
      </header>

      <Card>
        <p className="text-sm leading-6 text-slate-700">
          CoinScope is a crypto research dashboard focused on helping you inspect market data, compare assets, and track a
          personal watchlist. This phase ships the app shell, navigation, and placeholder experiences for future data
          integrations.
        </p>
      </Card>
    </section>
  )
}
