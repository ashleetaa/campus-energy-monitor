// One building on the campus map: icon, name, power right now, a colored
// status pill, and a small line with energy used and cost so far today.
// The whole card is a button that opens the building's 24-hour chart.

import { ArrowUp, Check, EyeOff } from 'lucide-react'
import type { Reading } from '../hooks/useEnergyData'
import { formatDollars, formatKw, formatKwh } from '../data/format'
import { iconFor } from './buildingIcons'

type Props = {
  reading: Reading
  needsAttention: boolean // true when this building has an alert
  ignored: boolean // true when its alert was marked as expected
  percentAbove: number | null // how far above last week, when there's an alert
  onClick: () => void // opens this building's detail screen
}

function StatusPill({ needsAttention, ignored, percentAbove }: Omit<Props, 'reading' | 'onClick'>) {
  if (needsAttention) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
        <ArrowUp className="size-3.5" />
        {percentAbove !== null ? `+${percentAbove}%` : 'Needs attention'}
      </span>
    )
  }
  if (ignored) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
        <EyeOff className="size-3.5" />
        Ignored (expected)
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
      <Check className="size-3.5" />
      Normal
    </span>
  )
}

export default function BuildingCard({ reading, needsAttention, ignored, percentAbove, onClick }: Props) {
  const { building, kw, kwh, cost } = reading
  const Icon = iconFor(building.id)

  // Red when it needs attention, gray when ignored, green when normal.
  const look = needsAttention
    ? 'border-red-400 bg-red-50 hover:border-red-500'
    : ignored
      ? 'border-slate-300 bg-slate-50 hover:border-slate-400'
      : 'border-[#c4e3c0] bg-[#f2f9f1] hover:border-[#8fca8a]' // soft, muted green
  const iconColor = needsAttention ? 'text-red-600' : ignored ? 'text-slate-500' : 'text-green-700'

  return (
    <button
      onClick={onClick}
      title="View 24-hour history"
      className={`flex size-full items-start gap-4 rounded-2xl border-2 p-4 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg ${look}`}
    >
      <Icon className={`mt-1 size-9 shrink-0 ${iconColor}`} strokeWidth={1.75} />
      <div className="min-w-0 flex-1">
        {/* Room for two lines, so cards are the same size even when a name is short. */}
        <h2 className="min-h-[2lh] leading-snug font-semibold text-slate-900">{building.name}</h2>
        <p className="text-3xl font-bold text-slate-900 tabular-nums">{formatKw(kw)}</p>
        <div className="mt-2">
          <StatusPill needsAttention={needsAttention} ignored={ignored} percentAbove={percentAbove} />
        </div>
        <p className="mt-1.5 text-xs text-slate-500 tabular-nums">
          Today: {formatKwh(kwh)} · {formatDollars(cost)}
        </p>
      </div>
    </button>
  )
}
