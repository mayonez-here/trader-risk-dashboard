import { Card, CardHeader } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Trade } from "@/lib/types";
import { formatSignedCurrency } from "@/lib/calculations";
import clsx from "clsx";

export function TradeLog({ trades }: { trades: Trade[] }) {
  return (
    <Card>
      <CardHeader eyebrow={`${trades.length} Trades`} title="Trade Log" />
      <div className="p-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.06em] text-[var(--text-faint)] font-mono">
              <th className="text-left font-medium px-3 py-2">#</th>
              <th className="text-left font-medium px-3 py-2">Asset</th>
              <th className="text-left font-medium px-3 py-2">Direction</th>
              <th className="text-right font-medium px-3 py-2">P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <tr
                key={trade.id}
                className="border-t border-[var(--border-soft)] hover:bg-[var(--surface-2)] transition-colors"
              >
                <td className="px-3 py-2.5 font-mono text-[var(--text-faint)]">
                  {String(i + 1).padStart(2, "0")}
                </td>
                <td className="px-3 py-2.5 font-medium text-[var(--text-primary)]">
                  {trade.asset}
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone={trade.direction === "Long" ? "accent" : "neutral"}>
                    {trade.direction}
                  </Badge>
                </td>
                <td
                  className={clsx(
                    "px-3 py-2.5 text-right font-mono tabular font-medium",
                    trade.pnl >= 0 ? "text-[var(--safe)]" : "text-[var(--danger)]"
                  )}
                >
                  {formatSignedCurrency(trade.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
