# Trader Risk Dashboard — Tradescape Assignment

A dashboard that answers one question for a trader as fast as possible:
**"Am I currently in danger of violating my account rules?"**

Live: _add your Vercel URL here after deploying_
Repo: _add your GitHub URL here_

---

## How to run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm run start
```

No environment variables, database, or auth are required — the app runs entirely on the mock data in `src/lib/data.ts`.

---

## What I built

A single-page dashboard, built with **Next.js (App Router) + TypeScript + Tailwind CSS**, structured around three layers:

1. **Hero risk banner** — the one thing a trader should see in the first second: `Safe` / `Approaching Limit` / `At Risk`, in plain language, not just a number.
2. **Two risk gauges** — Drawdown and Daily Loss, each shown as a "runway" bar: how much of the limit is used, and — more importantly — how much room is left before a hard stop.
3. **Supporting detail** — account overview, trading performance stats, an equity curve, and the trade log, for a trader who wants to understand *why* the top-line status is what it is.

### Data flow (nothing is hardcoded)

All numbers come from two files: `src/lib/data.ts` (the raw account rules + trade list — the only inputs) and `src/lib/calculations.ts` (pure functions that derive everything else: balance, total P&L, win rate, largest win/loss, drawdown, remaining limits, and the overall risk level). The UI components never do math themselves — they only format and display values that were computed upstream. If you change a trade's P&L in `data.ts`, every stat, gauge, and the risk status all update automatically.

**One assumption worth flagging:** the assignment gives trades without timestamps, so the daily-loss calculation treats all five trades as happening within a single session/day — the simplest assumption that makes "daily loss limit" mean something concrete. This is called out directly in a code comment in `data.ts`.

**Drawdown methodology:** I calculated drawdown from the account's *running peak balance*, not from the starting balance. With trailing-style risk rules (the kind most evaluation accounts actually use), that's the only definition that stays meaningful once an account has ever been in profit — measuring from the starting balance alone would show $0 drawdown here even though the account did pull back twice along the way. The equity curve makes this visible directly.

### Component structure

- `lib/types.ts`, `lib/data.ts`, `lib/calculations.ts` — types, inputs, and all derived math (fully unit-testable, no React involved)
- `components/RiskBanner.tsx` — the hero status
- `components/RiskGauge.tsx` — the reusable gauge, used twice (drawdown, daily loss)
- `components/AccountOverview.tsx`, `PerformanceStats.tsx`, `TradeLog.tsx`, `EquityCurve.tsx` — the supporting detail cards
- `components/ui/` — `Card`, `StatCard`, `Badge` — small reusable primitives shared across every section

---

## My additional feature: the Equity Curve

I added an **equity curve chart** tracking balance after every trade, with the running peak plotted alongside it.

**Why:** the assignment's own numbers make a good case for this. The trader ends the session up $3,250 — a healthy top-line number. But looking only at total P&L hides that the account pulled back twice along the way (after the ETH short and again after the SOL long). A trader who only checks "am I profitable overall?" has no way to see that pattern. The equity curve turns the abstract drawdown number in the risk gauge into something visual and immediately intuitive — it shows *when* and *how much* the account gave back, not just the final tally. It's also the piece that makes the "drawdown from peak, not from start" methodology self-evident instead of something the trader has to take on faith.

---

## Product questions

**1. What is drawdown in trading?**
Drawdown is the drop from an account's highest recorded balance (its peak) down to its current balance. It's a measure of how much value has been given back after a winning streak, not just whether the account is up or down overall — an account can be profitable in total and still be in a significant drawdown if it's well off its peak.

**2. Why would a trader care about remaining drawdown rather than just current P&L?**
P&L tells you how you're doing; remaining drawdown tells you how much room you have left to be wrong. Two traders can both be at +$3,250, but one might have $9,500 of drawdown room left and the other only $500 before their account is disqualified or shut down. Remaining drawdown is the number that should actually drive the next trade's position size — it's a forward-looking risk budget, while P&L is a backward-looking scoreboard. A trader who only watches P&L can get blindsided by a rule violation even while "winning."

**3. If I had another day, what would I improve?**
- Real timestamps per trade, so daily loss resets at actual session boundaries instead of assuming one session
- A trade filter/date-range picker, so the trader can inspect any specific day rather than only the aggregate
- Persisted state (a small backend or local storage) so the dashboard reflects new trades as they're entered, not just a fixed mock set
- Historical drawdown-over-time tracking (today's peak-to-trough vs. the account's all-time worst drawdown), since "worst drawdown ever" is a different and equally useful number from "current drawdown"
- Accessibility pass with a screen reader and automated axe checks — the color-coded risk system currently leans on color plus text labels, but I'd want to verify it end-to-end
- Unit tests for `calculations.ts`, since that's the part of the app where a bug would actually mislead a trader

---

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Recharts (equity curve), lucide-react, clsx. No backend, database, or auth — as scoped by the assignment.
