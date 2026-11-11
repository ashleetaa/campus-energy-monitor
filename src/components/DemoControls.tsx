// A small box in the top-right of the header with controls for running the demo:
// pick a scenario, simulate it, reset. Kept small and out of the way so the main
// screen looks like the real product, and it never covers other buttons.

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
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">Demo controls</p>
      <select
        value={scenarioId}
        onChange={(event) => onSelectScenario(event.target.value)}
        disabled={spikeOn} // reset first to switch scenarios
        aria-label="Scenario"
        className="mb-2 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-700 disabled:opacity-50"
      >
        {SCENARIOS.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={onSimulateSpike}
          disabled={spikeOn}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Simulate spike
        </button>
        <button
          onClick={onReset}
          disabled={!spikeOn}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
