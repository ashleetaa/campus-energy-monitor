// The root cause of an alert and what to do about it:
// 1. Root cause, then a choice: "Make changes" or "Ignore, this was expected",
//    with the scenario's suggested choice marked.
// 2. After "Make changes": the one fix that solves it (highlighted, if there
//    is one), plus optional ways to save more.

import { formatDollars } from '../data/format'
import type { Recommendation } from '../data/recommendations'
import type { Decision } from '../hooks/useEnergyData'

type Props = {
  rootCause: string
  suggestion: 'fix' | 'ignore'
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

function SuggestedTag() {
  return (
    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
      Suggested
    </span>
  )
}

export default function RecommendationList({
  rootCause,
  suggestion,
  recommendations,
  doneIds,
  onMarkDone,
  decision,
  onDecide,
}: Props) {
  const mainFix = recommendations.find((rec) => rec.fixesProblem)
  const extras = recommendations.filter((rec) => !rec.fixesProblem)
  const mainFixDone = mainFix !== undefined && doneIds.includes(mainFix.id)
  // Show the fixes once the manager chose to act (or already fixed it).
  const showFixes = decision === 'fixing' || mainFixDone

  return (
    <div className="mb-6 space-y-6">
      <section
        className={`rounded-xl border-2 p-5 shadow-sm ${
          mainFixDone ? 'border-green-500 bg-green-50' : 'border-blue-600 bg-blue-50'
        }`}
      >
        <p className="text-sm font-semibold text-blue-800 uppercase">Root cause</p>
        <p className="mt-1 text-lg text-slate-900">{rootCause}</p>

        {!showFixes && (
          <div className="mt-4 border-t border-blue-200 pt-4">
            <p className="font-semibold text-slate-900">What would you like to do?</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onDecide('fixing')}
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Make changes
                {suggestion === 'fix' && <SuggestedTag />}
              </button>
              <button
                onClick={() => onDecide('ignored')}
                className="rounded-md border border-slate-400 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Ignore, this was expected
                {suggestion === 'ignore' && <SuggestedTag />}
              </button>
            </div>
          </div>
        )}

        {showFixes && mainFix && (
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
            <MarkDoneButton done={mainFixDone} onClick={() => onMarkDone(mainFix.id)} />
          </div>
        )}

        {showFixes && !mainFix && (
          <p className="mt-4 border-t border-blue-200 pt-4 text-slate-700">
            There's nothing to fix here: the extra use is expected. The options below only trim it.
          </p>
        )}

        {/* Changed your mind? Until the fix is done, go back to the choice. */}
        {showFixes && !mainFixDone && (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-blue-200 pt-4">
            <p className="text-sm text-slate-600">Changed your mind?</p>
            <button
              onClick={() => onDecide('undecided')}
              className="rounded-md border border-slate-400 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              ← Back
            </button>
          </div>
        )}
      </section>

      {showFixes && extras.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            {mainFix ? 'Save even more (optional)' : 'Ways to trim it (optional)'}
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            {mainFix
              ? "Not needed to fix the problem above. These lower the building's normal costs for those hours."
              : 'These reduce the extra use a little without stopping it.'}
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
