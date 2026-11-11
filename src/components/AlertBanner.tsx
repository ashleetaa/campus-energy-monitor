// The red alert shown when a building uses much more power than last week.
// Leads with the problem and what it costs. Stacked top to bottom so it fits
// the narrow side panel on the dashboard as well as the detail screen.

import { AlertTriangle } from 'lucide-react'
import type { Alert } from '../data/alerts'
import { formatDollars } from '../data/format'

type Props = {
  alert: Alert
  onViewChart?: () => void // leave out to hide the "Look into it" button
}

export default function AlertBanner({ alert, onViewChart }: Props) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-5" role="alert">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-red-700 uppercase">
        <AlertTriangle className="size-4" />
        Unusual energy use
      </p>
      <h2 className="mt-2 text-lg leading-snug font-bold text-slate-900">
        {alert.building.name} used {alert.percentAbove}% more power than normal from {alert.fromLabel} to{' '}
        {alert.toLabel}
      </h2>
      <p className="mt-1 text-sm text-slate-600">Compared with the same hours last week.</p>

      <div className="mt-4 grid max-w-xl grid-cols-3 gap-3 border-t border-red-200 pt-4">
        <div>
          <p className="text-xs text-slate-600">Extra cost per day</p>
          <p className="text-xl font-bold text-red-700 tabular-nums">{formatDollars(alert.extraCostPerDay)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Per month</p>
          <p className="text-xl font-bold text-red-700 tabular-nums">{formatDollars(alert.extraCostPerMonth)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-600">Per year</p>
          <p className="text-xl font-bold text-red-700 tabular-nums">{formatDollars(alert.extraCostPerYear)}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">Month and year assume it keeps happening every day.</p>

      {onViewChart && (
        <button
          onClick={onViewChart}
          className="mt-4 w-full rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
        >
          Look into it →
        </button>
      )}
    </div>
  )
}
