// The green banner shown after the main fix is marked done: the problem is
// solved, and here's what it saves.

import { formatDollars } from '../data/format'

type Props = {
  buildingName: string
  monthlySavings: number
  yearlySavings: number
  onViewDetails?: () => void // leave out to hide the button
}

export default function ResolvedBanner({ buildingName, monthlySavings, yearlySavings, onViewDetails }: Props) {
  return (
    <div className="mb-6 rounded-xl border border-green-300 bg-green-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-green-800 uppercase">✓ Resolved</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">{buildingName} is back to normal</h2>
          <p className="mt-1 text-slate-600">
            Root cause fixed: the HVAC now switches to its overnight setting. Saving about{' '}
            <span className="font-semibold text-green-800">{formatDollars(monthlySavings)}/month</span> (
            {formatDollars(yearlySavings)}/year).
          </p>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="rounded-md border border-green-700 px-4 py-2 text-sm font-medium text-green-800 hover:bg-green-100"
          >
            View details →
          </button>
        )}
      </div>
    </div>
  )
}
