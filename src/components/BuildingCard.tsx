// One card on the dashboard: a building's power right now, energy used
// today, and what today has cost so far.

import type { Reading } from '../hooks/useEnergyData'
import { formatDollars, formatKw, formatKwh } from '../data/format'

type Props = {
  reading: Reading
  needsAttention: boolean // true when this building has an alert
  ignored: boolean // true when its alert was marked as expected
  onClick: () => void // opens this building's detail screen
}

export default function BuildingCard({ reading, needsAttention, ignored, onClick }: Props) {
  const { building, kw, kwh, cost } = reading
  const border = needsAttention
    ? 'border-2 border-red-500 hover:border-red-600'
    : 'border border-slate-200 hover:border-blue-400'

  return (
    <button
      onClick={onClick}
      className={`flex flex-col rounded-xl bg-white p-5 text-left shadow-sm transition hover:shadow-md ${border}`}
    >
      {needsAttention && (
        <p className="mb-2 self-start rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          ⚠ Needs attention
        </p>
      )}
      {ignored && (
        <p className="mb-2 self-start rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
          Alert ignored (expected)
        </p>
      )}
      <h2 className="text-lg font-semibold text-slate-900">{building.name}</h2>
      <p className="text-sm text-slate-500">{building.description}</p>

      {/* mt-auto pushes the numbers to the bottom, so they line up across cards
          even when names, descriptions or labels have different lengths. */}
      <div className="mt-auto pt-4">
        <p className="text-sm text-slate-500">Using right now</p>
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
      </div>
    </button>
  )
}
