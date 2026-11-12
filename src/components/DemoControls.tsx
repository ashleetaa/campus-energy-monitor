// A small box at the right of the header banner with controls for running the
// demo: pick a scenario, simulate it, reset. Kept small and out of the way so
// the main screen looks like the real product, and it never covers other buttons.

import { Monitor } from 'lucide-react'
import { SCENARIOS } from '../data/scenarios'

type Props = {
  scenarioId: string | null // null until a scenario is picked
  onSelectScenario: (id: string) => void
  spikeOn: boolean
  onSimulateSpike: () => void
  onReset: () => void
}

export default function DemoControls({ scenarioId, onSelectScenario, spikeOn, onSimulateSpike, onReset }: Props) {
  return (
    // ml-auto keeps it on the right, even when it wraps under the name on narrow screens.
    <div className="ml-auto flex flex-wrap items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 p-1.5">
      <p className="flex items-center gap-1 px-1 text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
        <Monitor className="size-3.5" />
        Demo controls
      </p>
      <select
        value={scenarioId ?? ''}
        onChange={(event) => onSelectScenario(event.target.value)}
        disabled={spikeOn} // reset first to switch scenarios
        aria-label="Scenario"
        className="rounded-md bg-white px-1.5 py-1 text-xs text-slate-700 disabled:opacity-50"
      >
        <option value="" disabled>
          Select a scenario…
        </option>
        {SCENARIOS.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
      <button
        onClick={onSimulateSpike}
        disabled={spikeOn || scenarioId === null} // pick a scenario first
        className="rounded-md bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Simulate spike
      </button>
      <button
        onClick={onReset}
        disabled={!spikeOn}
        className="rounded-md border border-white/25 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reset
      </button>
    </div>
  )
}
