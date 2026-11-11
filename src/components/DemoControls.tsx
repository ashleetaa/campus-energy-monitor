// A small box in the top-right of the header with buttons for running the demo.
// Kept small and out of the way so the main screen looks like the real product,
// and it never covers other buttons.

type Props = {
  spikeOn: boolean
  onSimulateSpike: () => void
  onReset: () => void
}

export default function DemoControls({ spikeOn, onSimulateSpike, onReset }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="mb-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">Demo controls</p>
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
