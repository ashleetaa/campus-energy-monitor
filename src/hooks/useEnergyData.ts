// A React hook that "reads the meters" every 3 seconds.
// It keeps the current time in state; changing it makes React redraw the
// screen, and every number is recalculated from that time.
// It also remembers the demo state: is the spike on, and which
// recommendations have been marked done.

import { useEffect, useState } from 'react'
import { checkBuilding, findAlerts } from '../data/alerts'
import { BUILDINGS, type Building } from '../data/buildings'
import { MAIN_FIX_ID, recommendationsFor } from '../data/recommendations'
import { costOf, currentKw, SPIKE_BUILDING_ID, todayKwh } from '../data/simulate'

const UPDATE_EVERY_MS = 3000

// What the manager chose to do about the alert.
export type Decision = 'undecided' | 'fixing' | 'ignored'
const SPIKE_BUILDING = BUILDINGS.find((building) => building.id === SPIKE_BUILDING_ID)!

export type Reading = {
  building: Building
  kw: number // power right now
  kwh: number // energy used today
  cost: number // dollars spent today
}

export function useEnergyData() {
  const [now, setNow] = useState(() => new Date())
  const [spikeOn, setSpikeOn] = useState(false)
  const [doneIds, setDoneIds] = useState<string[]>([]) // recommendations marked done
  const [decision, setDecision] = useState<Decision>('undecided')

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), UPDATE_EVERY_MS)
    return () => clearInterval(timer) // stop the timer if the page closes
  }, [])

  // Once the main fix is done, the spike stops and the building is back to normal.
  const resolved = spikeOn && doneIds.includes(MAIN_FIX_ID)
  const spikeActive = spikeOn && !resolved

  const readings: Reading[] = BUILDINGS.map((building) => {
    const kwh = todayKwh(building, now, spikeActive)
    return { building, kw: currentKw(building, now, spikeActive), kwh, cost: costOf(kwh) }
  })

  // The recommendations stay on screen after the fix, so the other ones can
  // still be marked done. Their savings are worked out as if the spike were on.
  const spikeAlert = spikeOn ? checkBuilding(SPIKE_BUILDING, now, true) : null
  const recommendations = spikeAlert ? recommendationsFor(spikeAlert) : []

  return {
    now,
    readings,
    alerts: findAlerts(now, spikeActive),
    spikeOn,
    spikeActive,
    resolved,
    spikeAlert,
    recommendations,
    doneIds,
    markDone: (id: string) => setDoneIds((ids) => [...ids, id]),
    decision,
    decide: setDecision,
    simulateSpike: () => setSpikeOn(true),
    reset: () => {
      setSpikeOn(false)
      setDoneIds([])
      setDecision('undecided')
    },
  }
}
