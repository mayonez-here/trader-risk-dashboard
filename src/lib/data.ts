import { AccountRules, Trade } from "./types";

// These are the only "given" numbers in the app — everything downstream
// (balance, P&L, drawdown, win rate, risk status, etc.) is calculated
// from this raw data, never hardcoded separately.

export const accountRules: AccountRules = {
  startingBalance: 100000,
  maxDrawdownLimit: 10000,
  dailyLossLimit: 5000,
};

// Trades are assumed to be a single trading day's session, in execution
// order, since the assignment doesn't provide timestamps. This is the
// simplest assumption that lets the daily-loss-limit math mean something.
export const trades: Trade[] = [
  { id: "t1", asset: "BTC", direction: "Long", pnl: 1200 },
  { id: "t2", asset: "ETH", direction: "Short", pnl: -450 },
  { id: "t3", asset: "BTC", direction: "Short", pnl: 800 },
  { id: "t4", asset: "SOL", direction: "Long", pnl: -300 },
  { id: "t5", asset: "ETH", direction: "Long", pnl: 2000 },
];
