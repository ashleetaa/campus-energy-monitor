// The gray banner shown when the manager chose to ignore an alert.
// It still shows what the unusual use costs, so ignoring it is an informed choice.

import { EyeOff } from 'lucide-react'
import type { Alert } from '../data/alerts'
import { formatDollars } from '../data/format'

type Props = {
  alert: Alert
  onReview: () => void // undo "ignore" and decide again
}

export default function IgnoredBanner({ alert, onReview }: Props) {
  return (
    <div className="rounded-xl border border-slate-300 bg-slate-100 p-5">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 uppercase">
        <EyeOff className="size-4" />
        Ignored · marked as expected
      </p>
      <h2 className="mt-2 text-lg leading-snug font-bold text-slate-900">
        {alert.building.name} used {alert.percentAbove}% more power than normal from {alert.fromLabel} to{' '}
        {alert.toLabel}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        If this keeps happening, it costs about{' '}
        <span className="font-semibold text-slate-900">{formatDollars(alert.extraCostPerMonth)}/month</span> (
        {formatDollars(alert.extraCostPerYear)}/year).
      </p>
      <button
        onClick={onReview}
        className="mt-4 w-full rounded-lg border border-slate-400 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Review again
      </button>
    </div>
  )
}
