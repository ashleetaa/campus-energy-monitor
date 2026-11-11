// The green banner shown after the main fix is marked done: the problem is
// solved, and here's what it saves.

import { CheckCircle2 } from 'lucide-react'
import { formatDollars } from '../data/format'

type Props = {
  buildingName: string
  text: string // what was fixed, e.g. "Root cause fixed: ..."
  monthlySavings: number
  yearlySavings: number
  onViewDetails?: () => void // leave out to hide the button
}

export default function ResolvedBanner({ buildingName, text, monthlySavings, yearlySavings, onViewDetails }: Props) {
  return (
    <div className="rounded-xl border border-green-300 bg-green-50 p-5">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-green-800 uppercase">
        <CheckCircle2 className="size-4" />
        Resolved
      </p>
      <h2 className="mt-2 text-lg leading-snug font-bold text-slate-900">{buildingName} is back to normal</h2>
      <p className="mt-1 text-sm text-slate-600">
        {text} Saving about{' '}
        <span className="font-semibold text-green-800">{formatDollars(monthlySavings)}/month</span> (
        {formatDollars(yearlySavings)}/year).
      </p>
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="mt-4 w-full rounded-lg border border-green-700 bg-white px-4 py-2.5 text-sm font-semibold text-green-800 hover:bg-green-100"
        >
          View details →
        </button>
      )}
    </div>
  )
}
