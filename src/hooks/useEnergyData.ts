// A React hook that "reads the meters" every 3 seconds.
// It keeps the current time in state; changing it makes React redraw the
// screen, and every number is recalculated from that time.
// It also remembers the demo state: which scenario is picked, is the spike on,
// what the manager decided, and which recommendations are done.

import { useEffect, useState } from 'react'
import { checkBuilding, findAlerts } from '../data/alerts'
import { BUILDINGS, type Building } from '../data/buildings'
import { recommendationsFor } from '../data/recommendations'
import { DEFAULT_SCENARIO_ID, findScenario, spikeFor } from '../data/scenarios'
import { costOf, currentKw, todayKwh } from '../data/simulate'

const UPDATE_EVERY_MS = 3000

// What the manager chose to do about the alert.
export type Decision = 'undecided' | 'fixing' | 'ignored'

export type Reading = {
  building: Building
  kw: number // power right now
  kwh: number // energy used today
  cost: number // dollars spent today
}

export function useEnergyData() {
  const [now, setNow] = useState(() => new Date())
  const [scenarioId, setScenarioId] = useState(DEFAULT_SCENARIO_ID)
  const [spikeOn, setSpikeOn] = useState(false)
  const [doneIds, setDoneIds] = useState<string[]>([]) // recommendations marked done
  const [decision, setDecision] = useState<Decision>('undecided')

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), UPDATE_EVERY_MS)
    return () => clearInterval(timer) // stop the timer if the page closes
  }, [])

  const scenario = findScenario(scenarioId)
  const building = BUILDINGS.find((b) => b.id === scenario.buildingId)!
  const scenarioSpike = spikeFor(scenario, now)

  // The alert and fixes as if the spike were on. They stay on screen after the
  // main fix, so the other fixes can still be marked done.
  const spikeAlert = spikeOn ? checkBuilding(building, now, scenarioSpike) : null
  const recommendations = spikeAlert ? recommendationsFor(scenario, spikeAlert) : []

  // Once a fix that removes the root cause is done, the building is back to normal.
  const resolved = recommendations.some((rec) => rec.fixesProblem && doneIds.includes(rec.id))
  const spike = spikeOn && !resolved ? scenarioSpike : null

  const readings: Reading[] = BUILDINGS.map((b) => {
    const kwh = todayKwh(b, now, spike)
    return { building: b, kw: currentKw(b, now, spike), kwh, cost: costOf(kwh) }
  })

  return {
    now,
    readings,
    alerts: findAlerts(now, spike),
    scenario,
    selectScenario: setScenarioId,
    spikeOn,
    spike,
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
