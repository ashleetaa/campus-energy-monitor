// The main screen. Shows either the dashboard (all 4 buildings) or one
// building's detail, depending on which building is selected.

import { useState } from 'react'
import BuildingCard from './components/BuildingCard'
import BuildingDetail from './components/BuildingDetail'
import DemoControls from './components/DemoControls'
import { useEnergyData } from './hooks/useEnergyData'

export default function App() {
  const { now, readings, spikeOn, simulateSpike, reset } = useEnergyData()
  // null = show the dashboard; otherwise the id of the building to show
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = readings.find((reading) => reading.building.id === selectedId)

  return (
    <main className="min-h-screen bg-slate-50 p-6 pb-32 md:p-10 md:pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Campus Energy Monitor</h1>
        <p className="mt-1 text-slate-600">
          Live power use across campus · Updated {now.toLocaleTimeString('en-US')}
        </p>
      </header>

      {selected ? (
        <BuildingDetail
          building={selected.building}
          now={now}
          spikeOn={spikeOn}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {readings.map((reading) => (
            <BuildingCard
              key={reading.building.id}
              reading={reading}
              onClick={() => setSelectedId(reading.building.id)}
            />
          ))}
        </div>
      )}

      <DemoControls spikeOn={spikeOn} onSimulateSpike={simulateSpike} onReset={reset} />
    </main>
  )
}
