# Campus Energy Monitor

A demo app for an IBM Technical Sales interview on Fri Nov 13. It has to work
reliably in a 5–10 minute live demo, so reliability matters more than features.
I'm a computer engineering student and I need to explain how it works.

## Stack
React + Vite + TypeScript + Tailwind + Recharts. No backend, no login, no API keys.
All data is simulated in the browser.

## Rules
- Build only what's in the plan below. Ask before adding anything else.
- One step at a time. After each step, stop and tell me how to check it.
- Before saying a step is done, run `npm run build` and fix any errors.
- Keep the code simple enough that I can explain every file in an interview.
- After each step, explain what you built in 2–3 plain sentences.
- Never add packages beyond the stack without asking.
- Use believable numbers: kW and kWh in realistic ranges, $0.12/kWh.

## Plan
0. Set up the Vite + React + TypeScript + Tailwind project in this folder.
1. Dashboard: 4 buildings (Zachary Engineering Education Complex, Sterling C. Evans
   Library, Student Recreation Center, Hullabaloo Hall). Each card
   shows current kW, today's kWh and today's cost. Readings update every 3 seconds,
   higher by day and lower at night.
2. Building detail: click a building to see a 24-hour line chart vs. the same hours
   last week.
3. "Simulate spike": the Zachary Engineering Education Complex's HVAC was left running last night,
   10pm–6am, about 40% above normal for those hours. On the 24-hour chart that
   window is shaded light red and labeled "HVAC ran overnight". "Simulate spike"
   and "Reset" sit in a small "Demo controls" box at the top-right of the header, so the
   main screen looks like a real product.
4. Spike alert: appears when "Simulate spike" is clicked. It fires when usage is 30%+
   above the same hours last week. A red banner at the top of the dashboard shows
   the extra cost per day, per month and per year, and links to the building's
   chart. The affected card gets a red border and a "Needs attention" label.
5. 2–3 recommendations per alert with estimated monthly savings
   (e.g. "Schedule HVAC setback 10pm–6am: saves ~$X/month"). Each has a
   "Mark as done" button; when done, the building goes back to normal.
6. A "Monthly savings" summary at the top of the dashboard: savings available
   (from open recommendations) and savings achieved (from ones marked done).

7. Decide what to do: the alert stays red until the manager looks into it. On the
   detail screen they see the root cause and choose "Make changes" (shows the fixes)
   or "Ignore, this was expected" (alert turns gray, still shows what it costs, and
   can be reviewed again). Ignored fixes don't count toward savings available.
8. Three fixed scenarios (never random), picked from a dropdown in Demo controls.
   Each has its own building, hours, pattern, root cause, suggested choice and fixes:
   - HVAC left on overnight (default): Zachary Engineering Education Complex, +40%,
     10pm–6am → Make changes.
   - Lights left on all night: Hullabaloo Hall, +45%, midnight–7am → Make changes.
   - Finals week: Sterling C. Evans Library, +40%, 10pm–4am → suggested Ignore
     (expected); only optional ways to reduce it, nothing that "fixes" it.
   Best demo time for all three: 7am–10pm.
9. "Savings estimator" tab (next to "Live monitor"): sliders for number of buildings,
   average monthly energy cost per building, estimated reduction % and cost to set
   up. Starts from this campus's own numbers (4 buildings, their simulated average
   monthly cost). Shows savings per month and per year and "pays for itself in X
   months". A note grounds the % in what the demo's fixes saved. Labeled as an
   illustrative estimate. Formula: buildings × monthly cost × reduction %.

Demo flow: normal dashboard → Simulate spike → red banner + red card → Look into it
→ root cause → Make changes → Mark as done → savings achieved.

## Demo story
A campus facilities manager wants to know where the energy money goes. The app shows
usage by building, catches an overnight spike, says what it costs in dollars, and
recommends a fix. The pitch uses the dollar amount the app calculates.

## Who this demo is for
- IBM Technical Sales: people who learn a client's business problem, show how
  technology solves it, and explain the value in business terms.
- The interviewers are IBM sales managers and technical sellers. They score how
  clearly I show value, not how complex the code is.
- So every screen should answer "what's the problem, what does it cost, how do
  we fix it." Show money and outcomes first, technical detail only on click.
- Labels in plain English (a facilities manager reads them, not an engineer).
- IBM sells real tools in this space (Maximo for facilities, Envizi for energy
  and sustainability data). I may mention them in the pitch, but the app stays
  my own simple version.

## Progress
(Claude: after each step, update this list: what's done, what files matter,
anything I decided. Keep it under 10 lines.)
- Steps 0–9 done + reliability checks. Vite 8, React 19, TS, Tailwind v4, Recharts 3.
- `src/data/`: buildings, simulate (kW/kWh/cost, ±3% fixed history wobble, `ActiveSpike`),
  scenarios (3 fixed scenarios: building, hours, extra %, root cause, suggestion, fixes),
  alerts (hours ≥30% over last week, $/day ×30 ×365), recommendations, format,
  estimator (Step 9 math; defaults 4 bldgs, $16,000/mo, 8%, $50k setup → ~10-month payback).
- Hook `useEnergyData`: 3s timer + demo state (scenario, spikeOn, decision, doneIds).
- `src/components/`: BuildingCard, BuildingDetail (chart), AlertBanner, IgnoredBanner,
  ResolvedBanner, RecommendationList, SavingsSummary, DemoControls, SavingsEstimator (tab).
- Decided: never random. A fix with fixesProblem ends the spike → green. Finals has none
  (suggested Ignore). Best demo time 7am–10pm (all 3 show full numbers). No 18% claim.
