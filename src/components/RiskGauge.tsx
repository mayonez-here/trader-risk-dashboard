import clsx from "clsx";
import { formatCurrency } from "@/lib/calculations";

interface RiskGaugeProps {
  label: string;
  description: string;
  used: number;
  limit: number;
  usedPct: number;
  remaining: number;
}

function toneForPct(pct: number): "safe" | "warning" | "danger" {
  if (pct >= 80) return "danger";
  if (pct >= 50) return "warning";
  return "safe";
}

const toneVar: Record<string, string> = {
  safe: "var(--safe)",
  warning: "var(--warning)",
  danger: "var(--danger)",
};

export function RiskGauge({
  label,
  description,
  used,
  limit,
  usedPct,
  remaining,
}: RiskGaugeProps) {
  const tone = toneForPct(usedPct);
  const color = toneVar[tone];
  const ticks = Array.from({ length: 21 }, (_, i) => i * 5); // every 5%

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-faint)] font-mono">
            {label}
          </p>
          <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{description}</p>
        </div>
        <span
          className="font-mono text-[13px] font-medium tabular shrink-0"
          style={{ color }}
        >
          {usedPct.toFixed(0)}% used
        </span>
      </div>

      {/* Runway track */}
      <div className="relative h-8 mt-1">
        {/* graduated ticks */}
        <div className="absolute inset-x-0 top-0 h-full flex justify-between px-[1px]">
          {ticks.map((t) => (
            <div
              key={t}
              className="w-px bg-[var(--border)]"
              style={{ height: t % 20 === 0 ? "100%" : "40%" }}
            />
          ))}
        </div>

        {/* zone fill: used portion */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[var(--border)] w-full"
          aria-hidden
        />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full transition-[width] duration-500"
          style={{ width: `${usedPct}%`, backgroundColor: color }}
        />

        {/* marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center transition-[left] duration-500"
          style={{ left: `${usedPct}%` }}
        >
          <div
            className="w-2.5 h-2.5 rotate-45 border"
            style={{ backgroundColor: color, borderColor: color }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[12px] font-mono tabular">
        <span className="text-[var(--text-muted)]">
          Used <span className="text-[var(--text-primary)]">{formatCurrency(used)}</span>
        </span>
        <span className="text-[var(--text-faint)]">of {formatCurrency(limit)}</span>
        <span className={clsx("font-medium")} style={{ color }}>
          {formatCurrency(remaining)} left
        </span>
      </div>
    </div>
  );
}
