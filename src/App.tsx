// The main screen: a header and one card per building.

import BuildingCard from './components/BuildingCard'
import { useEnergyData } from './hooks/useEnergyData'

export default function App() {
  const { now, readings } = useEnergyData()

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Campus Energy Monitor</h1>
        <p className="mt-1 text-slate-600">
          Live power use across campus · Updated {now.toLocaleTimeString('en-US')}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {readings.map((reading) => (
          <BuildingCard key={reading.building.id} reading={reading} />
        ))}
      </div>
    </main>
  )
}
