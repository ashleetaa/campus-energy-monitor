// All the energy math. Plain functions: give them a building and a time,
// they give back numbers. No React in here.

import type { Building } from './buildings'

export const PRICE_PER_KWH = 0.12 // dollars per kilowatt-hour

// A spike: one building using extra power for a set time window.
// Which building, when and how much come from the chosen scenario (scenarios.ts).
export type ActiveSpike = {
  buildingId: string
  start: number // time the extra use starts (milliseconds)
  end: number // time it ends
  extra: number // 1.4 = 40% more than normal
}

// True if this building and time fall inside the spike. spike = null means no spike.
export function isSpiked(building: Building, time: Date, spike: ActiveSpike | null): boolean {
  if (spike === null || building.id !== spike.buildingId) return false
  const t = time.getTime()
  return t >= spike.start && t < spike.end
}

// Normal power draw (kW) at a given time, with no randomness.
// Blends between this hour's and next hour's value so the curve is smooth
// (e.g. at 2:30pm it's halfway between the 2pm and 3pm values).
export function normalKwAt(building: Building, time: Date): number {
  const hour = time.getHours()
  const fractionOfHour = time.getMinutes() / 60
  const thisHour = building.dailyPattern[hour]
  const nextHour = building.dailyPattern[(hour + 1) % 24]
  const pattern = thisHour + (nextHour - thisHour) * fractionOfHour
  return building.peakKw * pattern
}

// Actual power draw: normal, plus the extra if this time is part of the spike.
export function actualKwAt(building: Building, time: Date, spike: ActiveSpike | null): number {
  const extra = spike !== null && isSpiked(building, time, spike) ? spike.extra : 1
  return normalKwAt(building, time) * extra
}

// What the meter shows right now: actual draw plus a small ±3% wobble,
// so the numbers move like a real meter.
export function currentKw(building: Building, time: Date, spike: ActiveSpike | null): number {
  const wobble = 1 + (Math.random() * 0.06 - 0.03)
  return actualKwAt(building, time, spike) * wobble
}

// Energy used since midnight (kWh). Adds up the power for every minute
// so far today: each minute uses kW × (1/60) of an hour.
// Based on the clock, so it's always correct even if the browser tab sleeps.
export function todayKwh(building: Building, now: Date, spike: ActiveSpike | null): number {
  const midnight = new Date(now)
  midnight.setHours(0, 0, 0, 0)
  const minutesSoFar = Math.floor((now.getTime() - midnight.getTime()) / 60000)

  let total = 0
  for (let minute = 0; minute < minutesSoFar; minute++) {
    const time = new Date(midnight.getTime() + minute * 60000)
    total += actualKwAt(building, time, spike) / 60
  }
  return total
}

export function costOf(kwh: number): number {
  return kwh * PRICE_PER_KWH
}

const ONE_HOUR_MS = 60 * 60 * 1000

// A small ±3% variation for past hours that is always the same for the same
// building and hour. It's "random-looking" but fixed (from a sine wave), so
// the history chart looks identical every time the page loads.
// ±3% keeps normal hours well under the 30% alert line, and every spiked
// hour (40% extra) well over it.
function steadyWobble(building: Building, time: Date): number {
  const seed = time.getTime() / ONE_HOUR_MS + building.peakKw
  const x = Math.sin(seed) * 10000
  const fraction = x - Math.floor(x) // a number between 0 and 1
  return 1 + (fraction * 0.06 - 0.03)
}

// Recorded power (kW) for an hour in the past.
export function pastKwAt(building: Building, time: Date, spike: ActiveSpike | null): number {
  return actualKwAt(building, time, spike) * steadyWobble(building, time)
}

export type HourPoint = {
  label: string // e.g. "10pm"
  thisWeek: number // kW at that hour in the last 24 hours
  lastWeek: number // kW at the same hour 7 days earlier
  spiked: boolean // true if this hour is part of the simulated spike
}

// The last 24 hours, one point per hour (oldest first), each paired with
// the same hour one week earlier. Last week is always normal (no spike).
export function last24Hours(building: Building, now: Date, spike: ActiveSpike | null): HourPoint[] {
  const thisHour = new Date(now)
  thisHour.setMinutes(0, 0, 0)

  const points: HourPoint[] = []
  for (let hoursAgo = 23; hoursAgo >= 0; hoursAgo--) {
    const time = new Date(thisHour.getTime() - hoursAgo * ONE_HOUR_MS)
    // Same clock hour 7 days earlier (by calendar date, so daylight saving
    // changes don't shift it by an hour).
    const weekBefore = new Date(time)
    weekBefore.setDate(weekBefore.getDate() - 7)
    points.push({
      label: time.toLocaleTimeString('en-US', { hour: 'numeric' }).replace(' ', '').toLowerCase(),
      thisWeek: Math.round(pastKwAt(building, time, spike)),
      lastWeek: Math.round(pastKwAt(building, weekBefore, null)),
      spiked: isSpiked(building, time, spike),
    })
  }
  return points
}

// Total energy (kWh) for a list of hourly points: each point is ~1 hour at
// that power, so kWh = sum of kW × 1 hour.
export function totalKwh(points: HourPoint[], week: 'thisWeek' | 'lastWeek'): number {
  return points.reduce((sum, point) => sum + point[week], 0)
}
