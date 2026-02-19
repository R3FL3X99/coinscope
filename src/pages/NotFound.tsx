import { Button } from '../components/Button'
import { Card } from '../components/Card'

export function NotFound() {
  return (
    <section className="py-8">
      <Card className="mx-auto max-w-xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">404</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h2>
        <p className="mt-3 text-sm text-slate-600">The page you requested does not exist or may have moved.</p>
        <div className="mt-6">
          <Button to="/">Back to Home</Button>
        </div>
      </Card>
    </section>
  )
}
