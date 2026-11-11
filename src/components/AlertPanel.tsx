// The "Active alert" box beside the building cards on the dashboard.
// The status chip in its corner says what state things are in; the banner
// inside (red, gray or green) is passed in as children. With nothing to show,
// it says all buildings are normal.

import { AlertTriangle, CheckCircle2, EyeOff, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

export type PanelStatus = 'attention' | 'ignored' | 'resolved' | 'clear'

type Props = {
  status: PanelStatus
  children?: ReactNode
}

const CHIPS = {
  attention: { label: 'Needs attention', icon: AlertTriangle, look: 'bg-red-100 text-red-700' },
  ignored: { label: 'Ignored', icon: EyeOff, look: 'bg-slate-200 text-slate-700' },
  resolved: { label: 'Resolved', icon: CheckCircle2, look: 'bg-green-100 text-green-700' },
  clear: { label: 'All clear', icon: CheckCircle2, look: 'bg-green-100 text-green-700' },
}

export default function AlertPanel({ status, children }: Props) {
  const chip = CHIPS[status]
  const ChipIcon = chip.icon

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900">Active alert</h2>
        <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${chip.look}`}>
          <ChipIcon className="size-4" />
          {chip.label}
        </span>
      </div>

      {status === 'clear' ? (
        <div className="flex flex-col items-center rounded-xl bg-green-50/60 px-4 py-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <ShieldCheck className="size-7" />
          </div>
          <p className="mt-3 font-semibold text-slate-900">All buildings are running normally</p>
          <p className="mt-1 text-sm text-slate-500">
            We compare every building with the same hours last week and flag anything 30% or more above it.
          </p>
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </section>
  )
}
