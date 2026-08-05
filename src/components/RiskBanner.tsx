import clsx from "clsx";
import { RiskLevel } from "@/lib/types";

interface RiskBannerProps {
  riskLevel: RiskLevel;
  drawdownUsedPct: number;
  dailyLossUsedPct: number;
}

const copy: Record<
  RiskLevel,
  { message: string; sub: string; tone: "safe" | "warning" | "danger" }
> = {
  Safe: {
    message: "You're safe.",
    sub: "Well within both your drawdown and daily loss limits.",
    tone: "safe",
  },
  "Approaching Limit": {
    message: "Approaching a limit.",
    sub: "You're within range of a rule breach — trade deliberately.",
    tone: "warning",
  },
  "At Risk": {
    message: "At risk of a violation.",
    sub: "One more bad trade could breach your account rules.",
    tone: "danger",
  },
};

const dotColor: Record<string, string> = {
  safe: "var(--safe)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export function RiskBanner({
  riskLevel,
  drawdownUsedPct,
  dailyLossUsedPct,
}: RiskBannerProps) {
  const { message, sub, tone } = copy[riskLevel];
  const color = dotColor[tone];
  const driver =
    drawdownUsedPct >= dailyLossUsedPct ? "drawdown" : "daily loss";

  return (
    <div
      className="rounded-xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative overflow-hidden"
      style={{
        borderColor: `${color}33`,
        background: `linear-gradient(135deg, ${color}14, var(--surface) 55%)`,
      }}
    >
      <div className="flex items-center gap-4">
        <span className="relative flex h-3.5 w-3.5 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"
            style={{ backgroundColor: color }}
          />
          <span
            className="relative inline-flex rounded-full h-3.5 w-3.5"
            style={{ backgroundColor: color }}
          />
        </span>
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.14em] font-mono font-medium mb-1"
            style={{ color }}
          >
            {riskLevel}
          </p>
          <h1 className="font-display text-2xl sm:text-[28px] font-semibold text-[var(--text-primary)] leading-tight">
            {message}
          </h1>
        </div>
      </div>

      <div className="sm:ml-auto sm:text-right">
        <p className="text-[13px] text-[var(--text-muted)] max-w-xs sm:ml-auto">{sub}</p>
        {riskLevel !== "Safe" && (
          <p
            className={clsx(
              "text-[12px] font-mono mt-1"
            )}
            style={{ color }}
          >
            Driven by {driver}
          </p>
        )}
      </div>
    </div>
  );
}
