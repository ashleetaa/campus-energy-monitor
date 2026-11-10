// All the energy math. Plain functions: give them a building and a time,
// they give back numbers. No React in here.

import type { Building } from './buildings'

export const PRICE_PER_KWH = 0.12 // dollars per kilowatt-hour

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

// What the meter shows right now: normal draw plus a small ±3% wobble,
// so the numbers move like a real meter.
export function currentKw(building: Building, time: Date): number {
  const wobble = 1 + (Math.random() * 0.06 - 0.03)
  return normalKwAt(building, time) * wobble
}

// Energy used since midnight (kWh). Adds up the power for every minute
// so far today: each minute uses kW × (1/60) of an hour.
// Based on the clock, so it's always correct even if the browser tab sleeps.
export function todayKwh(building: Building, now: Date): number {
  const midnight = new Date(now)
  midnight.setHours(0, 0, 0, 0)
  const minutesSoFar = Math.floor((now.getTime() - midnight.getTime()) / 60000)

  let total = 0
  for (let minute = 0; minute < minutesSoFar; minute++) {
    const time = new Date(midnight.getTime() + minute * 60000)
    total += normalKwAt(building, time) / 60
  }
  return total
}

export function costOf(kwh: number): number {
  return kwh * PRICE_PER_KWH
}
