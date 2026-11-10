// Spike detection: compares each building's last 24 hours with the same
// hours last week and works out what the extra energy costs.

import { BUILDINGS, type Building } from './buildings'
import { costOf, last24Hours, type HourPoint } from './simulate'

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
export function checkBuilding(building: Building, now: Date, spikeOn: boolean): Alert | null {
  const points = last24Hours(building, now, spikeOn)
  const isUnusual = (point: HourPoint) => point.thisWeek >= point.lastWeek * ALERT_THRESHOLD

  const unusual = points.filter(isUnusual)
  if (unusual.length === 0) return null

  // Each point is about 1 hour, so extra kW in an hour = extra kWh.
  const thisWeekKwh = unusual.reduce((sum, point) => sum + point.thisWeek, 0)
  const lastWeekKwh = unusual.reduce((sum, point) => sum + point.lastWeek, 0)
  const extraCostPerDay = costOf(thisWeekKwh - lastWeekKwh)

  // The unusual period ends at the start of the first normal hour after it.
  const lastUnusual = points.findLastIndex(isUnusual)
  const endPoint = points[Math.min(lastUnusual + 1, points.length - 1)]

  return {
    building,
    fromLabel: unusual[0].label,
    toLabel: endPoint.label,
    percentAbove: Math.round((thisWeekKwh / lastWeekKwh - 1) * 100),
    extraCostPerDay,
    // If it keeps happening every night:
    extraCostPerMonth: extraCostPerDay * 30,
    extraCostPerYear: extraCostPerDay * 365,
    normalCostPerDay: costOf(lastWeekKwh),
  }
}

// Check every building and return the ones with an alert.
export function findAlerts(now: Date, spikeOn: boolean): Alert[] {
  return BUILDINGS.map((building) => checkBuilding(building, now, spikeOn)).filter(
    (alert): alert is Alert => alert !== null,
  )
}
