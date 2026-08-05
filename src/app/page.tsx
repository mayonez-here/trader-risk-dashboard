import { accountRules, trades } from "@/lib/data";
import {
  buildEquityCurve,
  calculatePerformanceStats,
  calculateRiskMetrics,
} from "@/lib/calculations";
import { RiskBanner } from "@/components/RiskBanner";
import { RiskGauge } from "@/components/RiskGauge";
import { AccountOverview } from "@/components/AccountOverview";
import { PerformanceStats } from "@/components/PerformanceStats";
import { TradeLog } from "@/components/TradeLog";
import { EquityCurve } from "@/components/EquityCurve";
import { Card, CardHeader } from "@/components/ui/Card";

export default function Home() {
  const performance = calculatePerformanceStats(trades);
  const risk = calculateRiskMetrics(trades, accountRules);
  const equityCurve = buildEquityCurve(trades, accountRules.startingBalance);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border-soft)] sticky top-0 z-10 backdrop-blur bg-[var(--bg)]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[var(--accent-dim)] border border-[var(--accent)]/30 flex items-center justify-center">
              <span className="w-2 h-2 rounded-sm bg-[var(--accent)]" />
            </div>
            <div>
              <p className="font-display font-semibold text-[14px] leading-none">
                Tradescape
              </p>
              <p className="text-[11px] text-[var(--text-faint)] font-mono leading-none mt-1">
                Trader Risk Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-mono text-[var(--text-muted)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--safe)] opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--safe)]" />
            </span>
            Session live
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-5">
          <RiskBanner
            riskLevel={risk.riskLevel}
            drawdownUsedPct={risk.drawdownUsedPct}
            dailyLossUsedPct={risk.dailyLossUsedPct}
          />

          <Card>
            <CardHeader eyebrow="Rule Compliance" title="Are you at risk of a violation?" />
            <div className="p-4 grid sm:grid-cols-2 gap-3">
              <RiskGauge
                label="Drawdown"
                description="Distance from your peak balance"
                used={risk.currentDrawdown}
                limit={accountRules.maxDrawdownLimit}
                usedPct={risk.drawdownUsedPct}
                remaining={risk.remainingDrawdown}
              />
              <RiskGauge
                label="Daily Loss"
                description="Losses booked so far this session"
                used={risk.currentDayLoss}
                limit={accountRules.dailyLossLimit}
                usedPct={risk.dailyLossUsedPct}
                remaining={risk.remainingDailyLoss}
              />
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-5">
            <AccountOverview
              rules={accountRules}
              currentBalance={risk.currentBalance}
              totalPnl={performance.totalPnl}
            />
            <PerformanceStats stats={performance} />
          </div>

          <div className="grid lg:grid-cols-5 gap-5 items-start">
            <div className="lg:col-span-3">
              <EquityCurve
                data={equityCurve}
                startingBalance={accountRules.startingBalance}
                maxDrawdownLimit={accountRules.maxDrawdownLimit}
              />
            </div>
            <div className="lg:col-span-2">
              <TradeLog trades={trades} />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[var(--border-soft)] py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-[var(--text-faint)] font-mono">
          <span>Tradescape — Full Stack Developer Assignment</span>
          <span>All figures derived from trade data · mock session</span>
        </div>
      </footer>
    </div>
  );
}
