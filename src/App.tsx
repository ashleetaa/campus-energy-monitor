// The main screen. Shows either the dashboard (all 4 buildings) or one
// building's detail, depending on which building is selected.

import { useState } from 'react'
import AlertBanner from './components/AlertBanner'
import BuildingCard from './components/BuildingCard'
import BuildingDetail from './components/BuildingDetail'
import DemoControls from './components/DemoControls'
import { useEnergyData } from './hooks/useEnergyData'

export default function App() {
  const { now, readings, alerts, spikeOn, simulateSpike, reset } = useEnergyData()
  // null = show the dashboard; otherwise the id of the building to show
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = readings.find((reading) => reading.building.id === selectedId)
  const alertFor = (buildingId: string) => alerts.find((alert) => alert.building.id === buildingId)

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
          alert={alertFor(selected.building.id)}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <>
          {alerts.map((alert) => (
            <AlertBanner
              key={alert.building.id}
              alert={alert}
              onViewChart={() => setSelectedId(alert.building.id)}
            />
          ))}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {readings.map((reading) => (
              <BuildingCard
                key={reading.building.id}
                reading={reading}
                needsAttention={alertFor(reading.building.id) !== undefined}
                onClick={() => setSelectedId(reading.building.id)}
              />
            ))}
          </div>
        </>
      )}

      <DemoControls spikeOn={spikeOn} onSimulateSpike={simulateSpike} onReset={reset} />
    </main>
  )
}
