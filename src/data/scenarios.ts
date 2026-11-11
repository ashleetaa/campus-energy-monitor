// The 3 demo scenarios. Each one is a different energy problem: which building,
// which hours, how much extra power, what caused it, and what to do about it.
// They are fixed (never random), so the demo always behaves the same way.

import type { Alert } from './alerts'
import type { ActiveSpike } from './simulate'

export type FixTemplate = {
  id: string
  title: string
  detail: string
  fixesProblem: boolean // true = this alone removes the extra use
  monthlySavings: (alert: Alert) => number // estimate, in dollars per month
}

export type Scenario = {
  id: string
  name: string // shown in the Demo controls dropdown
  buildingId: string
  startHour: number // when the extra use starts (22 = 10pm)
  lengthHours: number // how long it lasts
  extra: number // 1.4 = 40% more power than normal
  chartLabel: string // shown on the shaded part of the chart
  suggestion: 'fix' | 'ignore' // what a manager should probably do
  rootCause: (alert: Alert) => string
  resolvedText: string // shown in the green banner once the main fix is done
  fixes: FixTemplate[]
}

// What those hours cost per month on a normal day.
const normalPerMonth = (alert: Alert) => alert.normalCostPerDay * 30

export const SCENARIOS: Scenario[] = [
  {
    id: 'hvac',
    name: 'HVAC left on overnight',
    buildingId: 'engineering',
    startHour: 22,
    lengthHours: 8,
    extra: 1.4,
    chartLabel: 'HVAC ran overnight',
    suggestion: 'fix',
    rootCause: (alert) =>
      `The HVAC kept running from ${alert.fromLabel} to ${alert.toLabel} instead of switching to its ` +
      'overnight setting, so an empty building was heated and cooled all night.',
    resolvedText: 'Root cause fixed: the HVAC now switches to its overnight setting.',
    fixes: [
      {
        id: 'hvac-setback',
        title: 'Schedule HVAC setback 10pm–6am',
        detail:
          'Set the building automation system to "unoccupied" overnight, so heating and cooling ' +
          "can't be left running all night again.",
        fixesProblem: true,
        monthlySavings: (alert) => alert.extraCostPerMonth, // removes all of the extra cost
      },
      {
        id: 'night-setpoint',
        title: 'Lower the overnight heating setpoint to 60°F',
        detail: 'An empty building does not need to be kept at daytime temperature.',
        fixesProblem: false,
        monthlySavings: (alert) => normalPerMonth(alert) * 0.08, // ~8% of normal overnight cost
      },
      {
        id: 'after-hours-shutdown',
        title: 'Shut down lab equipment and lights after hours',
        detail: 'A checklist for the last person out, plus timers on lights and equipment.',
        fixesProblem: false,
        monthlySavings: (alert) => normalPerMonth(alert) * 0.05, // ~5% of normal overnight cost
      },
    ],
  },
  {
    id: 'lights',
    name: 'Lights left on after closing',
    buildingId: 'library',
    startHour: 0,
    lengthHours: 7,
    extra: 1.45,
    chartLabel: 'Lights on after closing',
    suggestion: 'fix',
    rootCause: (alert) =>
      `Lights and study-room computers stayed on from ${alert.fromLabel} to ${alert.toLabel}, after the ` +
      'library closed at midnight, so an empty building was lit and powered all night.',
    resolvedText: 'Root cause fixed: library lights now switch off automatically after closing.',
    fixes: [
      {
        id: 'lighting-schedule',
        title: 'Put library lights on an automatic schedule (off after midnight)',
        detail: 'Lighting controls switch lights off after closing; motion sensors turn them on for night staff.',
        fixesProblem: true,
        monthlySavings: (alert) => alert.extraCostPerMonth, // removes all of the extra cost
      },
      {
        id: 'computer-sleep',
        title: 'Set study-room computers to sleep after 30 minutes',
        detail: 'Idle computers use power all night for no one.',
        fixesProblem: false,
        monthlySavings: (alert) => normalPerMonth(alert) * 0.06, // ~6% of normal overnight cost
      },
      {
        id: 'led-upgrade',
        title: 'Switch the remaining older lights to LED',
        detail: 'LEDs use about half the power for the same light.',
        fixesProblem: false,
        monthlySavings: (alert) => normalPerMonth(alert) * 0.1, // ~10% of normal overnight cost
      },
    ],
  },
  {
    id: 'finals',
    name: 'Finals week (expected)',
    buildingId: 'dorm-a',
    startHour: 18,
    lengthHours: 6,
    extra: 1.4,
    chartLabel: 'Finals week evenings',
    suggestion: 'ignore',
    rootCause: (alert) =>
      `More students are in Dorm A from ${alert.fromLabel} to ${alert.toLabel} studying for finals, so ` +
      'lights, laptops and heating are used more. This is expected and ends when finals are over.',
    resolvedText: '', // nothing here "fixes" it, so this scenario is never resolved
    fixes: [
      {
        id: 'thermostat-cap',
        title: 'Cap room thermostats at 70°F during finals',
        detail: 'Keeps rooms comfortable while trimming the extra heating.',
        fixesProblem: false,
        monthlySavings: (alert) => alert.extraCostPerMonth * 0.2, // ~20% of the extra cost
      },
      {
        id: 'resident-reminder',
        title: 'Send residents an energy-saving reminder',
        detail: 'Lights off in empty rooms, chargers unplugged, windows closed.',
        fixesProblem: false,
        monthlySavings: (alert) => alert.extraCostPerMonth * 0.1, // ~10% of the extra cost
      },
    ],
  },
]

export const DEFAULT_SCENARIO_ID = 'hvac'

export function findScenario(id: string): Scenario {
  return SCENARIOS.find((scenario) => scenario.id === id) ?? SCENARIOS[0]
}

// The time window of the scenario's extra use: its most recent start time
// (e.g. the most recent 10pm) up to startHour + lengthHours.
// If that start is in the past day, it's either finished or still going on.
export function spikeFor(scenario: Scenario, now: Date): ActiveSpike {
  const start = new Date(now)
  start.setHours(scenario.startHour, 0, 0, 0)
  if (start > now) start.setDate(start.getDate() - 1) // hasn't started yet today: use yesterday's
  return {
    buildingId: scenario.buildingId,
    start: start.getTime(),
    end: start.getTime() + scenario.lengthHours * 60 * 60 * 1000,
    extra: scenario.extra,
  }
}
