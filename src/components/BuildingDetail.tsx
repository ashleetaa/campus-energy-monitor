// The detail screen for one building: a 24-hour line chart of power use,
// compared with the same hours last week.

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Building } from '../data/buildings'
import { formatDollars, formatKw } from '../data/format'
import { costOf, last24Hours, totalKwh } from '../data/simulate'

type Props = {
  building: Building
  now: Date
  onBack: () => void
}

const THIS_WEEK_COLOR = '#2563eb' // blue
const LAST_WEEK_COLOR = '#94a3b8' // gray: the "normal" baseline

export default function BuildingDetail({ building, now, onBack }: Props) {
  const points = last24Hours(building, now)
  const costThisWeek = costOf(totalKwh(points, 'thisWeek'))
  const costLastWeek = costOf(totalKwh(points, 'lastWeek'))

  return (
    <div>
      <button onClick={onBack} className="mb-6 text-sm font-medium text-blue-700 hover:underline">
        ← All buildings
      </button>

      <h2 className="text-2xl font-bold text-slate-900">{building.name}</h2>
      <p className="text-slate-500">{building.description}</p>

      <div className="mt-6 grid max-w-md grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-500">Cost, last 24 hours</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{formatDollars(costThisWeek)}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Same hours last week</p>
          <p className="text-2xl font-bold text-slate-500 tabular-nums">{formatDollars(costLastWeek)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-slate-900">Power use, last 24 hours</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} interval={2} />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(kw: number) => `${kw} kW`}
                width={64}
              />
              <Tooltip formatter={(kw) => formatKw(Number(kw))} />
              <Legend />
              <Line
                name="Last 24 hours"
                dataKey="thisWeek"
                stroke={THIS_WEEK_COLOR}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                name="Same hours last week"
                dataKey="lastWeek"
                stroke={LAST_WEEK_COLOR}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
