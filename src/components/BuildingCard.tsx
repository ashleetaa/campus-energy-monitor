// One card on the dashboard: a building's power right now, energy used
// today, and what today has cost so far.

import type { Reading } from '../hooks/useEnergyData'
import { formatDollars, formatKw, formatKwh } from '../data/format'

type Props = {
  reading: Reading
  onClick: () => void // opens this building's detail screen
}

export default function BuildingCard({ reading, onClick }: Props) {
  const { building, kw, kwh, cost } = reading

  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md"
    >
      <h2 className="text-lg font-semibold text-slate-900">{building.name}</h2>
      <p className="text-sm text-slate-500">{building.description}</p>

      <p className="mt-4 text-sm text-slate-500">Using right now</p>
      <p className="text-3xl font-bold text-slate-900 tabular-nums">{formatKw(kw)}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm text-slate-500">Used today</p>
          <p className="text-lg font-semibold text-slate-900 tabular-nums">{formatKwh(kwh)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Cost today</p>
          <p className="text-lg font-semibold text-slate-900 tabular-nums">{formatDollars(cost)}</p>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-blue-700">View 24-hour history →</p>
    </button>
  )
}
