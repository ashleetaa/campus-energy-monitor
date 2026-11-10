// The red banner shown when a building uses much more power than last week.
// Leads with the problem and what it costs.

import type { Alert } from '../data/alerts'
import { formatDollars } from '../data/format'

type Props = {
  alert: Alert
  onViewChart?: () => void // leave out to hide the "View chart" button
}

export default function AlertBanner({ alert, onViewChart }: Props) {
  return (
    <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-5" role="alert">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-red-700 uppercase">⚠ Unusual energy use</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {alert.building.name} used {alert.percentAbove}% more power than normal from{' '}
            {alert.fromLabel} to {alert.toLabel}
          </h2>
          <p className="mt-1 text-slate-600">Compared with the same hours last week.</p>
        </div>
        {onViewChart && (
          <button
            onClick={onViewChart}
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            View chart →
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-red-200 pt-4 sm:max-w-xl">
        <div>
          <p className="text-sm text-slate-600">Extra cost per day</p>
          <p className="text-2xl font-bold text-red-700 tabular-nums">{formatDollars(alert.extraCostPerDay)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Per month</p>
          <p className="text-2xl font-bold text-red-700 tabular-nums">{formatDollars(alert.extraCostPerMonth)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-600">Per year</p>
          <p className="text-2xl font-bold text-red-700 tabular-nums">{formatDollars(alert.extraCostPerYear)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Month and year assume it keeps happening every night.</p>
    </div>
  )
}
