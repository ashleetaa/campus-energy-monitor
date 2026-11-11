// The root cause of an alert and what to do about it:
// 1. Root cause, then a choice: "Make changes" or "Ignore, this was expected".
// 2. After "Make changes": the one fix that solves it (highlighted), plus
//    optional extra savings that lower the building's normal costs.

import { formatDollars } from '../data/format'
import type { Recommendation } from '../data/recommendations'
import type { Decision } from '../hooks/useEnergyData'

type Props = {
  recommendations: Recommendation[]
  doneIds: string[]
  onMarkDone: (id: string) => void
  decision: Decision
  onDecide: (decision: Decision) => void
}

function MarkDoneButton({ done, onClick }: { done: boolean; onClick: () => void }) {
  if (done) {
    return <p className="w-32 text-center text-sm font-semibold text-green-700">✓ Done</p>
  }
  return (
    <button
      onClick={onClick}
      className="w-32 rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800"
    >
      Mark as done
    </button>
  )
}

export default function RecommendationList({ recommendations, doneIds, onMarkDone, decision, onDecide }: Props) {
  const mainFix = recommendations.find((rec) => rec.fixesProblem)
  const extras = recommendations.filter((rec) => !rec.fixesProblem)
  // Show the fixes once the manager chose to act (or already fixed it).
  const showFixes = decision === 'fixing' || (mainFix !== undefined && doneIds.includes(mainFix.id))

  return (
    <div className="mb-6 space-y-6">
      {mainFix && (
        <section
          className={`rounded-xl border-2 p-5 shadow-sm ${
            doneIds.includes(mainFix.id) ? 'border-green-500 bg-green-50' : 'border-blue-600 bg-blue-50'
          }`}
        >
          <p className="text-sm font-semibold text-blue-800 uppercase">Root cause</p>
          <p className="mt-1 text-lg text-slate-900">{mainFix.rootCause}</p>

          {!showFixes && (
            <div className="mt-4 border-t border-blue-200 pt-4">
              <p className="font-semibold text-slate-900">What would you like to do?</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  onClick={() => onDecide('fixing')}
                  className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                >
                  Make changes
                </button>
                <button
                  onClick={() => onDecide('ignored')}
                  className="rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Ignore, this was expected
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                For example, ignore it if the building was booked for an overnight event.
              </p>
            </div>
          )}

          {showFixes && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-blue-200 pt-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-600">The fix: this alone solves the problem</p>
                <p className="text-xl font-bold text-slate-900">{mainFix.title}</p>
                <p className="text-sm text-slate-600">{mainFix.detail}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Saves about</p>
                <p className="text-3xl font-bold text-green-700 tabular-nums">
                  {formatDollars(mainFix.monthlySavings)}/month
                </p>
              </div>
              <MarkDoneButton done={doneIds.includes(mainFix.id)} onClick={() => onMarkDone(mainFix.id)} />
            </div>
          )}
        </section>
      )}

      {showFixes && extras.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">Save even more (optional)</h3>
          <p className="mb-4 text-sm text-slate-500">
            Not needed to fix the problem above. These lower the building's normal overnight costs.
          </p>
          <ul className="space-y-3">
            {extras.map((rec) => {
              const done = doneIds.includes(rec.id)
              return (
                <li
                  key={rec.id}
                  className={`flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4 ${
                    done ? 'border-green-200 bg-green-50' : 'border-slate-200'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{rec.title}</p>
                    <p className="text-sm text-slate-600">{rec.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Saves about</p>
                    <p className="text-lg font-semibold text-green-700 tabular-nums">
                      {formatDollars(rec.monthlySavings)}/month
                    </p>
                  </div>
                  <MarkDoneButton done={done} onClick={() => onMarkDone(rec.id)} />
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
