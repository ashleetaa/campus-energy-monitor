// The list of suggested fixes for an alert, each with its monthly savings
// and a "Mark as done" button.

import { formatDollars } from '../data/format'
import type { Recommendation } from '../data/recommendations'

type Props = {
  recommendations: Recommendation[]
  doneIds: string[]
  onMarkDone: (id: string) => void
}

export default function RecommendationList({ recommendations, doneIds, onMarkDone }: Props) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-slate-900">Recommended fixes</h3>
      <ul className="space-y-3">
        {recommendations.map((rec) => {
          const done = doneIds.includes(rec.id)
          return (
            <li
              key={rec.id}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4 ${
                done ? 'border-green-200 bg-green-50' : 'border-slate-200'
              }`}
            >
              <div className="min-w-0 flex-1">
                {rec.fixesProblem && (
                  <p className="mb-1 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                    Fixes this problem
                  </p>
                )}
                <p className="font-semibold text-slate-900">{rec.title}</p>
                <p className="text-sm text-slate-600">{rec.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Saves about</p>
                <p className="text-xl font-bold text-green-700 tabular-nums">
                  {formatDollars(rec.monthlySavings)}/month
                </p>
              </div>
              {done ? (
                <p className="w-32 text-center text-sm font-semibold text-green-700">✓ Done</p>
              ) : (
                <button
                  onClick={() => onMarkDone(rec.id)}
                  className="w-32 rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  Mark as done
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
