// The "Monthly savings" summary at the top of the dashboard.
// Available = fixes not done yet. Achieved = fixes marked done.

import { formatDollars } from '../data/format'
import type { Recommendation } from '../data/recommendations'

type Props = {
  recommendations: Recommendation[]
  doneIds: string[]
}

function total(recs: Recommendation[]): number {
  return recs.reduce((sum, rec) => sum + rec.monthlySavings, 0)
}

function fixCount(count: number): string {
  return count === 1 ? '1 fix' : `${count} fixes`
}

export default function SavingsSummary({ recommendations, doneIds }: Props) {
  const done = recommendations.filter((rec) => doneIds.includes(rec.id))
  const open = recommendations.filter((rec) => !doneIds.includes(rec.id))

  return (
    <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-semibold text-slate-900">Monthly savings</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Savings available</p>
          <p className="text-3xl font-bold text-slate-900 tabular-nums">
            {formatDollars(total(open))}
            <span className="text-base font-medium text-slate-500">/month</span>
          </p>
          <p className="text-sm text-slate-500">
            {open.length > 0 ? `From ${fixCount(open.length)} not done yet` : 'No open fixes right now'}
          </p>
        </div>
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-slate-600">Savings achieved</p>
          <p className="text-3xl font-bold text-green-700 tabular-nums">
            {formatDollars(total(done))}
            <span className="text-base font-medium text-slate-500">/month</span>
          </p>
          <p className="text-sm text-slate-500">
            {done.length > 0
              ? `From ${fixCount(done.length)} marked done`
              : 'Mark a fix as done to start saving'}
          </p>
        </div>
      </div>
    </section>
  )
}
