export type Direction = "Long" | "Short";

export interface Trade {
  id: string;
  asset: string;
  direction: Direction;
  pnl: number;
}

export interface AccountRules {
  startingBalance: number;
  maxDrawdownLimit: number;
  dailyLossLimit: number;
}

export type RiskLevel = "Safe" | "Approaching Limit" | "At Risk";
