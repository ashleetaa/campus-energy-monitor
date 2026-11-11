// Math for the "Savings estimator" tab: scale the demo's savings up to any campus.

import { checkBuilding } from './alerts'
import { BUILDINGS, type Building } from './buildings'
import { recommendationsFor } from './recommendations'
import { SCENARIOS, spikeFor } from './scenarios'
import { costOf } from './simulate'

// A building's normal energy cost for a month (30 days).
// Each number in dailyPattern × peakKw = kWh used in that hour, so the sum is
// the kWh for a whole normal day.
export function normalMonthlyCost(building: Building): number {
  const dailyKwh = building.peakKw * building.dailyPattern.reduce((sum, value) => sum + value, 0)
  return costOf(dailyKwh) * 30
}

// Starting values: this campus, so the estimator connects to what the demo showed.
export function campusDefaults() {
  const total = BUILDINGS.reduce((sum, building) => sum + normalMonthlyCost(building), 0)
  return {
    buildings: BUILDINGS.length,
    monthlyCostPerBuilding: Math.round(total / BUILDINGS.length / 500) * 500, // nearest $500
    reductionPercent: 8,
    setupCost: 50000,
  }
}

export type EstimatorInputs = ReturnType<typeof campusDefaults>

// The core formula: buildings × monthly cost × reduction %.
export function estimate(inputs: EstimatorInputs) {
  const perMonth = inputs.buildings * inputs.monthlyCostPerBuilding * (inputs.reductionPercent / 100)
  return {
    perMonth,
    perYear: perMonth * 12,
    paybackMonths: perMonth > 0 ? inputs.setupCost / perMonth : Infinity,
  }
}

// For each demo scenario that has a real fix: what % of that building's monthly
// cost the fix saves. Used to back up the reduction % with the demo's own numbers.
export function demoFixPercents(now: Date): { building: string; percent: number }[] {
  const results: { building: string; percent: number }[] = []
  for (const scenario of SCENARIOS) {
    const building = BUILDINGS.find((b) => b.id === scenario.buildingId)!
    const alert = checkBuilding(building, now, spikeFor(scenario, now))
    const mainFix = alert ? recommendationsFor(scenario, alert).find((rec) => rec.fixesProblem) : undefined
    if (mainFix) {
      results.push({
        building: building.name,
        percent: Math.round((mainFix.monthlySavings / normalMonthlyCost(building)) * 100),
      })
    }
  }
  return results
}
