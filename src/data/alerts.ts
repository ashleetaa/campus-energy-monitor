// Spike detection: compares each building's last 24 hours with the same
// hours last week and works out what the extra energy costs.

import { BUILDINGS, type Building } from './buildings'
import { costOf, last24Hours, type ActiveSpike, type HourPoint } from './simulate'

const ALERT_THRESHOLD = 1.3 // alert when usage is 30%+ above last week

export type Alert = {
  building: Building
  fromLabel: string // when the unusual use started, e.g. "10pm"
  toLabel: string // when it ended, e.g. "6am"
  percentAbove: number // e.g. 40 = 40% more than last week
  extraCostPerDay: number // dollars
  extraCostPerMonth: number
  extraCostPerYear: number
  normalCostPerDay: number // what those same hours cost on a normal day
}

// Look at one building. Returns an Alert, or null if everything is normal.
export function checkBuilding(building: Building, now: Date, spike: ActiveSpike | null): Alert | null {
  const points = last24Hours(building, now, spike)
  const isUnusual = (point: HourPoint) => point.thisWeek >= point.lastWeek * ALERT_THRESHOLD

  const unusual = points.filter(isUnusual)
  if (unusual.length === 0) return null

  // Each point is about 1 hour, so extra kW in an hour = extra kWh.
  const thisWeekKwh = unusual.reduce((sum, point) => sum + point.thisWeek, 0)
  const lastWeekKwh = unusual.reduce((sum, point) => sum + point.lastWeek, 0)
  const extraCostPerDay = costOf(thisWeekKwh - lastWeekKwh)

  // The unusual period ends at the start of the first normal hour after it.
  // If the latest hour is still unusual, it's still going on: "to now".
  const lastUnusual = points.findLastIndex(isUnusual)
  const stillGoing = lastUnusual === points.length - 1
  const toLabel = stillGoing ? 'now' : points[lastUnusual + 1].label

  return {
    building,
    fromLabel: unusual[0].label,
    toLabel,
    percentAbove: Math.round((thisWeekKwh / lastWeekKwh - 1) * 100),
    extraCostPerDay,
    // If it keeps happening every day:
    extraCostPerMonth: extraCostPerDay * 30,
    extraCostPerYear: extraCostPerDay * 365,
    normalCostPerDay: costOf(lastWeekKwh),
  }
}

// Check every building and return the ones with an alert.
export function findAlerts(now: Date, spike: ActiveSpike | null): Alert[] {
  return BUILDINGS.map((building) => checkBuilding(building, now, spike)).filter(
    (alert): alert is Alert => alert !== null,
  )
}
