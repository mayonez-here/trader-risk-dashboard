import clsx from "clsx";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "safe" | "danger";
  icon?: ReactNode;
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "text-[var(--text-primary)]",
  safe: "text-[var(--safe)]",
  danger: "text-[var(--danger)]",
};

export function StatCard({ label, value, sub, tone = "default", icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3.5 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-faint)] font-mono truncate">
          {label}
        </span>
        {icon && <span className="text-[var(--text-faint)] shrink-0">{icon}</span>}
      </div>
      <span
        className={clsx(
          "font-mono text-[20px] font-medium tabular leading-none truncate",
          toneClasses[tone]
        )}
      >
        {value}
      </span>
      {sub && (
        <span className="text-[12px] text-[var(--text-muted)] leading-none">{sub}</span>
      )}
    </div>
  );
}
