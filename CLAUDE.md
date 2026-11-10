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
1. Dashboard: 4 buildings (Engineering Hall, Library, Rec Center, Dorm A). Each card
   shows current kW, today's kWh and today's cost. Readings update every 3 seconds,
   higher by day and lower at night.
2. Building detail: click a building to see a 24-hour line chart vs. the same hours
   last week.
3. "Simulate spike" button: Engineering Hall's HVAC was left running last night,
   10pm–6am, about 40% above normal for those hours. It shows up in the overnight
   part of the 24-hour chart. A small "Reset" button undoes the spike.
4. Spike alert: appears when "Simulate spike" is clicked. It fires when usage is 30%+
   above the same hours last week, and shows a red alert with the extra cost per day
   and per month.
5. 2–3 recommendations per alert with estimated monthly savings
   (e.g. "Schedule HVAC setback 10pm–6am: saves ~$X/month").
6. A "Monthly savings" summary at the top of the dashboard = savings available from
   the current recommendations ($0 when there are no alerts).

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
- Step 0 done: Vite 8 + React 19 + TS + Tailwind v4 (`@tailwindcss/vite`, no config
  file) + Recharts 3. Removed the template's oxlint and demo files. Node 26.
- Key files: `vite.config.ts`, `src/main.tsx`, `src/App.tsx` (placeholder), `src/index.css`.
- Decided: spike is always Engineering Hall, overnight 10pm–6am; Reset button added;
  savings = sum of open recommendations; no 18% claim in the pitch.
- Step 1 done: dashboard with 4 cards (kW now, kWh today, cost today), updates every 3s.
  `data/buildings.ts` (peak kW + 24-hour pattern), `data/simulate.ts` (math),
  `data/format.ts`, `hooks/useEnergyData.ts` (3s timer), `components/BuildingCard.tsx`.
- Step 2 done: click a card → `components/BuildingDetail.tsx`, a rolling last-24-hours
  chart vs. same hours last week, plus cost of each. History uses a fixed ±4% wobble.
