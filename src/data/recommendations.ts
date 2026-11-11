// Turns a scenario's fixes into recommendations with dollar savings for this alert.

import type { Alert } from './alerts'
import type { Scenario } from './scenarios'

export type Recommendation = {
  id: string
  title: string
  detail: string // why it helps, in plain English
  monthlySavings: number // dollars per month
  fixesProblem: boolean // true for the main fix: it removes the root cause
}

// Round to the nearest $10, because these are estimates ("saves ~$1,780/month").
function roughly(dollars: number): number {
  return Math.round(dollars / 10) * 10
}

export function recommendationsFor(scenario: Scenario, alert: Alert): Recommendation[] {
  return scenario.fixes.map((fix) => ({
    id: fix.id,
    title: fix.title,
    detail: fix.detail,
    monthlySavings: roughly(fix.monthlySavings(alert)),
    fixesProblem: fix.fixesProblem,
  }))
}
