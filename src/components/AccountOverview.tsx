import { Card, CardHeader } from "./ui/Card";
import { StatCard } from "./ui/StatCard";
import { AccountRules } from "@/lib/types";
import { formatCurrency, formatSignedCurrency } from "@/lib/calculations";

interface AccountOverviewProps {
  rules: AccountRules;
  currentBalance: number;
  totalPnl: number;
}

export function AccountOverview({
  rules,
  currentBalance,
  totalPnl,
}: AccountOverviewProps) {
  return (
    <Card>
      <CardHeader eyebrow="Account" title="Balance & Rules" />
      <div className="p-4 grid grid-cols-2 gap-3">
        <StatCard
          label="Current Balance"
          value={formatCurrency(currentBalance)}
          sub={`Started at ${formatCurrency(rules.startingBalance)}`}
          tone={totalPnl >= 0 ? "safe" : "danger"}
        />
        <StatCard
          label="Total P&L"
          value={formatSignedCurrency(totalPnl)}
          sub={`${((totalPnl / rules.startingBalance) * 100).toFixed(2)}% of start`}
          tone={totalPnl >= 0 ? "safe" : "danger"}
        />
        <StatCard
          label="Max Drawdown"
          value={formatCurrency(rules.maxDrawdownLimit)}
          sub="Hard limit, trailing"
        />
        <StatCard
          label="Daily Loss Limit"
          value={formatCurrency(rules.dailyLossLimit)}
          sub="Resets each session"
        />
      </div>
    </Card>
  );
}
