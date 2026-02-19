import { Card } from '../components/Card'
import { SearchBox } from '../features/search/SearchBox'

export function Home() {
  return (
    <section className="space-y-6">
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
