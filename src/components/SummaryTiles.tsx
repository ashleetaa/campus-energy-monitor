// The row of 4 tiles at the top of the dashboard: total campus power,
// active alerts, and the "Monthly savings" numbers:
// available = fixes not done yet (none if the alert was ignored),
// achieved = fixes marked done (these still count after ignoring).

import { AlertTriangle, CheckCircle2, CircleDollarSign, Zap, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatDollars, formatKw } from '../data/format'
import type { Recommendation } from '../data/recommendations'

type Props = {
  campusKw: number // all 4 buildings right now
  activeAlerts: number
  recommendations: Recommendation[]
  doneIds: string[]
  ignored: boolean // true when the manager chose "Ignore, this was expected"
}

function total(recs: Recommendation[]): number {
  return recs.reduce((sum, rec) => sum + rec.monthlySavings, 0)
}

// "1 open recommendation", "3 open recommendations"
function plural(count: number, word: string): string {
  return count === 1 ? `1 ${word}` : `${count} ${word}s`
}

// One tile: colored icon circle, label, big number, small note.
function Tile(props: { icon: LucideIcon; color: string; tint: string; label: string; children: ReactNode; note: ReactNode }) {
  const Icon = props.icon
  return (
    <div className={`flex gap-4 rounded-2xl border border-slate-200/80 p-5 shadow-sm ${props.tint}`}>
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-full ${props.color}`}>
        <Icon className="size-6" strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-600">{props.label}</p>
        {props.children}
        <p className="mt-0.5 text-xs text-slate-500">{props.note}</p>
      </div>
    </div>
  )
}

export default function SummaryTiles({ campusKw, activeAlerts, recommendations, doneIds, ignored }: Props) {
  // Work already done keeps saving money even if the rest is ignored.
  const done = recommendations.filter((rec) => doneIds.includes(rec.id))
  // Ignored fixes don't count as savings available.
  const open = ignored ? [] : recommendations.filter((rec) => !doneIds.includes(rec.id))

  return (
    <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Tile icon={Zap} color="bg-blue-100 text-blue-700" tint="bg-white" label="Campus power" note="All 4 buildings combined">
        <p className="text-3xl font-bold text-slate-900 tabular-nums">{formatKw(campusKw)}</p>
      </Tile>

      <Tile
        icon={AlertTriangle}
        color={activeAlerts > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}
        tint={activeAlerts > 0 ? 'bg-red-50/60' : 'bg-white'}
        label="Active alerts"
        note={activeAlerts > 0 ? 'Needs attention' : 'Nothing needs attention'}
      >
        <p className={`text-3xl font-bold tabular-nums ${activeAlerts > 0 ? 'text-red-600' : 'text-slate-900'}`}>
          {activeAlerts}
        </p>
      </Tile>

      <Tile
        icon={CircleDollarSign}
        color="bg-amber-100 text-amber-700"
        tint="bg-white"
        label="Savings available"
        note={
          open.length > 0
            ? `Across ${plural(open.length, 'open recommendation')}`
            : 'No open recommendations'
        }
      >
        <p className="text-3xl font-bold text-slate-900 tabular-nums">
          {formatDollars(total(open))}
          <span className="text-base font-medium text-slate-500">/month</span>
        </p>
      </Tile>

      <Tile
        icon={CheckCircle2}
        color="bg-green-100 text-green-700"
        tint={done.length > 0 ? 'bg-green-50/60' : 'bg-white'}
        label="Savings achieved"
        note={
          done.length > 0
            ? `From ${plural(done.length, 'completed recommendation')}`
            : 'Completed recommendations will show here'
        }
      >
        <p className="text-3xl font-bold text-green-700 tabular-nums">
          {formatDollars(total(done))}
          <span className="text-base font-medium text-slate-500">/month</span>
        </p>
      </Tile>
    </section>
  )
}
