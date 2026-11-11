// The gray banner shown when the manager chose to ignore an alert.
// It still shows what the unusual use costs, so ignoring it is an informed choice.

import type { Alert } from '../data/alerts'
import { formatDollars } from '../data/format'

type Props = {
  alert: Alert
  onReview: () => void // undo "ignore" and decide again
}

export default function IgnoredBanner({ alert, onReview }: Props) {
  return (
    <div className="mb-6 rounded-xl border border-slate-300 bg-slate-100 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-600 uppercase">Ignored · marked as expected</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {alert.building.name} used {alert.percentAbove}% more power than normal from {alert.fromLabel} to{' '}
            {alert.toLabel}
          </h2>
          <p className="mt-1 text-slate-600">
            If this keeps happening, it costs about{' '}
            <span className="font-semibold text-slate-900">{formatDollars(alert.extraCostPerMonth)}/month</span> (
            {formatDollars(alert.extraCostPerYear)}/year).
          </p>
        </div>
        <button
          onClick={onReview}
          className="rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Review again
        </button>
      </div>
    </div>
  )
}
