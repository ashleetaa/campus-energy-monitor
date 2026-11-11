// The main screen. Two tabs: "Live monitor" (the dashboard, or one building's
// detail when a building is selected) and "Savings estimator".

import { useState } from 'react'
import AlertBanner from './components/AlertBanner'
import BuildingCard from './components/BuildingCard'
import BuildingDetail from './components/BuildingDetail'
import DemoControls from './components/DemoControls'
import IgnoredBanner from './components/IgnoredBanner'
import RecommendationList from './components/RecommendationList'
import ResolvedBanner from './components/ResolvedBanner'
import SavingsEstimator from './components/SavingsEstimator'
import SavingsSummary from './components/SavingsSummary'
import type { Alert } from './data/alerts'
import { useEnergyData } from './hooks/useEnergyData'

export default function App() {
  const energy = useEnergyData()
  const { now, readings, alerts, recommendations, spikeAlert, scenario } = energy

  const [tab, setTab] = useState<'monitor' | 'estimator'>('monitor')
  // null = show the dashboard; otherwise the id of the building to show
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = readings.find((reading) => reading.building.id === selectedId)
  const alertFor = (buildingId: string) => alerts.find((alert) => alert.building.id === buildingId)

  // The manager can choose to ignore the alert (e.g. finals week, a planned event).
  const isIgnored = (buildingId: string) =>
    energy.decision === 'ignored' && buildingId === spikeAlert?.building.id

  // Red banner normally; gray banner once ignored. The dashboard version has a
  // button that opens the building.
  const banner = (alert: Alert, onDashboard: boolean) =>
    isIgnored(alert.building.id) ? (
      <IgnoredBanner key={alert.building.id} alert={alert} onReview={() => energy.decide('undecided')} />
    ) : (
      <AlertBanner
        key={alert.building.id}
        alert={alert}
        onViewChart={onDashboard ? () => setSelectedId(alert.building.id) : undefined}
      />
    )

  // Shown once the main fix is marked done.
  const mainFix = recommendations.find((rec) => rec.fixesProblem)
  const resolvedBanner = (showButton: boolean) =>
    energy.resolved && spikeAlert && mainFix ? (
      <ResolvedBanner
        buildingName={spikeAlert.building.name}
        text={scenario.resolvedText}
        monthlySavings={mainFix.monthlySavings}
        yearlySavings={Math.round(spikeAlert.extraCostPerYear / 100) * 100}
        onViewDetails={showButton ? () => setSelectedId(spikeAlert.building.id) : undefined}
      />
    ) : null

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campus Energy Monitor</h1>
          <p className="mt-1 text-slate-600">
            Live power use across campus · Updated {now.toLocaleTimeString('en-US')}
          </p>
        </div>
        {tab === 'monitor' && (
          <DemoControls
            scenarioId={scenario.id}
            onSelectScenario={energy.selectScenario}
            spikeOn={energy.spikeOn}
            onSimulateSpike={energy.simulateSpike}
            onReset={energy.reset}
          />
        )}
      </header>

      <nav className="mb-6 flex gap-2 border-b border-slate-200">
        {(['monitor', 'estimator'] as const).map((name) => (
          <button
            key={name}
            onClick={() => setTab(name)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold ${
              tab === name ? 'border-blue-700 text-blue-800' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {name === 'monitor' ? 'Live monitor' : 'Savings estimator'}
          </button>
        ))}
      </nav>

      {tab === 'estimator' ? (
        <SavingsEstimator now={now} />
      ) : selected ? (
        <BuildingDetail
          building={selected.building}
          now={now}
          spike={energy.spike}
          spikeLabel={scenario.chartLabel}
          onBack={() => setSelectedId(null)}
        >
          {alertFor(selected.building.id) && banner(alertFor(selected.building.id)!, false)}
          {selected.building.id === spikeAlert?.building.id && !isIgnored(selected.building.id) && (
            <>
              {resolvedBanner(false)}
              <RecommendationList
                rootCause={scenario.rootCause(spikeAlert)}
                suggestion={scenario.suggestion}
                recommendations={recommendations}
                doneIds={energy.doneIds}
                onMarkDone={energy.markDone}
                decision={energy.decision}
                onDecide={energy.decide}
              />
            </>
          )}
        </BuildingDetail>
      ) : (
        <>
          {/* Ignored fixes don't count as savings available. */}
          <SavingsSummary
            recommendations={energy.decision === 'ignored' ? [] : recommendations}
            doneIds={energy.doneIds}
          />

          {alerts.map((alert) => banner(alert, true))}
          {resolvedBanner(true)}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {readings.map((reading) => (
              <BuildingCard
                key={reading.building.id}
                reading={reading}
                needsAttention={alertFor(reading.building.id) !== undefined && !isIgnored(reading.building.id)}
                ignored={alertFor(reading.building.id) !== undefined && isIgnored(reading.building.id)}
                onClick={() => setSelectedId(reading.building.id)}
              />
            ))}
          </div>
        </>
      )}
    </main>
  )
}
