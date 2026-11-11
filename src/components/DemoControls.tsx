// A small box in the top-right of the header with controls for running the demo:
// pick a scenario, simulate it, reset. Kept small and out of the way so the main
// screen looks like the real product, and it never covers other buttons.

import { Monitor } from 'lucide-react'
import { SCENARIOS } from '../data/scenarios'

type Props = {
  scenarioId: string
  onSelectScenario: (id: string) => void
  spikeOn: boolean
  onSimulateSpike: () => void
  onReset: () => void
}

export default function DemoControls({ scenarioId, onSelectScenario, spikeOn, onSimulateSpike, onReset }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm">
      <p className="flex items-center gap-1.5 px-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
        <Monitor className="size-4" />
        Demo controls
      </p>
      <select
        value={scenarioId}
        onChange={(event) => onSelectScenario(event.target.value)}
        disabled={spikeOn} // reset first to switch scenarios
        aria-label="Scenario"
        className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 disabled:opacity-50"
      >
        {SCENARIOS.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
      <button
        onClick={onSimulateSpike}
        disabled={spikeOn}
        className="rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Simulate spike
      </button>
      <button
        onClick={onReset}
        disabled={!spikeOn}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset
      </button>
    </div>
  )
}
