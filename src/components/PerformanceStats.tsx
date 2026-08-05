import { Card, CardHeader } from "./ui/Card";
import { StatCard } from "./ui/StatCard";
import { PerformanceStats as PerformanceStatsType } from "@/lib/calculations";
import { formatSignedCurrency } from "@/lib/calculations";

export function PerformanceStats({ stats }: { stats: PerformanceStatsType }) {
  return (
    <Card>
      <CardHeader eyebrow="Trading Performance" title="This Session" />
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          label="Win Rate"
          value={`${stats.winRate.toFixed(0)}%`}
          sub={`${stats.winningTrades}W / ${stats.losingTrades}L`}
        />
        <StatCard
          label="Winning Trades"
          value={String(stats.winningTrades)}
          tone="safe"
        />
        <StatCard
          label="Losing Trades"
          value={String(stats.losingTrades)}
          tone="danger"
        />
        <StatCard
          label="Largest Win"
          value={stats.largestWin ? formatSignedCurrency(stats.largestWin.pnl) : "—"}
          sub={stats.largestWin ? `${stats.largestWin.asset} ${stats.largestWin.direction}` : undefined}
          tone="safe"
        />
        <StatCard
          label="Largest Loss"
          value={stats.largestLoss ? formatSignedCurrency(stats.largestLoss.pnl) : "—"}
          sub={stats.largestLoss ? `${stats.largestLoss.asset} ${stats.largestLoss.direction}` : undefined}
          tone="danger"
        />
        <StatCard
          label="Avg Win / Loss"
          value={`${formatSignedCurrency(Math.round(stats.avgWin))}`}
          sub={formatSignedCurrency(Math.round(stats.avgLoss))}
        />
      </div>
    </Card>
  );
}
