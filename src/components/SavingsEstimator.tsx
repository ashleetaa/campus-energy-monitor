// The "Savings estimator" tab: sliders that scale the demo's savings to any
// campus, plus how fast the setup cost pays for itself.

import { useState } from 'react'
import { campusDefaults, demoFixPercents, estimate, type EstimatorInputs } from '../data/estimator'
import { formatDollars } from '../data/format'

type SliderProps = {
  label: string
  value: number
  shown: string // the value as text, e.g. "$16,000"
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function Slider({ label, value, shown, min, max, step, onChange }: SliderProps) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-lg font-semibold text-slate-900 tabular-nums">{shown}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-blue-700"
      />
    </label>
  )
}

function paybackText(months: number): string {
  if (months === 0) return 'right away'
  if (!Number.isFinite(months)) return 'never (no savings)'
  if (months < 24) return `about ${Math.max(1, Math.round(months))} months`
  return `about ${(months / 12).toFixed(1)} years`
}

export default function SavingsEstimator({ now }: { now: Date }) {
  const defaults = campusDefaults()
  const [inputs, setInputs] = useState<EstimatorInputs>(defaults)
  const set = (key: keyof EstimatorInputs) => (value: number) => setInputs({ ...inputs, [key]: value })

  const result = estimate(inputs)
  const fixPercents = demoFixPercents(now)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-semibold text-slate-900">Your campus</h2>
          <button
            onClick={() => setInputs(defaults)}
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            Reset to this campus
          </button>
        </div>

        <div className="space-y-6">
          <Slider
            label="Number of buildings"
            value={inputs.buildings}
            shown={String(inputs.buildings)}
            min={1}
            max={100}
            step={1}
            onChange={set('buildings')}
          />
          <Slider
            label="Average monthly energy cost per building"
            value={inputs.monthlyCostPerBuilding}
            shown={formatDollars(inputs.monthlyCostPerBuilding)}
            min={1000}
            max={100000}
            step={500}
            onChange={set('monthlyCostPerBuilding')}
          />
          <div>
            <Slider
              label="Estimated reduction"
              value={inputs.reductionPercent}
              shown={`${inputs.reductionPercent}%`}
              min={1}
              max={30}
              step={1}
              onChange={set('reductionPercent')}
            />
            {fixPercents.length > 0 && (
              <p className="mt-2 text-sm text-slate-500">
                In this demo, fixing one problem cut a building's monthly energy cost by{' '}
                {fixPercents.map((fix) => `${fix.percent}% (${fix.building})`).join(' and ')}.
              </p>
            )}
          </div>
          <Slider
            label="Cost to set up (sensors, controls, software)"
            value={inputs.setupCost}
            shown={formatDollars(inputs.setupCost)}
            min={0}
            max={500000}
            step={5000}
            onChange={set('setupCost')}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Estimated savings</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-slate-600">Per month</p>
            <p className="text-3xl font-bold text-green-700 tabular-nums">{formatDollars(result.perMonth)}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-slate-600">Per year</p>
            <p className="text-3xl font-bold text-green-700 tabular-nums">{formatDollars(result.perYear)}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-slate-600">Pays for itself in</p>
          <p className="text-3xl font-bold text-blue-800">{paybackText(result.paybackMonths)}</p>
        </div>

        <p className="mt-4 text-sm text-slate-600 tabular-nums">
          {inputs.buildings} buildings × {formatDollars(inputs.monthlyCostPerBuilding)}/month ×{' '}
          {inputs.reductionPercent}% = {formatDollars(result.perMonth)}/month
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Illustrative estimate. Assumes the same % reduction in every building.
        </p>
      </section>
    </div>
  )
}
