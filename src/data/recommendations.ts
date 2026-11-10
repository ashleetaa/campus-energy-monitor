// Fixes to suggest for an overnight spike, each with its estimated savings.

import type { Alert } from './alerts'

// The main fix. Marking it done stops the spike, so the building is back to normal.
export const MAIN_FIX_ID = 'hvac-setback'

export type Recommendation = {
  id: string
  title: string
  detail: string // why it helps, in plain English
  monthlySavings: number // dollars per month
  fixesProblem: boolean // true for the main fix
}

// Round to the nearest $10, because these are estimates ("saves ~$1,780/month").
function roughly(dollars: number): number {
  return Math.round(dollars / 10) * 10
}

export function recommendationsFor(alert: Alert): Recommendation[] {
  // What the overnight hours cost per month on a normal night.
  const normalOvernightPerMonth = alert.normalCostPerDay * 30

  return [
    {
      id: MAIN_FIX_ID,
      title: `Schedule HVAC setback ${alert.fromLabel}–${alert.toLabel}`,
      detail:
        'Set the building automation system to "unoccupied" overnight, so heating and cooling ' +
        "can't be left running all night again.",
      monthlySavings: roughly(alert.extraCostPerMonth), // removes all of the extra cost
      fixesProblem: true,
    },
    {
      id: 'night-setpoint',
      title: 'Lower the overnight heating setpoint to 60°F',
      detail: 'An empty building does not need to be kept at daytime temperature.',
      monthlySavings: roughly(normalOvernightPerMonth * 0.08), // ~8% of normal overnight cost
      fixesProblem: false,
    },
    {
      id: 'after-hours-shutdown',
      title: 'Shut down lab equipment and lights after hours',
      detail: 'A checklist for the last person out, plus timers on lights and equipment.',
      monthlySavings: roughly(normalOvernightPerMonth * 0.05), // ~5% of normal overnight cost
      fixesProblem: false,
    },
  ]
}
