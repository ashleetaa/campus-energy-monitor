// A React hook that "reads the meters" every 3 seconds.
// It keeps the current time in state; changing it makes React redraw the
// screen, and every number is recalculated from that time.

import { useEffect, useState } from 'react'
import { BUILDINGS, type Building } from '../data/buildings'
import { costOf, currentKw, todayKwh } from '../data/simulate'

const UPDATE_EVERY_MS = 3000

export type Reading = {
  building: Building
  kw: number // power right now
  kwh: number // energy used today
  cost: number // dollars spent today
}

export function useEnergyData() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), UPDATE_EVERY_MS)
    return () => clearInterval(timer) // stop the timer if the page closes
  }, [])

  const readings: Reading[] = BUILDINGS.map((building) => {
    const kwh = todayKwh(building, now)
    return { building, kw: currentKw(building, now), kwh, cost: costOf(kwh) }
  })

  return { now, readings }
}
