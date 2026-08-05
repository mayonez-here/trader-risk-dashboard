import { AccountRules, RiskLevel, Trade } from "./types";

export interface EquityPoint {
  label: string;
  balance: number;
  peak: number;
}

export interface PerformanceStats {
  totalPnl: number;
  winningTrades: number;
  losingTrades: number;
  totalTrades: number;
  winRate: number; // 0-100
  largestWin: Trade | null;
  largestLoss: Trade | null;
  avgWin: number;
  avgLoss: number;
}

export interface RiskMetrics {
  currentBalance: number;
  peakBalance: number;
  currentDrawdown: number;
  remainingDrawdown: number;
  drawdownUsedPct: number; // 0-100, clamped
  currentDayLoss: number;
  remainingDailyLoss: number;
  dailyLossUsedPct: number; // 0-100, clamped
  riskLevel: RiskLevel;
}

export interface AssetBreakdown {
  asset: string;
  trades: number;
  pnl: number;
}

const clampPct = (n: number) => Math.min(100, Math.max(0, n));

/** Running balance after each trade, plus the running peak — the backbone
 * for both the equity curve chart and the drawdown calculation. */
export function buildEquityCurve(
  trades: Trade[],
  startingBalance: number
): EquityPoint[] {
  let balance = startingBalance;
  let peak = startingBalance;
  const points: EquityPoint[] = [
    { label: "Start", balance, peak },
  ];

  trades.forEach((trade, i) => {
    balance += trade.pnl;
    peak = Math.max(peak, balance);
    points.push({ label: `${trade.asset} ${trade.direction} #${i + 1}`, balance, peak });
  });

  return points;
}

export function calculatePerformanceStats(trades: Trade[]): PerformanceStats {
  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winners = trades.filter((t) => t.pnl > 0);
  const losers = trades.filter((t) => t.pnl < 0);

  const largestWin =
    winners.length > 0
      ? winners.reduce((a, b) => (b.pnl > a.pnl ? b : a))
      : null;
  const largestLoss =
    losers.length > 0
      ? losers.reduce((a, b) => (b.pnl < a.pnl ? b : a))
      : null;

  const avgWin =
    winners.length > 0
      ? winners.reduce((sum, t) => sum + t.pnl, 0) / winners.length
      : 0;
  const avgLoss =
    losers.length > 0
      ? losers.reduce((sum, t) => sum + t.pnl, 0) / losers.length
      : 0;

  return {
    totalPnl,
    winningTrades: winners.length,
    losingTrades: losers.length,
    totalTrades: trades.length,
    winRate: trades.length > 0 ? (winners.length / trades.length) * 100 : 0,
    largestWin,
    largestLoss,
    avgWin,
    avgLoss,
  };
}

/**
 * Drawdown is measured from the account's running peak balance, not from
 * the starting balance — that's what "trailing" risk rules (the kind most
 * prop-style evaluations use) actually track, and it's the only definition
 * that stays meaningful once the account has ever been in profit.
 */
export function calculateRiskMetrics(
  trades: Trade[],
  rules: AccountRules
): RiskMetrics {
  const curve = buildEquityCurve(trades, rules.startingBalance);
  const last = curve[curve.length - 1];

  const currentBalance = last.balance;
  const peakBalance = last.peak;
  const currentDrawdown = Math.max(0, peakBalance - currentBalance);
  const remainingDrawdown = Math.max(0, rules.maxDrawdownLimit - currentDrawdown);
  const drawdownUsedPct = clampPct(
    (currentDrawdown / rules.maxDrawdownLimit) * 100
  );

  // All trades are treated as today's session (see data.ts note), so the
  // day's loss is simply the sum of today's losing trades.
  const currentDayLoss = Math.abs(
    trades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0)
  );
  const remainingDailyLoss = Math.max(
    0,
    rules.dailyLossLimit - currentDayLoss
  );
  const dailyLossUsedPct = clampPct(
    (currentDayLoss / rules.dailyLossLimit) * 100
  );

  const worstUsedPct = Math.max(drawdownUsedPct, dailyLossUsedPct);
  let riskLevel: RiskLevel = "Safe";
  if (worstUsedPct >= 80) riskLevel = "At Risk";
  else if (worstUsedPct >= 50) riskLevel = "Approaching Limit";

  return {
    currentBalance,
    peakBalance,
    currentDrawdown,
    remainingDrawdown,
    drawdownUsedPct,
    currentDayLoss,
    remainingDailyLoss,
    dailyLossUsedPct,
    riskLevel,
  };
}

export function calculateAssetBreakdown(trades: Trade[]): AssetBreakdown[] {
  const map = new Map<string, AssetBreakdown>();
  for (const t of trades) {
    const entry = map.get(t.asset) ?? { asset: t.asset, trades: 0, pnl: 0 };
    entry.trades += 1;
    entry.pnl += t.pnl;
    map.set(t.asset, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.pnl - a.pnl);
}

export const formatCurrency = (n: number): string => {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const formatSignedCurrency = (n: number): string => {
  const sign = n > 0 ? "+" : n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US")}`;
};
